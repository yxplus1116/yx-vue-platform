// 考点表单里的地区选择结果
export interface VenueRegionValue {
  // 当前选中的省份名称
  province: string

  // 当前选中的城市名称
  city: string

  // 当前选中的省份编码
  provinceCode?: string

  // 当前选中的城市编码
  cityCode?: string
}

// 考点表单里的地图选点结果
export interface VenueLocationValue {
  // 详细地址
  address: string

  // 经度
  longitude: string

  // 纬度
  latitude: string

  // 地点名称
  name?: string
}

// 考点编辑表单的数据结构
export interface VenueFormData {
  // 考点名称
  title: string

  // 首页卡片摘要
  summary: string

  // 富文本详情介绍
  description: string

  // 地区联动组件值
  region: VenueRegionValue

  // 地图选点组件值
  locationPicker: VenueLocationValue

  // 省份名称
  province: string

  // 城市名称
  city: string

  // 列表展示地址
  locationText: string

  // 详细地址
  address: string

  // 经度
  longitude: string

  // 纬度
  latitude: string

  // 联系电话
  phone: string

  // 联系邮箱
  email: string

  // 考场数量
  roomCount: number | undefined

  // 考位数量
  seatCount: number | undefined

  // 考点类型
  venueType: string

  // 应用场景多选值
  sceneValues: string[]

  // 考位区间
  seatBucket: string

  // 自定义标签
  tags: string

  // 封面图
  coverImage: string

  // 图集
  gallery: string

  // 启停状态
  status: number

  // 是否推荐
  recommended: number

  // 排序值
  sort: number
}
