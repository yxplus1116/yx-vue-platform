import type * as T from './type'
import http from '@/utils/http'

export type * from './type'

// 公共验证码接口前缀
const BASE_URL = '/captcha'

// 发送短信验证码，参数形态和 admin 端保持一致
export function getSmsCaptcha(phone: string, captchaReq: T.BehaviorCaptchaReq = {}) {
  return http.get<boolean>(
    `${BASE_URL}/sms?phone=${phone}&captchaVerification=${encodeURIComponent(captchaReq.captchaVerification || '')}`,
    undefined,
    { withToken: false },
  )
}

// 获取行为验证码资源，发短信前需要先完成一次验证
export function getBehaviorCaptcha(req: T.BehaviorCaptchaReq = {}) {
  return http.get<T.BehaviorCaptchaResp, T.BehaviorCaptchaReq>(`${BASE_URL}/behavior`, req, {
    withToken: false,
  })
}

// 校验行为验证码结果
export function checkBehaviorCaptcha(data: T.CheckBehaviorCaptchaReq) {
  return http.post<T.CheckBehaviorCaptchaResp, T.CheckBehaviorCaptchaReq>(`${BASE_URL}/behavior`, data, {
    withToken: false,
  })
}
