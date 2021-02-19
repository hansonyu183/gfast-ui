import request from '@/utils/request'

// 查询数据
export function getDocList(docName, param) {
  return request({
    url: '/erp/docList/' + docName,
    method: 'get',
    params: param
  })
}


// 查询数据
export function getDocOption(docName) {
  return request({
    url: '/erp/docOption/' + docName,
    method: 'get',
  })
}

// 查询数据
export function delDoc(body) {
  return request({
    url: '/erp/docList/' + docName + '/' + body,
    method: 'delete',
  })
}

// 查询数据
export function getDoc(docType, id) {
  return request({
    url: `/erp/doc/${docType}/${id}`,
    method: 'get',
  })
}
