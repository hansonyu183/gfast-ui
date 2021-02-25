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
export function delDoc(docType, id) {
  return request({
    url: `/erp/doc/${docType}/${id}`,
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

//保存数据
export function saveDoc(docType, id, data) {
  return request({
    url: `/erp/doc/${docType}/${id}`,
    method: 'post',
    params: data
  })
}

//保存数据
export function docAction(docType, id, act, data) {
  return request({
    url: `/erp/docAct/${docType}/${id}/${act}`,
    method: 'post',
    params: data
  })
}