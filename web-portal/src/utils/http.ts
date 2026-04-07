import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import { useAuthStoreWithOut } from '@/stores'
import type { ApiResponse, RequestConfig } from '@/types/api'

// 在 axios 原生配置上挂一层业务自定义配置
type RequestOptions = AxiosRequestConfig & {
  // 控制是否带 token、是否静默报错等扩展能力
  requestConfig?: RequestConfig
}

// 常见 HTTP 状态码提示文案
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

// 门户端统一的 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX ?? import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

function showError(message: string, silentError?: boolean) {
  if (!silentError && message) {
    Message.error(message)
  }
}

// 登录态失效时回到登录页，并保留当前地址
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

// 请求发出前统一补 token 和租户信息
service.interceptors.request.use((config: InternalAxiosRequestConfig & { requestConfig?: RequestConfig }) => {
  const authStore = useAuthStoreWithOut()

  // 默认请求都带 token，个别匿名接口再单独关闭
  const withToken = config.requestConfig?.withToken ?? true

  // token 用于用户鉴权
  const token = authStore.token

  // tenantId 用于多租户接口识别
  const tenantId = authStore.tenantId

  if (withToken && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }

  return config
})

// 响应拦截器里统一处理业务失败和 401
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 业务层统一返回包装结构，先把它取出来处理
    const result = response.data

    // 每个请求都可以单独带一份扩展配置
    const requestConfig = (response.config as RequestOptions).requestConfig

    // 下载文件时直接把原始响应透出去
    if (response.request?.responseType === 'blob') {
      return response
    }

    // 兼容少量不走统一响应格式的接口
    if (!result || typeof result !== 'object' || !('success' in result)) {
      return response
    }

    // 业务成功时交给调用方继续处理 data
    if (result.success) {
      return response
    }

    // 业务失败优先使用后端返回的提示文案
    const message = result.msg || '请求失败，请稍后重试'
    if (String(result.code) === '401') {
      useAuthStoreWithOut().clearAuthState()
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
    // 请求异常时也尽量保留业务层自定义配置
    const requestConfig = (error.config as RequestOptions | undefined)?.requestConfig

    // http 状态码优先用于兜底提示
    const status = error.response?.status

    // 后端文案优先，其次状态码文案，最后再退回 axios 自己的错误信息
    const message = error.response?.data?.msg || (status ? StatusCodeMessage[status] : '') || error.message || '网络异常，请稍后重试'

    if (status === 401) {
      useAuthStoreWithOut().clearAuthState()
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

// 对外统一返回解包后的业务响应
function request<T>(config: AxiosRequestConfig, requestConfig?: RequestConfig) {
  return service.request<ApiResponse<T>, AxiosResponse<ApiResponse<T>>>({
    ...config,
    requestConfig,
  } as RequestOptions).then((response) => response.data)
}

// 统一暴露常用请求方法，页面和接口层都只和这一层打交道
const http = {
  // 发 GET 请求，常用于列表和详情查询
  get<T, P = Record<string, unknown>>(url: string, params?: P, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'GET', params, ...config }, config)
  },

  // 发 POST 请求，常用于新增、登录和条件查询
  post<T, D = unknown>(url: string, data?: D, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'POST', data, ...config }, config)
  },

  // 发 PUT 请求，常用于整包更新
  put<T, D = unknown>(url: string, data?: D, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'PUT', data, ...config }, config)
  },

  // 发 PATCH 请求，常用于局部更新
  patch<T, D = unknown>(url: string, data?: D, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'PATCH', data, ...config }, config)
  },

  // 发 DELETE 请求，常用于删除操作
  delete<T, P = Record<string, unknown>>(url: string, params?: P, config?: RequestConfig & AxiosRequestConfig) {
    return request<T>({ url, method: 'DELETE', params, ...config }, config)
  },
}

export default http
