import request from '@/utils/request'

const docApi = {
  saveSub: function (docType, docID, data) {
    return request({
      url: `/erp/docSub/${docType}/${docID}`,
      method: 'post',
      params: data
    })
  },
  getList: function (type, param) {
    return request({
      url: '/erp/docList/' + type,
      method: 'get',
      params: param
    })
  },
  getByID: function (type, id) {
    return request({
      url: `/erp/doc/${type}/${id}`,
      method: 'get',
    })
  },
  delByID: function (type, id) {
    return request({
      url: `/erp/doc/${type}/${id}`,
      method: 'delete',
    })
  },
  saveByID: function (type, id, data) {
    return request({
      url: `/erp/doc/${type}/${id}`,
      method: 'post',
      params: data
    })
  },
  docAction: function (type, id, actID) {
    return request({
      url: `/erp/doc/${type}/${id}`,
      method: 'patch',
      params: { actID: actID }
    })
  }
}

export default docApi