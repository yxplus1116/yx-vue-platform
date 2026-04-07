import http from '@/utils/http'
import type { AccountLoginReq, AuthUser, ImageCaptchaResp, LoginResp } from './type'

export type * from './type'

/** 认证接口前缀。 */
const AUTH_BASE_URL = '/auth'
/** 验证码接口前缀。 */
const CAPTCHA_BASE_URL = '/captcha'

/** 调用统一认证中心执行账号密码登录。 */
export function accountLogin(req: AccountLoginReq, tenantCode?: string) {
  const headers: Record<string, string> = {}

  if (tenantCode) {
    headers['X-Tenant-Code'] = tenantCode
  }

  return http.post<LoginResp>(`${AUTH_BASE_URL}/login`, req, { headers })
}

/** 调用退出登录接口。 */
export function logout() {
  return http.post(`${AUTH_BASE_URL}/logout`)
}

/** 获取当前登录用户资料。 */
export function getUserInfo() {
  return http.get<AuthUser>(`${AUTH_BASE_URL}/user/info`)
}

/** 获取图形验证码。 */
export function getImageCaptcha() {
  return http.get<ImageCaptchaResp>(`${CAPTCHA_BASE_URL}/image`, undefined, {
    withToken: false,
  })
}
