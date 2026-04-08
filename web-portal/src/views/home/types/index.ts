import type { VenueItem } from '@/apis/venues'

// 首页筛选字段键名
export type HomeFilterKey = 'province' | 'city' | 'scene' | 'venueType' | 'seatBucket'

// 首页分类卡片主题
export type HomeCategoryTheme = 'business' | 'public' | 'private'

// 首页筛选项结构
export interface HomeFilterOption {
  // 展示文案
  label: string

  // 提交值
  value: string

  // 地区编码，省市筛选时会用到
  code?: string
}

// 首页筛选组结构
export interface HomeFilterGroup {
  // 筛选字段
  key: HomeFilterKey

  // 筛选组标题
  label: string

  // 当前筛选组的选项
  options: HomeFilterOption[]
}

// 首页分类卡片数据
export interface HomeCategoryItem {
  // 分类名称
  label: string

  // 分类值
  value: string

  // 分类副标题
  subtitle: string

  // 分类主题
  theme: HomeCategoryTheme

  // 当前是否高亮
  active?: boolean
}

// 首页筛选条件
export interface HomeFilterState {
  // 标题关键字
  title: string

  // 省份名称
  province: string

  // 省份编码
  provinceCode: string

  // 城市名称
  city: string

  // 城市编码
  cityCode: string

  // 场景编码
  scene: string

  // 考点类型编码
  venueType: string

  // 考位区间编码
  seatBucket: string
}

// 首页分页状态
export interface HomePaginationState {
  // 当前页码
  current: number

  // 每页条数
  pageSize: number

  // 总条数
  total: number
}

// 首页卡片数据，在考点原始字段上补了一份展示标签
export interface HomeVenueCardItem extends VenueItem {
  // 组件最终要渲染的标签列表
  displayTags: string[]
}
