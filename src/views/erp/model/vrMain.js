import { addDate } from '@/lib/utils'
import { observe, raw } from './observer-util'
import store from '@/store'
import { BigNumber } from 'bignumber.js'
import { optApi } from '@/api/erp/ui'

BigNumber.config({ DECIMAL_PLACES: 4 })
let getOpt = store.getters.getOpt

export default function setObserve(ob) {
  console.log('vrmain',ob)
  let vm = ob.vrMain
  let t = raw(ob.vrMain)
  //  computeTranDate
  observe(() => {
    t.tran_date = addDate(ob.vr.date, 1)
  }, {
    init: () => {
      if (!t.tran_date) {
        t.tran_date = addDate(ob.vr.date, 1)
      }
    }
  })
  //watchEbaId:
  observe(() => {
    const eba = getOpt('eba').find((obj) => obj.id === ob.vrMain.eba_id)
    t.sq_price = getOpt('ebasq').find(
      (obj) => obj.id === eba.ebasq_id
    )?.price
    t.emp_id = eba.emp_id
    t.plus_price = eba.plus_price
    t.tran_price = String(eba.tran_price)
  }, {
    init: () => [ob.vrMain.eba_id],
  })

  // compute amo
  observe(() => {
    let amo = new BigNumber(0)
    for (const item of ob.vrNum) {
      amo = amo.plus(item.amo)
    }
    t.print_amo = amo.toNumber()
    t.amo = amo.toNumber()
  }, {
    init: () => {
      ob.vrNum.map((v) => v.amo)
    },
  })
  // compute print_pack_num
  observe(() => {
    console.log('print_pack_num')
    let num = new BigNumber(0)
    for (const item of ob.vrNum) {
      num = num.plus(item.pack_num)
    }
    t.print_pack_num = num.toNumber()
    return ('compute print_pack_num')
  }, {
    init: () => {
      console.log('init print_pack_num', ob.vrNum)
      return ob.vrNum.map((v) => v.pack_num)
    },
  })
}

