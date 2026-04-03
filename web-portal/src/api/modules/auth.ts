import http from '@/api/http'

/** 门户端用户信息结构。 */
export interface AuthUser {
  /** 用户主键。 */
  id: string
  /** 登录用户名。 */
  username: string
  /** 用户昵称。 */
  nickname: string
  /** 头像图片地址。 */
  avatar: string
  /** 角色编码集合。 */
  roles: string[]
  /** 权限标识集合。 */
  permissions: string[]
  /** 所属部门名称。 */
  deptName: string
}

/** 账号密码登录请求。 */
export interface AccountLoginReq {
  /** 用户名。 */
  username: string
  /** 密码。 */
  password: string
  /** 图形验证码文本。 */
  captcha: string
  /** 图形验证码唯一标识。 */
  uuid: string
  /** OAuth2 客户端 ID。 */
  clientId?: string
  /** 认证类型。 */
  authType?: 'ACCOUNT'
}

/** 登录响应结果。 */
export interface LoginResp {
  /** 访问后端需要使用的 token。 */
  token: string
  /** 当前用户所在租户 ID。 */
  tenantId: string
}

/** 图形验证码响应。 */
export interface ImageCaptchaResp {
  /** 验证码唯一标识。 */
  uuid: string
  /** 验证码图片内容。 */
  img: string
  /** 过期时间。 */
  expireTime: number
  /** 是否启用验证码。 */
  isEnabled: boolean
}

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
