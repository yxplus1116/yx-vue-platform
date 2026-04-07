import type * as T from './type'
import http from '@/utils/http'

export type * from './type'

// 按父级地区编码查询下级地区
export function getRegionChildren(parentCode: string) {
  return http.get<T.RegionItem[]>(`/dashboard/region/children/${parentCode}`)
}
