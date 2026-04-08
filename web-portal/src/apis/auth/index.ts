import http from '@/utils/http'
import type { AccountLoginReq, ImageCaptchaResp, LoginResp } from './type'

export type * from './type'

// 认证中心接口前缀
const AUTH_BASE_URL = '/auth'

// 验证码接口前缀
const CAPTCHA_BASE_URL = '/captcha'

// 门户端账号登录，当前已经对齐统一认证中心
export function accountLogin(req: AccountLoginReq, tenantCode?: string) {
  // 多租户场景下通过请求头传租户编码
  const headers: Record<string, string> = {}

  if (tenantCode) {
    headers['X-Tenant-Code'] = tenantCode
  }

  return http.post<LoginResp>(`${AUTH_BASE_URL}/currency/login`, req, {
    headers,
  })
}

// 主动退出当前登录会话
export function logout() {
  return http.post(`${AUTH_BASE_URL}/logout`)
}

// 获取图形验证码，登录前调用，所以不带 token
export function getImageCaptcha() {
  return http.get<ImageCaptchaResp>(`${CAPTCHA_BASE_URL}/image`, undefined, {
    withToken: false,
  })
}
