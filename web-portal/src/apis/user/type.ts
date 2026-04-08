// 门户端当前登录用户信息
export interface AuthUser {
  // 用户 id
  id: string

  // 登录用户名
  username: string

  // 展示昵称
  nickname: string

  // 头像地址
  avatar: string

  // 角色标识集合
  roles: string[]

  // 权限标识集合
  permissions: string[]

  // 所属部门名称
  deptName: string
}

// 门户端用户注册请求参数
export interface PortalUserRegisterReq {
  // 登录用户名
  username: string

  // 注册手机号
  phone: string

  // 登录密码，提交前需要做 RSA 加密
  password: string

  // 短信验证码
  captcha: string
}
