import request from '@/utils/request'

// 获取用户详细信息
export function getErpInfo(name) {
  return request({
    url: '/erp/info/' + name,
    method: 'get'
  })
}



export function getAllDesc() {
  return request({
    url: '/erp/ui/desc',
    method: 'get'
  })
}

export function getUserDesc(user) {
  return request({
    url: '/erp/ui/desc/user/' + user,
    method: 'get',
  })
}

export function getRoleDesc(role) {
  return request({
    url: '/erp/ui/desc/role/' + role,
    method: 'get',
  })
}

export function saveUserDesc(user, desc) {
  return request({
    url: '/erp/ui/desc/user/' + user,
    method: 'post',
    params: desc
  })
}

export function saveRoleDesc(role, desc) {
  return request({
    url: '/erp/ui/desc/role/' + role,
    method: 'post',
    params: desc
  })
}

