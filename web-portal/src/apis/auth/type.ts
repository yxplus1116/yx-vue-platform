// 统一认证支持的登录类型
export type AuthType = 'ACCOUNT' | 'PHONE' | 'EMAIL' | 'SOCIAL'

// 登录类型常量
export const AuthTypeConstants = {
  ACCOUNT: 'ACCOUNT',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  SOCIAL: 'SOCIAL',
} as const

// 认证请求公共参数
export interface AuthReq {
  // 客户端 id
  clientId?: string

  // 登录方式
  authType?: AuthType
}

// 账号密码登录请求参数
export interface AccountLoginReq extends AuthReq {
  // 用户名或手机号
  username: string

  // RSA 加密后的密码
  password: string

  // 图形验证码
  captcha: string

  // 图形验证码 uuid
  uuid: string
}

// 登录接口返回结果
export interface LoginResp {
  // 登录 token
  token: string

  // 当前租户 id
  tenantId: string
}

// 图形验证码返回结果
export interface ImageCaptchaResp {
  // 验证码唯一标识
  uuid: string

  // 验证码图片内容
  img: string

  // 过期时间
  expireTime: number

  // 当前是否启用图形验证码
  isEnabled: boolean
}
