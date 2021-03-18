import request from '@/utils/request'
const optApi = {
  getAllOpt: function () {
    return request({
      url: '/erp/ui/opt/all',
      method: 'get'
    })
  },
  getByName: function (optName) {
    return request({
      url: `/erp/ui/opt/${optName}`,
      method: 'get'
    })
  },
  getByNameAndID: function (optName, id) {
    return request({
      url: `/erp/ui/opt/${optName}/${id}`,
      method: 'get'
    })
  },
}

const authApi = {
  getAuth: function (userName) {
    return request({
      url: `/erp/ui/auth/${userName}`,
      method: 'get'
    })
  },
}

const dictApi = {
  getDict: function () {
    return request({
      url: `/erp/ui/dict`,
      method: 'get'
    })
  },
}

export { optApi, authApi, dictApi }