import request from '@/utils/request'

// 查询列表
export function getVrList(vtype, param) {
  return request({
    url: '/erp/vrList/' + vtype,
    method: 'get',
    params: param
  })
}

// 查询数据
export function getVr(vtype, id) {
  return request({
    url: `/erp/vr/${vtype}/${id}`,
    method: 'get',
  })
}

//操作数据
export function docAction(vtype, id, act, data) {
  return request({
    url: `/erp/vrAct/${vtype}/${act}/${id}`,
    method: 'post',
    params: data
  })
}