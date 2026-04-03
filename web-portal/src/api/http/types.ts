/** 统一接口响应结构。 */
export interface ApiResponse<T = unknown> {
  /** 业务状态码，兼容数字和字符串两种格式。 */
  code: number | string
  /** 接口返回的数据主体。 */
  data: T
  /** 面向用户展示的提示信息。 */
  msg: string
  /** 标记当前业务是否成功。 */
  success: boolean
  /** 服务端生成的时间戳。 */
  timestamp: string
}

/** 请求扩展配置。 */
export interface RequestConfig {
  /** 是否自动附带登录 token。 */
  withToken?: boolean
  /** 是否关闭默认错误提示。 */
  silentError?: boolean
  /** 401 时是否自动跳转登录页。 */
  redirectOnUnauthorized?: boolean
}
