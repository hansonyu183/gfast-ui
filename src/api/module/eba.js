import request from '@/utils/request'

// 查询eba列表
export function listEba(query) {
    return request({
        url: '/erp/eba/list',
        method: 'get',
        params: query
    })
}

// 查询option
export function getOptions () {
    return request({
        url: '/erp/dict',
        method: 'get',
    })
}

// 查询eba详细
export function getEba (id) {
    return request({
        url: '/erp/eba',
        method: 'get',
        data: {ebaId:id}
    })
}


// 新增eba
export function addEba(data) {
    return request({
        url: '/erp/eba',
        method: 'post',
        data: data
    })
}

// 修改eba
export function updateEba(data) {
    return request({
        url: '/erp/eba',
        method: 'put',
        data: data
    })
}

// 删除eba
export function delEba(ids) {
    return request({
        url: '/erp/eba',
        method: 'delete',
        data:{ebaIds:ids}
    })
}

// 导出eba
export function exportEba(query) {
    return request({
      url: '/system/eba/export',
      method: 'get',
      params: query
    })
  }