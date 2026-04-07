export interface AuthUser {
  id: string
  username: string
  nickname: string
  avatar: string
  roles: string[]
  permissions: string[]
  deptName: string
}

export type AuthType = 'ACCOUNT' | 'PHONE' | 'EMAIL' | 'SOCIAL'

export const AuthTypeConstants = {
  ACCOUNT: 'ACCOUNT',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  SOCIAL: 'SOCIAL',
} as const

export interface AuthReq {
  clientId?: string
  authType?: AuthType
}

export interface AccountLoginReq extends AuthReq {
  username: string
  password: string
  captcha: string
  uuid: string
}

export interface LoginResp {
  token: string
  tenantId: string
}

export interface ImageCaptchaResp {
  uuid: string
  img: string
  expireTime: number
  isEnabled: boolean
}
