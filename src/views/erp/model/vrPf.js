import { observable, observe, raw } from './observer-util'
import store from '@/store'
import { BigNumber } from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES: 4 })

function setRowObserve(row, parent) {
  console.log('setRowObserve', row, parent)
  //amo
  observe(() => {
    console.log('pfamo')
    row.amo = new BigNumber(row.price).times(row.num).toNumber()
  }, {
    init: () => [row.num, row.price]
  })
  //price
  observe(() => {
    console.log('pfprice')
    row.price = new BigNumber(row.amo).div(raw(row).num).toNumber()
  }, {
    init: () => [row.amo]
  })

  //num
  observe(() => {
    console.log('pfnum')
    row.num = new BigNumber(parent.pack_num).times(row.per_pack_num).toNumber()
  }, {
    init: () => {
      console.log('init-pfnum')
      return [parent.pack_num, row.per_pack_num]
    }
  })

  //per_pack_num
  observe(() => {
    console.log('pf-per_pack_num')
    row.per_pack_num = new BigNumber(row.num).div(raw(parent).pack_num).toNumber()
  }, {

    init: () => {
      console.log('init-pf-per_pack_num')
      return [row.num]
    }
  })
}

export default function setObserve(ob, parent) {
  console.log('setpf', ob, parent)
  for (const key in ob) {
    observable(ob[key])
    setRowObserve(ob[key], parent)
  }
  //watchLength:
  observe(() => { ob.length }, {
    init: () => [ob.length],
    debugger: operation => {
      if (operation.type !== 'add' || Object.keys(operation.value).length > 0) {
        return
      }
      const target = operation.target
      const row1 = target[0]
      const key = operation.key
      const vid = row1.vid
      const iid = row1.iid
      //let newRow = {}
      for (const k in row1) {
        if (Object.hasOwnProperty.call(row1, k)) {
          ob[key][k] = null
        }
      }
      ob[key]['vid'] = vid
      let newId = ob.reduce(function (pre, cur) {
        const cid = Number(cur.id) ?? 0
        return cid > pre ? cid : pre
      }, 0) + 1
      ob[key]['id'] = newId
      ob[key]['iid'] = iid
      ob[key] = observable(ob[key])
      setRowObserve(ob[key])
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
  : {
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

/*//store.js
import { updateGuidePrice, vrPfSumToVrNum } from './vrCom.js'
import { BigNumber } from 'bignumber.js'
BigNumber.config({ DECIMAL_PLACES: 4 })


export default function afterSet() {
  return {
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
        updateGuidePrice(p.receiver,p.root)
      },
      guide_price: (p) => {
        let sumAmo = new BigNumber(0)
        for (const item of p.parent.vrPf) {
          const amo = new BigNumber(item.per_pack_num).times(item.guide_price)
          sumAmo = sumAmo.plus(amo)
        }
        p.parent.guide_price = sumAmo.div(p.parent.per_pack_num).toNumber()
      }
    }
  }
}

*/