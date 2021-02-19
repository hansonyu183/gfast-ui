import request from '@/utils/request'

// 查询数据
export function getQueryData(queryName,params) {
    return request({
        url: '/erp/query/'+queryName,
        method: 'get',
        params: params
    })
}

// 查询数据汇总
export function getQuerySum(queryName,query) {
    return request({
        url: '/erp/query/'+queryName+'Sum',
        method: 'get',
        params: query
    })
}

