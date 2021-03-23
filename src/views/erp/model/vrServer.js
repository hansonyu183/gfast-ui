import vrApi from '@/api/erp/vr.js'

export const loadData = async (type, id) => {
  const response = await vrApi.getByID(type, id)
  let data = {}
  if (response.code === 200) {
    data.nextId = response.data.nextID
    data.preId = response.data.preID
    data.vr = response.data.vr ?? {}
    data.vrMain = response.data.vrMain ?? {}
    data.vrAmo = response.data.vrAmo ?? []
    data.vrNum = response.data.vrNum ?? []
    console.log('data.vrNum',response)
    const pf = response.data.vrPf ?? []
    if (pf.length >= 0) {
      for (const i in data.vrNum) {
        data.vrNum[i].vrPf = pf.filter((pItem) => {
          return pItem.iid === data.vrNum[i].id
        })
      }
    }
  }
  return { code: response.code, msg: response.msg, data: data }
}

