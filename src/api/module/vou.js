import request from '@/utils/request'

// 查询单据
export function getVou(vouName,id) {
    return request({
        url: '/erp/vou/'+vouName+"/"+id,
        method: 'get',
    })
}

// 删除单据
export function delVou(vouName,id) {
    return request({
        url: '/erp/vou/'+vouName+"/"+id,
        method: 'delete',
    })
}

// 新增单据
export function addVou(vouName,vouData) {
    return request({
        url: '/erp/vou/'+vouName,
        method: 'post',
        data: vouData,
    })
}

// 新增单据
export function updateVou(vouName,vouData) {
    return request({
        url: '/erp/vou/'+vouName,
        method: 'put',
        data: vouData,
    })
}
