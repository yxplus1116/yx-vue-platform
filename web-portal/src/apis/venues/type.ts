/** 考点插画主题类型。 */
export type VenueImageTheme = 'classroom' | 'campus' | 'building' | 'hall'

/** 首页筛选栏单项配置。 */
export interface VenueFilterGroup {
  /** 筛选项键名。 */
  key: VenueFilterKey
  /** 筛选项默认展示文案。 */
  label: string
  /** 筛选项可选值集合。 */
  options: string[]
}

/** 考点筛选项键名。 */
export type VenueFilterKey = 'province' | 'city' | 'scene' | 'venueType' | 'seatCount'

/** 考点列表与详情共用的数据结构。 */
export interface VenueItem {
  /** 考点主键。 */
  id: number
  /** 考点名称。 */
  title: string
  /** 列表场景下展示的简要地址。 */
  location: string
  /** 列表摘要描述。 */
  summary: string
  /** 考点标签。 */
  tags: string[]
  /** 考场数量。 */
  roomCount: string
  /** 考位数量。 */
  seatCount: string
  /** 省份筛选字段。 */
  province: string
  /** 城市筛选字段。 */
  city: string
  /** 应用场景筛选字段。 */
  scene: string
  /** 考点类型筛选字段。 */
  venueType: string
  /** 考位区间筛选字段。 */
  seatBucket: string
  /** 列表卡片默认图形主题。 */
  imageTheme: VenueImageTheme
  /** 联系电话。 */
  phone: string
  /** 联系邮箱。 */
  email: string
  /** 详情页完整地址文案。 */
  address: string
  /** 地图经度。 */
  longitude: number
  /** 地图纬度。 */
  latitude: number
  /** 详情页简介分段内容。 */
  description: string[]
  /** 详情页图集展示顺序。 */
  galleryThemes: VenueImageTheme[]
}

/** 考点列表查询条件。 */
export interface VenueListQuery {
  /** 省份筛选值。 */
  province?: string
  /** 城市筛选值。 */
  city?: string
  /** 场景筛选值。 */
  scene?: string
  /** 考点类型筛选值。 */
  venueType?: string
  /** 考位区间筛选值。 */
  seatCount?: string
}

/** 首页分类卡片主题。 */
export type CategoryTheme = 'business' | 'public' | 'private'

/** 首页分类卡片配置。 */
export interface VenueCategoryItem {
  /** 分类标题。 */
  title: string
  /** 分类副标题。 */
  subtitle: string
  /** 分类说明文案。 */
  description: string
  /** 分类视觉主题。 */
  theme: CategoryTheme
}

/** 考点列表响应结构。 */
export interface VenueListResp {
  /** 当前页的考点列表。 */
  list: VenueItem[]
  /** 当前查询条件下的总记录数。 */
  total: number
}
