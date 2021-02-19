import request from '@/utils/request'

// 查询eba列表
export function getListByName(listName,query) {
    return request({
        url: '/erp/list/'+listName,
        method: 'get',
        params: query
    })
}

// 删除List
export function delListByNameIds(listName,ids) {
    let d ={}
    d[listName+'_id']=ids
    return request({
        url: '/erp/list/'+listName,
        method: 'delete',
        data:d
    })
}
