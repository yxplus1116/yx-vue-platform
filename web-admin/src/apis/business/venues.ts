import http from "@/utils/http";
import type { LabelValueState } from "@/types/global";

const BASE_URL = "/business/venues";

export interface VenuesResp {
  id: string;
  title: string;
  summary: string;
  description: string;
  province: string;
  city: string;
  locationText: string;
  address: string;
  longitude: string;
  latitude: string;
  phone: string;
  email: string;
  roomCount: string;
  seatCount: string;
  seatBucket: string;
  scene: string;
  venueType: string;
  tags: string;
  coverImage: string;
  gallery: string;
  status: string;
  isRecommended: string;
  sort: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createUserString: string;
  updateUserString: string;
  disabled: boolean;
}
export interface VenuesDetailResp {
  id: string;
  title: string;
  summary: string;
  description: string;
  province: string;
  city: string;
  locationText: string;
  address: string;
  longitude: string;
  latitude: string;
  phone: string;
  email: string;
  roomCount: string;
  seatCount: string;
  seatBucket: string;
  scene: string;
  venueType: string;
  tags: string;
  coverImage: string;
  gallery: string;
  status: string;
  isRecommended: string;
  sort: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createUserString: string;
  updateUserString: string;
}
export interface VenuesQuery {
  title: string | undefined;
  summary: string | undefined;
  description: string | undefined;
  province: string | undefined;
  city: string | undefined;
  locationText: string | undefined;
  address: string | undefined;
  longitude: string | undefined;
  latitude: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  roomCount: string | undefined;
  seatCount: string | undefined;
  seatBucket: string | undefined;
  scene: string | undefined;
  venueType: string | undefined;
  coverImage: string | undefined;
  status: string | undefined;
  isRecommended: string | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
  sort: Array<string>;
}
export interface VenuesPageQuery extends VenuesQuery, PageQuery {}

/** @desc 查询考点列表 */
export function listVenues(query: VenuesPageQuery) {
  return http.get<PageRes<VenuesResp[]>>(BASE_URL, query);
}

/** @desc 查询考点详情 */
export function getVenues(id: string) {
  return http.get<VenuesDetailResp>(`${BASE_URL}/${id}`);
}

/** @desc 新增考点 */
export function addVenues(data: any) {
  return http.post(BASE_URL, data);
}

/** @desc 修改考点 */
export function updateVenues(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data);
}

/** @desc 删除考点 */
export function deleteVenues(id: string) {
  return http.del(BASE_URL, { ids: [id] });
}

/** @desc 导出考点 */
export function exportVenues(query: VenuesQuery) {
  return http.download(`${BASE_URL}/export`, query);
}

/** @desc 查询考点字典 */
export function listVenuesDict(query?: VenuesQuery) {
  return http.get<LabelValueState[]>(`${BASE_URL}/dict`, query);
}
