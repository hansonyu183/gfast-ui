import request from '@/utils/request'

// 查询vou列表
export function listVou(query) {
    return request({
        url: '/erp/vou/list',
        method: 'get',
        params: query
    })
}

// 查询vou详细
export function getVou (id) {
    return request({
        url: '/erp/vou',
        method: 'get',
        data: {id:id}
    })
}

// 获取前单
export function getPreVou (id) {
    return request({
        url: '/erp/vou/preOne',
        method: 'get',
        data: {id:id}
    })
}

// 获取后单
export function getNextVou (id) {
    return request({
        url: '/erp/vou/nextOne',
        method: 'get',
        data: {id:id}
    })
}


// 新增vou
export function addVou(data) {
    return request({
        url: '/erp/vou',
        method: 'post',
        data: data
    })
}

// 修改vou
export function updateVou(data) {
    return request({
        url: '/erp/Vou',
        method: 'put',
        data: data
    })
}

// 删除vou
export function delVou(ids) {
    return request({
        url: '/erp/vou',
        method: 'delete',
        data:{ids:ids}
    })
}

// vou回退操作
export function goBackVou(ids) {
    return request({
        url: '/erp/vou/goBack',
        method: 'patch',
        data:{ids:ids}
    })
}

// vou下一步操作
export function goNextVou(ids) {
    return request({
        url: '/erp/vou/goNext',
        method: 'patch',
        data:{ids:ids}
    })
}

// 导出vou
export function exportVou(query) {
    return request({
      url: '/system/vou/export',
      method: 'get',
      params: query
    })
  }