import { observable, observe, raw } from './observer-util'
import store from '@/store'
import { BigNumber } from 'bignumber.js'
import setVrPf from './vrPf'

BigNumber.config({ DECIMAL_PLACES: 4 })
let getOpt = store.getters.getOpt

function setRowObserve(ob) {
  //amo
  observe(() => {
    console.log('amo')
    ob.amo = new BigNumber(ob.price).times(ob.num).toNumber()
  }, {
    init: () => [ob.num, ob.price]
  })
  //price
  observe(() => {
    console.log('price')
    ob.price = new BigNumber(ob.amo).div(raw(ob).num).toNumber()
  }, {
    init: () => [ob.amo]
  })

  //num
  observe(() => {
    console.log('num')

    ob.num = new BigNumber(ob.pack_num).times(ob.per_pack_num).toNumber()
    return ('compute num')

  }, {
    init: () => [ob.pack_num, ob.per_pack_num]
  })

  //per_pack_num
  observe(() => {
    console.log('per_pack_num')

    ob.per_pack_num = new BigNumber(ob.num).div(raw(ob).pack_num).toNumber()
  }, {
    init: () => [ob.num]
  })
}

export default function setObserve(ob) {
  let vm = ob.vrNum
  let t = raw(ob.vrNum)
  for (const key in ob.vrNum) {
    setRowObserve(ob.vrNum[key])
    if (ob.vrNum[key].vrPf) {
     // observable(ob.vrNum[key].vrPf)
      setVrPf(ob.vrNum[key].vrPf, ob.vrNum[key])
    }
  }
  //watchLength:
  observe(() => { ob.vrNum.length }, {
    init: () => [ob.vrNum.length],
    debugger: operation => {
      if (operation.type !== 'add' || Object.keys(operation.value).length > 0) {
        return
      }
      const target = operation.target
      const row1 = target[0]
      const key = operation.key
      const vid = ob.vr.id
      //let newRow = {}
      for (const k in row1) {
        if (Object.hasOwnProperty.call(row1, k)) {
          ob.vrNum[key][k] = null
        }
      }
      ob.vrNum[key]['vid'] = vid
      let newId = ob.vrNum.reduce(function (pre, cur) {
        const cid = Number(cur.id) ?? 0
        return cid > pre ? cid : pre
      }, 0) + 1
      ob.vrNum[key]['id'] = newId
      ob.vrNum[key] = observable(ob.vrNum[key])
      setRowObserve(ob.vrNum[key])
      const pf1 = row1.vrPf[0] ?? {}
      if (Object.keys(operation.value).length === 0) {
        return
      }
      let newPf = {}
      for (const k in pf1) {
        if (Object.hasOwnProperty.call(pf1, k)) {
          newPf[k] = null
        }
      }
      newPf['id'] = 1
      newPf['iid'] = newId
      newPf['vid'] = vid
      ob.vrNum[key].vrPf = [newPf]
      setVrPf(ob.vrNum[key].vrPf, ob.vrNum[key])
    }
  })
}



/*import { vrNumSumToMain, recountVrPf, updateGuidePrice, makeBomPf } from './vrCom.js'
import { BigNumber } from 'bignumber.js'
import store from '@/store'
BigNumber.config({ DECIMAL_PLACES: 4 })

let getOpt = store.getters.getOpt
const resBomList = getOpt('res_bom')
const ebaBomList = getOpt('eba_bom')
const resList = getOpt('res')

export default function afterSet() {
  return {
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
          updateGuidePrice(p.receiver.vrPf[i],p.root)
        }
      }
    }
  }
}*/