import request from '@/utils/request'
const optApi = {
  getAllOpt: function () {
    return request({
      url: '/erp/ui/opt',
      method: 'get'
    })
  },
  getByName: function (optName) {
    return request({
      url: `/erp/ui/opt/${optName}`,
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