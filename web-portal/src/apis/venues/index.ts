import type * as T from './type'
import http from '@/utils/http'

export type * from './type'

// 门户端考点对外查询接口前缀
const BASE_URL = '/portal/venues'

// 查询门户端考点列表
export function getVenueList(query: T.VenueListQuery = {}) {
  return http.get<T.VenueListResp, T.VenueListQuery>(BASE_URL, query)
}

// 查询单个考点详情
export function getVenueDetail(id: string | number) {
  return http.get<T.VenueItem>(`${BASE_URL}/${id}`)
}
