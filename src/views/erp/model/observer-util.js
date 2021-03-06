'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const connectionStore = new WeakMap();
const ITERATION_KEY = Symbol('iteration key');

function storeObservable(obj) {
  // this will be used to save (obj.key -> reaction) connections later
  connectionStore.set(obj, new Map());
}

function registerReactionForOperation(reaction, { target, key, type }) {
  if (type === 'iterate') {
    key = ITERATION_KEY;
  }

  const reactionsForObj = connectionStore.get(target);
  let reactionsForKey = reactionsForObj.get(key);
  if (!reactionsForKey) {
    reactionsForKey = new Set();
    reactionsForObj.set(key, reactionsForKey);
  }
  // save the fact that the key is used by the reaction during its current run
  if (!reactionsForKey.has(reaction)) {
    reactionsForKey.add(reaction);
    reaction.cleaners.push(reactionsForKey);
  }
}

function getReactionsForOperation({ target, key, type }) {

  const reactionsForTarget = connectionStore.get(target);
  const reactionsForKey = new Set();

  if (type === 'clear') {
    reactionsForTarget.forEach((_, key) => {
      addReactionsForKey(reactionsForKey, reactionsForTarget, key);
    });
  } else {
    addReactionsForKey(reactionsForKey, reactionsForTarget, key);
  }

  if (type === 'add' || type === 'delete' || type === 'clear') {
    const iterationKey = Array.isArray(target) ? 'length' : ITERATION_KEY;
    addReactionsForKey(reactionsForKey, reactionsForTarget, iterationKey);
  }
  return reactionsForKey;
}

function addReactionsForKey(reactionsForKey, reactionsForTarget, key) {

  const reactions = reactionsForTarget.get(key);
  reactions && reactions.forEach(reactionsForKey.add, reactionsForKey);
}

function releaseReaction(reaction) {
  if (reaction.cleaners) {
    reaction.cleaners.forEach(releaseReactionKeyConnection, reaction);
  }
  reaction.cleaners = [];
}

function releaseReactionKeyConnection(reactionsForKey) {

  reactionsForKey.delete(this);
}

// reactions can call each other and form a call stack
const reactionStack = [];
let isDebugging = false;

function runAsReaction(reaction, fn, context, args) {
  // do not build reactive relations, if the reaction is unobserved
  if (reaction.unobserved) {
    return Reflect.apply(fn, context, args);
  }

  // only run the reaction if it is not already in the reaction stack
  // TODO: improve this to allow explicitly recursive reactions
  if (reactionStack.indexOf(reaction) === -1) {
    // release the (obj -> key -> reactions) connections
    // and reset the cleaner connections
    releaseReaction(reaction);

    try {
      // set the reaction as the currently running one
      // this is required so that we can create (observable.prop -> reaction) pairs in the get trap
      reactionStack.push(reaction);
      if (reaction.init) {
        Reflect.apply(reaction.init, context, args);
        reaction.init = null
        return
      } else {
        return Reflect.apply(fn, context, args);
      }
    } finally {
      // always remove the currently running flag from the reaction when it stops execution
      reactionStack.pop();
    }
  }
}

// register the currently running reaction to be queued again on obj.key mutations
function registerRunningReactionForOperation(operation) {
  // get the current reaction from the top of the stack
  const runningReaction = reactionStack[reactionStack.length - 1];
  if (runningReaction) {
    debugOperation(runningReaction, operation);
    registerReactionForOperation(runningReaction, operation);
  }
}

function queueReactionsForOperation(operation) {
  // iterate and queue every reaction, which is triggered by obj.key mutation
  getReactionsForOperation(operation).forEach(queueReaction, operation);
}

function queueReaction(reaction) {

  debugOperation(reaction, this);
  // queue the reaction for later execution or run it immediately
  if (typeof reaction.scheduler === 'function') {
    reaction.scheduler(reaction);
  } else if (typeof reaction.scheduler === 'object') {
    reaction.scheduler.add(reaction);
  } else {
    reaction();
  }
}

function debugOperation(reaction, operation) {
  if (reaction.debugger && !isDebugging) {
    try {
      isDebugging = true;
      reaction.debugger(operation);
    } finally {
      isDebugging = false;
    }
  }
}

function hasRunningReaction() {
  return reactionStack.length > 0;
}

const IS_REACTION = Symbol('is reaction');

function observe(fn, options = {}) {
  // wrap the passed function in a reaction, if it is not already one
  const reaction = fn[IS_REACTION] ? fn : function reaction() {
    return runAsReaction(reaction, fn, this, arguments);
  };
  // save the scheduler and debugger on the reaction
  reaction.scheduler = options.scheduler;
  reaction.debugger = options.debugger;
  reaction.init = options.init;
  // save the fact that this is a reaction
  reaction[IS_REACTION] = true;
  // run the reaction once if it is not a lazy one
  if (!options.lazy) {
    reaction();
  }
  return reaction;
}

