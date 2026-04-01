export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface RequestConfig {
  withToken?: boolean
}
