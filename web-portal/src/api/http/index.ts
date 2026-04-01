import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import type { ApiResponse, RequestConfig } from './types'

const SUCCESS_CODE = 0
const TIMEOUT_CODE = 401
const API_PREFIX = import.meta.env.VITE_API_BASE_PREFIX || '/api'
const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'token'

function getStoredToken() {
  // 请求层统一从两个存储位置兜底读取 token。
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

// 与 web-admin 保持统一的基础约定：
// /api 前缀、Bearer token、code=0 视为成功。
const service = axios.create({
  baseURL: API_PREFIX,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

service.interceptors.request.use((config) => {
  const withToken = (config as AxiosRequestConfig & { requestConfig?: RequestConfig }).requestConfig?.withToken ?? true
  const token = getStoredToken()

  // 默认自动携带 token，公开接口可通过 withToken: false 关闭。
  if (withToken && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

service.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResponse

    // 非标准包装响应直接透传，兼容文件流或第三方接口。
    if (typeof result?.code !== 'number') {
      return response.data
    }

    if (result.code === SUCCESS_CODE) {
      return result
    }

    const message = result.msg || '请求失败，请稍后重试'

    // 登录失效时清理 token，交给路由守卫处理后续访问控制。
    if (result.code === TIMEOUT_CODE) {
      localStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
    }

    Message.error(message)
    return Promise.reject(new Error(message))
  },
  (error: AxiosError<ApiResponse>) => {
    const message = error.response?.data?.msg || error.message || '网络异常，请稍后重试'
    Message.error(message)
    return Promise.reject(error)
  },
)

function request<T>(config: AxiosRequestConfig, requestConfig?: RequestConfig) {
  // 统一封装请求出口，便于后续扩展埋点、重试、签名等能力。
  return service.request<ApiResponse<T>, ApiResponse<T>>({
    ...config,
    requestConfig,
  } as AxiosRequestConfig & { requestConfig?: RequestConfig })
}

export const http = {
  get<T>(url: string, params?: Record<string, unknown>, config?: RequestConfig) {
    return request<T>({ url, method: 'GET', params }, config)
  },
  post<T>(url: string, data?: Record<string, unknown>, config?: RequestConfig) {
    return request<T>({ url, method: 'POST', data }, config)
  },
  put<T>(url: string, data?: Record<string, unknown>, config?: RequestConfig) {
    return request<T>({ url, method: 'PUT', data }, config)
  },
  delete<T>(url: string, params?: Record<string, unknown>, config?: RequestConfig) {
    return request<T>({ url, method: 'DELETE', params }, config)
  },
}

export { API_PREFIX, TOKEN_KEY }