function unobserve(reaction) {
  // do nothing, if the reaction is already unobserved
  if (!reaction.unobserved) {
    // indicate that the reaction should not be triggered any more
    reaction.unobserved = true;
    // release (obj -> key -> reaction) connections
    releaseReaction(reaction);
  }
  // unschedule the reaction, if it is scheduled
  if (typeof reaction.scheduler === 'object') {
    reaction.scheduler.delete(reaction);
  }
}

const proxyToRaw = new WeakMap();
const rawToProxy = new WeakMap();

const hasOwnProperty = Object.prototype.hasOwnProperty;

function findObservable(obj) {
  const observableObj = rawToProxy.get(obj);
  if (hasRunningReaction() && typeof obj === 'object' && obj !== null) {
    if (observableObj) {
      return observableObj;
    }
    return observable(obj);
  }
  return observableObj || obj;
}

function patchIterator(iterator, isEntries) {
  const originalNext = iterator.next;
  iterator.next = () => {
    let { done, value } = originalNext.call(iterator);
    if (!done) {
      if (isEntries) {
        value[1] = findObservable(value[1]);
      } else {
        value = findObservable(value);
      }
    }
    return { done, value };
  };
  return iterator;
}

let observerPause = false
const pauseAllObserver = () => {
  observerPause = true
}

const resumeAllObserver = () => {
  observerPause = false
}
const instrumentations = {
  has(key) {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, key, type: 'has' });
    return proto.has.apply(target, arguments);
  },
  get(key) {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, key, type: 'get' });
    return findObservable(proto.get.apply(target, arguments));
  },
  add(key) {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    const hadKey = proto.has.call(target, key);
    // forward the operation before queueing reactions
    const result = proto.add.apply(target, arguments);
    if (!hadKey) {
      queueReactionsForOperation({ target, key, value: key, type: 'add' });
    }
    return result;
  },
  set(key, value) {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    const hadKey = proto.has.call(target, key);
    const oldValue = proto.get.call(target, key);
    // forward the operation before queueing reactions
    const result = proto.set.apply(target, arguments);

    if (!hadKey) {
      queueReactionsForOperation({ target, key, value, type: 'add' });
    } else if (value !== oldValue) {
      queueReactionsForOperation({ target, key, value, oldValue, type: 'set' });
    }

    return result;
  },
  delete(key) {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    const hadKey = proto.has.call(target, key);
    const oldValue = proto.get ? proto.get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    const result = proto.delete.apply(target, arguments);
    if (hadKey) {
      queueReactionsForOperation({ target, key, oldValue, type: 'delete' });
    }
    return result;
  },
  clear() {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    const hadItems = target.size !== 0;
    const oldTarget = target instanceof Map ? new Map(target) : new Set(target);
    // forward the operation before queueing reactions
    const result = proto.clear.apply(target, arguments);
    if (hadItems) {
      queueReactionsForOperation({ target, oldTarget, type: 'clear' });
    }
    return result;
  },
  forEach(cb, ...args) {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, type: 'iterate' });
    // swap out the raw values with their observable pairs
    // before passing them to the callback
    const wrappedCb = (value, ...rest) => cb(findObservable(value), ...rest);
    return proto.forEach.call(target, wrappedCb, ...args);
  },
  keys() {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, type: 'iterate' });
    return proto.keys.apply(target, arguments);
  },
  values() {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, type: 'iterate' });
    const iterator = proto.values.apply(target, arguments);
    return patchIterator(iterator, false);
  },
  entries() {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, type: 'iterate' });
    const iterator = proto.entries.apply(target, arguments);
    return patchIterator(iterator, true);
  },
  [Symbol.iterator]() {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, type: 'iterate' });
    const iterator = proto[Symbol.iterator].apply(target, arguments);
    return patchIterator(iterator, target instanceof Map);
  },
  get size() {
    const target = proxyToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    registerRunningReactionForOperation({ target, type: 'iterate' });
    return Reflect.get(proto, 'size', target);
  }
};

var collectionHandlers = {
  get(target, key, receiver) {
    // instrument methods and property accessors to be reactive
    target = hasOwnProperty.call(instrumentations, key) ? instrumentations : target;
    return Reflect.get(target, key, receiver);
  }
};

// eslint-disable-next-line
const globalObj = typeof window === 'object' ? window : Function('return this')();

// built-in object can not be wrapped by Proxies
// their methods expect the object instance as the 'this' instead of the Proxy wrapper
// complex objects are wrapped with a Proxy of instrumented methods
// which switch the proxy to the raw object and to add reactive wiring
const handlers = new Map([[Map, collectionHandlers], [Set, collectionHandlers], [WeakMap, collectionHandlers], [WeakSet, collectionHandlers], [Object, false], [Array, false], [Int8Array, false], [Uint8Array, false], [Uint8ClampedArray, false], [Int16Array, false], [Uint16Array, false], [Int32Array, false], [Uint32Array, false], [Float32Array, false], [Float64Array, false]]);

