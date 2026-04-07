import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import { clearAuthState, getTenantId, getToken } from '@/modules/auth'
import type { ApiResponse, RequestConfig } from '@/types/api'

/** axios 配置与业务扩展配置的组合类型。 */
type RequestOptions = AxiosRequestConfig & {
  /** 业务层附加的自定义请求配置。 */
  requestConfig?: RequestConfig
}

/** 常见 HTTP 状态码提示文案。 */
const StatusCodeMessage: Record<number, string> = {
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
}

/** 门户端统一 axios 实例。 */
const service = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX ?? import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

/** 统一错误提示出口。 */
function showError(message: string, silentError?: boolean) {
  if (!silentError && message) {
    Message.error(message)
  }
}

/** 当登录态失效时，跳转到登录页并保留回跳地址。 */
function redirectToLogin() {
  if (window.location.pathname === '/auth/login') {
    return
  }

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const loginUrl = new URL('/auth/login', window.location.origin)

  if (currentPath) {
    loginUrl.searchParams.set('redirect', currentPath)
  }

  window.location.assign(loginUrl.toString())
}

/** 请求拦截器：统一注入 token 与租户信息。 */
service.interceptors.request.use((config: InternalAxiosRequestConfig & { requestConfig?: RequestConfig }) => {
  const withToken = config.requestConfig?.withToken ?? true
  const token = getToken()
  const tenantId = getTenantId()

  if (withToken && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }

  return config
})

/** 响应拦截器：统一处理业务成功态、失败态和 401。 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const result = response.data
    const requestConfig = (response.config as RequestOptions).requestConfig

    if (response.request?.responseType === 'blob') {
      return response
    }

    if (!result || typeof result !== 'object' || !('success' in result)) {
      return response
    }

    if (result.success) {
      return response
    }

    const message = result.msg || '请求失败，请稍后重试'
    if (String(result.code) === '401') {
      clearAuthState()
      showError(message, requestConfig?.silentError)

      if (requestConfig?.redirectOnUnauthorized !== false) {
        redirectToLogin()
      }

      return Promise.reject(new Error(message))
    }

    showError(message, requestConfig?.silentError)
    return Promise.reject(new Error(message))
  },
  (error: AxiosError<ApiResponse>) => {
    const requestConfig = (error.config as RequestOptions | undefined)?.requestConfig
    const status = error.response?.status
    const message = error.response?.data?.msg || (status ? StatusCodeMessage[status] : '') || error.message || '网络异常，请稍后重试'

    if (status === 401) {
      clearAuthState()
      showError(message, requestConfig?.silentError)

      if (requestConfig?.redirectOnUnauthorized !== false) {
        redirectToLogin()
      }

      return Promise.reject(error)
    }

    showError(message, requestConfig?.silentError)
    return Promise.reject(error)
  },
)

/** 统一请求入口，返回解包后的业务响应。 */
function request<T>(config: AxiosRequestConfig, requestConfig?: RequestConfig) {
  return service.request<ApiResponse<T>, AxiosResponse<ApiResponse<T>>>({
    ...config,
    requestConfig,
  } as RequestOptions).then((response) => response.data)
}

/** 对外提供的 HTTP 方法集合。 */
const http = {
  /** GET 请求。 */
  get<T, P = Record<string, unknown>>(url: string, params?: P, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'GET', params, ...config }, config)
  },
  /** POST 请求。 */
  post<T, D = unknown>(url: string, data?: D, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'POST', data, ...config }, config)
  },
  /** PUT 请求。 */
  put<T, D = unknown>(url: string, data?: D, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'PUT', data, ...config }, config)
  },
  /** PATCH 请求。 */
  patch<T, D = unknown>(url: string, data?: D, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'PATCH', data, ...config }, config)
  },
  /** DELETE 请求。 */
  delete<T, P = Record<string, unknown>>(url: string, params?: P, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'DELETE', params, ...config }, config)
  },
}

export default http
