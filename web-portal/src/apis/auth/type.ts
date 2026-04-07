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