function shouldInstrument({ constructor }) {
  const isBuiltIn = typeof constructor === 'function' && constructor.name in globalObj && globalObj[constructor.name] === constructor;
  return !isBuiltIn || handlers.has(constructor);
}

function getHandlers(obj) {
  return handlers.get(obj.constructor);
}

const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const wellKnownSymbols = new Set(Object.getOwnPropertyNames(Symbol).map(key => Symbol[key]).filter(value => typeof value === 'symbol'));

// intercept get operations on observables to know which reaction uses their properties
function get(target, key, receiver) {
  const result = Reflect.get(target, key, receiver);
  // do not register (observable.prop -> reaction) pairs for well known symbols
  // these symbols are frequently retrieved in low level JavaScript under the hood
  if (typeof key === 'symbol' && wellKnownSymbols.has(key)) {
    return result;
  }
  if (key === '__proto__') {
    return result;
  }
  // register and save (observable.prop -> runningReaction)
  registerRunningReactionForOperation({ target, key, receiver, type: 'get' });
  // if we are inside a reaction and observable.prop is an object wrap it in an observable too
  // this is needed to intercept property access on that object too (dynamic observable tree)
  const observableResult = rawToProxy.get(result);
  if (hasRunningReaction() && typeof result === 'object' && result !== null) {
    if (observableResult) {
      return observableResult;
    }
    // do not violate the none-configurable none-writable prop get handler invariant
    // fall back to none reactive mode in this case, instead of letting the Proxy throw a TypeError
    const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
    if (!descriptor || !(descriptor.writable === false && descriptor.configurable === false)) {
      return observable(result);
    }
  }
  // otherwise return the observable wrapper if it is already created and cached or the raw object
  return observableResult || result;
}

function has(target, key) {
  const result = Reflect.has(target, key);
  // register and save (observable.prop -> runningReaction)
  registerRunningReactionForOperation({ target, key, type: 'has' });
  return result;
}

function ownKeys(target) {
  registerRunningReactionForOperation({ target, type: 'iterate' });
  return Reflect.ownKeys(target);
}

// intercept set operations on observables to know when to trigger reactions
function set(target, key, value, receiver) {
  // make sure to do not pollute the raw object with observables
  if (typeof value === 'object' && value !== null) {
    value = proxyToRaw.get(value) || value;
  }
  // save if the object had a descriptor for this key
  const hadKey = hasOwnProperty$1.call(target, key);
  // save if the value changed because of this set operation
  const oldValue = target[key];
  // execute the set operation before running any reaction
  const result = Reflect.set(target, key, value, receiver);
  if (key === '__proto__') {
    return result;
  }
  if (observerPause) {
    return result;
  }
  // do not queue reactions if the target of the operation is not the raw receiver
  // (possible because of prototypal inheritance)
  if (target !== proxyToRaw.get(receiver)) {
    return result;
  }
  // queue a reaction if it's a new property or its value changed
  if (!hadKey) {
    queueReactionsForOperation({ target, key, value, receiver, type: 'add' });
  } else if (value !== oldValue) {
    queueReactionsForOperation({
      target,
      key,
      value,
      oldValue,
      receiver,
      type: 'set'
    });
  }
  return result;
}

function deleteProperty(target, key) {
  // save if the object had the key
  const hadKey = hasOwnProperty$1.call(target, key);
  const oldValue = target[key];
  // execute the delete operation before running any reaction
  const result = Reflect.deleteProperty(target, key);
  // only queue reactions for delete operations which resulted in an actual change
  if (hadKey) {
    queueReactionsForOperation({ target, key, oldValue, type: 'delete' });
  }
  return result;
}

var baseHandlers = { get, has, ownKeys, set, deleteProperty };

function observable(obj = {}) {

  // if it is already an observable or it should not be wrapped, return it
  if (proxyToRaw.has(obj) || !shouldInstrument(obj)) {
    return obj;
  }
  // if it already has a cached observable wrapper, return it
  // otherwise create a new observable
  return rawToProxy.get(obj) || createObservable(obj);
}

function createObservable(obj) {
  // if it is a complex built-in object or a normal object, wrap it
  const handlers = getHandlers(obj) || baseHandlers;
  const observable = new Proxy(obj, handlers);
  // save these to switch between the raw object and the wrapped object with ease later
  rawToProxy.set(obj, observable);
  proxyToRaw.set(observable, obj);
  // init basic data structures to save and cleanup later (observable.prop -> reaction) connections
  storeObservable(obj);
  return observable;
}

function isObservable(obj) {
  return proxyToRaw.has(obj);
}

function raw(obj) {
  return proxyToRaw.get(obj) || obj;
}

exports.observe = observe;
exports.unobserve = unobserve;
exports.observable = observable;
exports.isObservable = isObservable;
exports.raw = raw;
exports.pauseAllObserver = pauseAllObserver;
exports.resumeAllObserver = resumeAllObserver;
