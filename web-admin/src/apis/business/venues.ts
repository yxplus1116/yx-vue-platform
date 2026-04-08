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
  recommended: string;
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
  recommended: string;
  sort: string;
  createTime: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createUserString: string;
  updateUserString: string;
}

// 考点新增和修改请求体
export interface VenueSaveReq {
  // 考点名称
  title: string;

  // 首页卡片摘要
  summary: string;

  // 富文本详情
  description: string;

  // 省份名称
  province: string;

  // 城市名称
  city: string;

  // 列表展示地址
  locationText: string;

  // 详细地址
  address: string;

  // 经度
  longitude: string;

  // 纬度
  latitude: string;

  // 联系电话
  phone: string;

  // 联系邮箱
  email: string;

  // 考场数量
  roomCount: number | undefined;

  // 考位数量
  seatCount: number | undefined;

  // 考位区间编码
  seatBucket: string;

  // 应用场景编码，多个值时用英文逗号拼接
  scene: string;

  // 考点类型编码
  venueType: string;

  // 自定义标签
  tags: string;

  // 封面图
  coverImage: string;

  // 图集
  gallery: string;

  // 启停状态
  status: number;

  // 是否推荐
  recommended: number;

  // 排序值
  sort: number;
}
export interface VenuesQuery {
  title?: string;
  summary?: string;
  description?: string;
  province?: string;
  city?: string;
  locationText?: string;
  address?: string;
  longitude?: string;
  latitude?: string;
  phone?: string;
  email?: string;
  roomCount?: string;
  seatCount?: string;
  seatBucket?: string;
  scene?: string;
  venueType?: string;
  coverImage?: string;
  status?: string;
  recommended?: string;
  createdAt?: string;
  updatedAt?: string;
  sort?: Array<string>;
}
export interface VenuesPageQuery extends VenuesQuery, PageQuery {}

// 查询考点列表
export function listVenues(query: VenuesPageQuery) {
  return http.get<PageRes<VenuesResp[]>>(BASE_URL, query);
}

// 查询考点详情
export function getVenues(id: string) {
  return http.get<VenuesDetailResp>(`${BASE_URL}/info/${id}`);
}

// 新增考点
export function addVenues(data: VenueSaveReq) {
  return http.post(BASE_URL, data);
}

// 修改考点
export function updateVenues(data: VenueSaveReq, id: string) {
  return http.put(`${BASE_URL}/${id}`, data);
}

// 删除考点
export function deleteVenues(id: string) {
  return http.del(BASE_URL, { ids: [id] });
}

// 导出考点
export function exportVenues(query: VenuesQuery) {
  return http.download(`${BASE_URL}/export`, query);
}

// 查询考点字典
export function listVenuesDict(query?: VenuesQuery) {
  return http.get<LabelValueState[]>(`${BASE_URL}/dict`, query);
}
