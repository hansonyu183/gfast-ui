import { BigNumber } from 'bignumber.js'
import { optApi } from '@/api/erp/ui'

BigNumber.config({ DECIMAL_PLACES: 4 })

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
  console.log('vrNumSumToMain', vrNum, vrMain)
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
  console.log('recountVrPf', vrNum)

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
  console.log('vrPfSumToVrNum', vrNum, root)
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
  console.log('makeBomPf', bomList, mainRes)

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

const updateGuidePrice = async (row, root) => {
  console.log('updateGuidePrice', row, root)
  const tranPrice = root.vrMain.tran_price
  const sqPrice = root.vrMain.sq_price
  const ebaPlusPrice = root.vrMain.plus_price
  const resp = await optApi.getByNameAndID('res', row.res_id)
  let guide_price = resp.data.guide_price
  guide_price = new BigNumber(guide_price).plus(tranPrice).plus(sqPrice).plus(ebaPlusPrice).toNumber()
  row.guide_price = guide_price
  row.price = guide_price
  console.log('updateGuidePrice', row, root, resp.data.guide_price, tranPrice, sqPrice, ebaPlusPrice, guide_price)

}

export { updateGuidePrice, makeBomPf, vrPfSumToVrNum, recountVrPf, vrNumSumToMain, IDENTITY }