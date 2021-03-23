/*//store.js
import vrApi from '@/api/erp/vr'
import { optApi } from '@/api/erp/ui'

import store from '@/store'
import * as erp from '../utils'
import { BigNumber } from 'bignumber.js'
BigNumber.config({ DECIMAL_PLACES: 4 })

let getOpt = store.getters.getOpt
const resBomList = getOpt('res_bom')
const ebaBomList = getOpt('eba_bom')
const resList = getOpt('res')
const IDENTITY = Symbol('proxy_target_identity')
// 节流
function throttle(fn, delay = 100) {
  let timer = null;
  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay)
  }
}

const vrNumSumToMain = throttle((vrNum, vrMain) => {
  let amo = new BigNumber(0)
  let packNum = new BigNumber(0)
  let num = new BigNumber(0)
  for (const item of vrNum) {
    amo = amo.plus(item.amo)
    num = num.plus(item.num)
    packNum = packNum.plus(item.pack_num)
  }
  let target = vrMain[IDENTITY]
  target.print_amo = amo.toNumber()
  target.amo = amo.toNumber()
  target.print_pack_num = packNum.toNumber()
}, 300)

const recountVrPf = throttle((vrNum) => {
  let pfList = vrNum.vrPf
  let sumPerPckNum = new BigNumber(0)
  let sumNum = new BigNumber(0)
  let sumGuideAmo = new BigNumber(0)
  for (const item of pfList) {
    sumNum = sumNum.plus(item.num ?? 0)
    sumPerPckNum = sumPerPckNum.plus(item.per_pack_num ?? 0)
    const gAmo = new BigNumber(item.per_pack_num).times(item.guide_price)
    sumGuideAmo = sumGuideAmo.plus(gAmo)
  }
  for (const i in pfList) {
    // pf[i].per_pack_num = new BigNumber(vrNum.per_pack_num).times(pf[i].per_pack_num).div(sumPerPckNum).toNumber()
    let pf = pfList[i][IDENTITY]
    const rate = new BigNumber(pf.per_pack_num).div(sumPerPckNum)
    const guideRate = new BigNumber(pf.per_pack_num).times(pf.guide_price).div(sumGuideAmo)
    const newPerPackNum = new BigNumber(vrNum.per_pack_num).times(rate)
    const newNum = new BigNumber(vrNum.num).times(rate)
    const newAmo = new BigNumber(vrNum.amo).times(guideRate)
    const newPrice = newAmo.div(newNum)
    pf.per_pack_num = newPerPackNum.toNumber()
    pf.num = newNum.toNumber()
    pf.amo = newAmo.toNumber()
    pf.price = newPrice.toNumber()
  }

}, 300)

const vrPfSumToVrNum = throttle((vrNum, root) => {
  let sumAmo = new BigNumber(0)
  let sumGuideAmo = new BigNumber(0)
  let sumPerPackNum = new BigNumber(0)
  let sumNum = new BigNumber(0)
  for (const item of vrNum.vrPf) {
    sumAmo = sumAmo.plus(item.amo)
    sumNum = sumNum.plus(item.num)
    sumPerPackNum = sumPerPackNum.plus(item.per_pack_num)
    const gAmo = new BigNumber(item.per_pack_num).times(item.guide_price)
    sumGuideAmo = sumGuideAmo.plus(gAmo)
  }
  vrNum.per_pack_num = sumPerPackNum.toNumber()
  vrNum.price = sumAmo.div(sumNum).toNumber()
  vrNum.guide_price = sumGuideAmo.div(sumPerPackNum).toNumber()
  vrNum.num = sumNum.toNumber()
  vrNum.amo = sumAmo.toNumber()
  vrNumSumToMain(root.vrNum, root.vrMain)
}, 300)

const makeBomPf = (bomList, mainRes) => {
  let i = 0
  let sumPack = 0
  let vrPf = []
  for (const item of bomList) {
    const bomNum = new BigNumber(mainRes.pack_num).times(item.per_pack_num).toNumber()
    sumPack = new BigNumber(sumPack).plus(item.per_pack_num).toNumber()
    let pf = {
      id: i,
      iid: mainRes.id,
      res_id: item.bom_res_id,
      per_pack_num: item.per_pack_num ?? 1,
      num: bomNum,
      price: 0,
      amo: 0,
      guide_price: 0
    }
    vrPf.push(pf)
    i++
  }
  return {
    vrPf, sumPack
  }
}

const updateGuidePrice = async (row) => {
  const resp = await optApi.getByNameAndID('res', row.res_id)
  row.guide_price = resp.data.guide_price
  row.price = resp.data.guide_price
}

let afterSet = {
  mod: {
    vr: (p) => {
    }
  },
  vr: {
    date: (p) => {
      let date = new Date()
      date.setDate(erp.getDateByStr(p.value).getDate() + 1)
      p.root.vrMain.tran_date = erp.formatDate(date, 'yyyyMMdd')
    }
  },
  vrMain: {
    eba_id: (p) => {
      const eba = getOpt('eba').find((obj) => obj.id === p.value)
      p.target.sq_price = getOpt('ebasq').find(
        (obj) => obj.id === eba.ebasq_id
      )?.price
      p.target.emp_id = eba.emp_id
    }
  },
  vrNum: {
    length: (p) => {
      if (p.oldVal !== p.value) {
        vrNumSumToMain(p.parent, p.root.vrMain)
      }
    },
    amo: (p) => {
      p.target.price = new BigNumber(p.value).div(p.target.num).toNumber()
      recountVrPf(p.target)
    },
    pack_num: async (p) => {
      p.target.num = new BigNumber(p.value).times(p.target.per_pack_num).toNumber()
      p.target.amo = new BigNumber(p.target.price).times(p.target.num).toNumber()
      recountVrPf(p.target)
    },
    per_pack_num: (p) => {
      p.target.num = new BigNumber(p.target.pack_num).times(p.value).toNumber()
      p.target.amo = new BigNumber(p.target.price).times(p.target.num).toNumber()
      recountVrPf(p.target)
    },
    num: (p) => {
      p.target.per_pack_num = new BigNumber(p.value).div(p.target.pack_num).toNumber()
      p.target.amo = new BigNumber(p.target.price).times(p.value).toNumber()
      recountVrPf(p.target)
    },
    price: (p) => {
      p.target.amo = new BigNumber(p.value).times(p.target.num).toNumber()
      recountVrPf(p.target)
    },
    res_id: (p) => {
      if (!p.value || p.value === p.oldVal) {
        return
      }
      const res = resList.find((obj) => obj.id === p.value)

      let pfList = {}
      if ([1, 3].includes(res.reskind_id)) {
        let bomList = resBomList.filter((obj) => obj.res_id === p.value)
        pfList = makeBomPf(bomList, p.target)
      } else if (res.reskind_id === 2) {
        let bomList = ebaBomList.filter((obj) => obj.res_id === p.value && obj.eba_id === p.root.vrMain.eba_id)
        pfList = makeBomPf(bomList, p.target)
      } else if (res.reskind_id === 4) {
        const bomNum = new BigNumber(p.target.pack_num).times(res.per_pack_num).toNumber()
        let pf = {
          id: 1,
          iid: p.target.id,
          res_id: p.value,
          per_pack_num: res.per_pack_num ?? 1,
          num: bomNum,
          price: 0,
          amo: 0,
          guide_price: 0
        }
        pfList.vrPf = [pf]
        pfList.sumPack = res.per_pack_num
      }
      p.receiver.vrPf = pfList.vrPf ?? []
      p.target.print_res = res.name
      p.target.print_model = res.model
      p.target.per_pack_num = pfList.sumPack ?? 0
      for (const i in p.receiver.vrPf) {
        updateGuidePrice(p.receiver.vrPf[i])
      }
      //updateGuidePrice(p.receiver)
      //console.log(p.target.vrPf)
    }
  },
  vrPf: {
    length: (p) => {
      if (p.oldVal !== p.value) {
        vrPfSumToVrNum(p.parent, p.root)
      }
    },
    amo: (p) => {
      p.target.price = new BigNumber(p.value).div(p.target.num).toNumber()
      vrPfSumToVrNum(p.parent, p.root)
    },
    per_pack_num: (p) => {
      p.target.num = new BigNumber(p.parent.pack_num).times(p.value).toNumber()
      p.target.amo = new BigNumber(p.target.price).times(p.target.num).toNumber()
      vrPfSumToVrNum(p.parent, p.root)
    },
    num: (p) => {
      p.target.per_pack_num = new BigNumber(p.value).div(p.parent.pack_num).toNumber()
      p.target.amo = new BigNumber(p.target.price).times(p.value).toNumber()
      vrPfSumToVrNum(p.parent, p.root)
    },
    price: (p) => {
      p.target.amo = new BigNumber(p.target.num).times(p.value).toNumber()
      vrPfSumToVrNum(p.parent, p.root)
    },
    res_id: (p) => {
      updateGuidePrice(p.receiver)
    },
    guide_price: (p) => {
      console.log('guide_price', p)
      let sumAmo = new BigNumber(0)
      for (const item of p.parent.vrPf) {
        const amo = new BigNumber(item.per_pack_num).times(item.guide_price)
        sumAmo = sumAmo.plus(amo)
      }
      p.parent.guide_price = sumAmo.div(p.parent.per_pack_num).toNumber()
    }
  }
}

function deepProxy(obj, key, path, root, parent) {
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
        value = deepProxy(value, property, path, root, parent)
      } else if (tarTp === '[object Object]') {
        value = deepProxy(value, property, property, root, target)
      }
      const r = Reflect.set(target, property, value, receiver)
      if (r && property !== '__proto__' && afterSet[path] && afterSet[path][property]) {
        afterSet[path][property]({ root, parent, target, key, value, oldVal, receiver })
      }
      return r
    }
  }
  const objTp = Object.prototype.toString.call(obj)
  for (const k in obj) {
    if (objTp === '[object Array]') {
      obj[k] = deepProxy(obj[k], k, path, root, parent)
    } else if (objTp === '[object Object]') {
      obj[k] = deepProxy(obj[k], k, k, root, obj[k])
    }
  }
  return new Proxy(obj, handel)
}


export let server = {
  loadData: async function (type, id) {
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
    let model = deepProxy(data, 'mod', 'mod', data, data);
    // register the observer on the profile field of the model
    return { code: response.code, msg: response.msg, mod: model }
  }
}
//export let observableMod = Vue.observable(proxyMod);*/