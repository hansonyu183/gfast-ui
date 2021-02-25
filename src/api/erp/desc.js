import request from '@/utils/request'

// 查询eba详细
export function getDBDesc(table) {
  return request({
    url: `/erp/dbDesc/${table}`,
    method: 'get',
  })
}

// 查询eba详细
export function getDesc(userId) {
  return request({
    url: `/erp/desc/${userId}`,
    method: 'get',
  })
}

// 新增eba
export function addDesc(userId, desc) {
  return request({
    url: `/erp/desc/${userId}`,
    method: 'post',
    data: desc
  })
}

// 修改eba
export function saveDesc(userId, desc) {
  return request({
    url: `/erp/desc/${userId}`,
    method: 'put',
    data: { desc: desc }
  })
}

// 删除eba
export function delDesc(userId) {
  return request({
    url: `/erp/desc/${userId}`,
    method: 'delete',
  })
}