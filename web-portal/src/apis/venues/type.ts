/** 考点字段 */
export interface VenueItem {
  id: string
  title: string
  summary: string
  description: string
  province: string
  city: string
  locationText: string
  address: string
  longitude: string
  latitude: string
  phone: string
  email: string
  roomCount: string
  seatCount: string
  seatBucket: string
  scene: string
  venueType: string
  tags: string
  coverImage: string
  gallery: string
  status: string
  isRecommended: string
  sort: string
}

/** 考点列表查询 */
export interface VenueListQuery {
  title?: string
  province?: string
  city?: string
  status?: string
  scene?: string
  venueType?: string
  seatBucket?: string
  page?: number
  size?: number
}

/** 考点分页返回 */
export interface VenueListResp {
  list: VenueItem[]
  total: number
}
