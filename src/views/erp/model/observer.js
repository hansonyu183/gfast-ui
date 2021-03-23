import vrApi from '@/api/erp/vr.js'
import { IDENTITY } from './vrCom.js'

export default function observable(target = {}, afterSet = {}, beforeSet = {}
) {
  function deepProxy(obj, key, path, root, parent, callBack) {
    if (obj === null || typeof obj !== 'object' || key === '__proto__') {
      return obj
    }
    let handel = {
      get: (target, property, receiver) => {
        if (property === IDENTITY && !target.hasOwnProperty(IDENTITY)) { // missing '!'
          return target
        }
        return Reflect.get(target, property, receiver)
      },
      set(target, property, value, receiver) {
        const oldVal = target[property]
        const tarTp = Object.prototype.toString.call(target)
        if (tarTp === '[object Array]') {
          value = deepProxy(value, property, path, root, parent, callBack)
        } else if (tarTp === '[object Object]') {
          value = deepProxy(value, property, property, root, target, callBack)
        }
        const r = Reflect.set(target, property, value, receiver)
        if (r && property !== '__proto__' && callBack.afterSet[path] && callBack.afterSet[path][property]) {
          callBack.afterSet[path][property]({ root, parent, target, key, value, oldVal, receiver })
        }
        return r
      }
    }
    const objTp = Object.prototype.toString.call(obj)
    for (const k in obj) {
      if (objTp === '[object Array]') {
        obj[k] = deepProxy(obj[k], k, path, root, parent, callBack)
      } else if (objTp === '[object Object]') {
        obj[k] = deepProxy(obj[k], k, k, root, obj[k], callBack)
      }
    }
    return new Proxy(obj, handel)
  }
  let cb = { afterSet: afterSet, beforeSet: beforeSet }
  let p = deepProxy(target, 'root', 'root', target, target, cb)

  const loadVr = async function (type, id) {
    const response = await vrApi.getByID(type, id)
    let data = {}
    if (response.code === 200) {
      data.nextId = response.data.nextID
      data.preId = response.data.preID
      data.vr = response.data.vr ?? {}
      data.vrMain = response.data.vrMain ?? {}
      data.vrNum = response.data.vrNum ?? []
      const pf = response.data.vrPf ?? []
      for (const i in data.vrNum) {
        data.vrNum[i].vrPf = pf.filter((pItem) => {
          return pItem.iid === data.vrNum[i].id
        })
      }
    }
    p = deepProxy(data, 'root', 'root', data, data, cb)
    return { code: response.code, msg: response.msg, mod: p }
  }

  return {
    model: p,
  }

}