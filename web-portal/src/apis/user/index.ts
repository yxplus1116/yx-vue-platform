import http from '@/utils/http'
import type { AuthUser, PortalUserRegisterReq } from './type'

export type * from './type'

// 门户端用户接口前缀
const BASE_URL = '/portal/user'

// 查询当前登录的门户端用户
export function getUserInfo() {
  return http.get<AuthUser>(`${BASE_URL}/info`)
}

// 提交门户端用户注册
export function registerPortalUser(data: PortalUserRegisterReq) {
  return http.post<unknown, PortalUserRegisterReq>(`${BASE_URL}/register`, data, {
    withToken: false,
  })
}
