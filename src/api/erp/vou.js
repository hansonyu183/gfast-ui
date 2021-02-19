import request from '@/utils/request'



// 查询数据
export function getVou(id) {
  return request({
    url: `/erp/vou/${id}`,
    method: 'get',
  })
}
