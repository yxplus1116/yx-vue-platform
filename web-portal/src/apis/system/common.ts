import type * as T from './type'
import http from '@/utils/http'

export type * from './type'

// 系统公共接口前缀
const BASE_URL = '/system/common'

// 按字典编码查询下拉选项
export function getDictOptions(code: string) {
  return http.get<T.DictOption[]>(`${BASE_URL}/dict/${code}`)
}
