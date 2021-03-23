import {
  observable, observe, raw, pauseAllObserver
  , resumeAllObserver
} from './observer-util'
import setVrMain from './vrMain'
import setVrNum from './vrNum'

//import { loadData } from './vrServer'
import vrApi from '@/api/erp/vr.js'


export async function createModel(type, id) {
  let code,msg,model
  await vrApi.getByID(type, id).then(response => {
    let data = {}
    if (response.code === 200) {
      data.nextId = response.data.nextID
      data.preId = response.data.preID
      data.vr = response.data.vr ?? {}
      data.vrMain = response.data.vrMain ?? {}
      data.vrAmo = response.data.vrAmo ?? []
      data.vrNum = response.data.vrNum ?? []
      console.log('data.vrNum', response)
      const pf = response.data.vrPf ?? []
      if (pf.length >= 0) {
        for (const i in data.vrNum) {
          data.vrNum[i].vrPf = pf.filter((pItem) => {
            return pItem.iid === data.vrNum[i].id
          })
        }
      }
    }
     code= response.code
     msg= response.msg
     model = observable(data)
    setVrMain(model)
    setVrNum(model)
  })
  return { code, msg, model }
}
