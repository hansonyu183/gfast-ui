import request from '@/utils/request'

const vrApi = {
  getList: function (type, param) {
    return request({
      url: '/erp/vrList/' + type,
      method: 'get',
      params: param
    })
  },
  getByID: function (type, id) {
    return request({
      url: `/erp/vr/${type}/${id}`,
      method: 'get',
    })
  },
  delByID: function (type, id) {
    return request({
      url: `/erp/vr/${type}/${id}`,
      method: 'delete',
    })
  },
  saveByID: function (type, id, data) {
    return request({
      url: `/erp/vr/${type}/${id}`,
      method: 'post',
      params: data
    })
  },
  docAction: function (type, id, actID) {
    return request({
      url: `/erp/vr/${type}/${id}`,
      method: 'patch',
      params: { actID: actID }
    })
  }
}

export default vrApi