import http from '@/api/http'
import { getVenueById, venueItems, type VenueImageTheme, type VenueItem } from '@/modules/venues/data'

/** 考点筛选项键名。 */
export type VenueFilterKey = 'province' | 'city' | 'scene' | 'venueType' | 'seatCount'

/** 首页筛选栏单项配置。 */
export interface VenueFilterGroup {
  /** 筛选项键名。 */
  key: VenueFilterKey
  /** 筛选项默认展示文案。 */
  label: string
  /** 筛选项可选值集合。 */
  options: string[]
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

/** 首页分类入口配置。 */
export const venueCategoryItems: VenueCategoryItem[] = [
  {
    title: '商业考点',
    subtitle: '专业商务场地',
    description: '查看更多',
    theme: 'business',
  },
  {
    title: '公办院校',
    subtitle: '高校开放教室',
    description: '查看更多',
    theme: 'public',
  },
  {
    title: '民办院校',
    subtitle: '优质办校配套考场',
    description: '查看更多',
    theme: 'private',
  },
]

/** 首页筛选栏配置。 */
export const venueFilterGroups: VenueFilterGroup[] = [
  {
    key: 'province',
    label: '全部省份',
    options: ['全部省份', '河北省', '湖北省', '山西省', '贵州省'],
  },
  {
    key: 'city',
    label: '全部城市',
    options: ['全部城市', '石家庄市', '武汉市', '太原市', '贵阳市'],
  },
  {
    key: 'scene',
    label: '全部应用场景',
    options: ['全部应用场景', '社会考试', '校园考试', '企业认证', '培训测评'],
  },
  {
    key: 'venueType',
    label: '全部考点类型',
    options: ['全部考点类型', '商业考点', '公办院校', '民办院校'],
  },
  {
    key: 'seatCount',
    label: '不限考位数量',
    options: ['不限考位数量', '100以内', '100-500', '500-1000', '1000以上'],
  },
]

/** 预留给后端真实考点接口的前缀。 */
const VENUE_BASE_URL = '/portal/venues'
/** 是否启用远程考点接口。 */
const USE_REMOTE_VENUE_API = import.meta.env.VITE_USE_REMOTE_VENUE_API === 'true'

/** 用静态数据模拟后端筛选逻辑。 */
function filterVenueItems(query: VenueListQuery = {}) {
  return venueItems.filter((item) => {
    const provinceMatch = !query.province || query.province === '全部省份' || item.province === query.province
    const cityMatch = !query.city || query.city === '全部城市' || item.city === query.city
    const sceneMatch = !query.scene || query.scene === '全部应用场景' || item.scene === query.scene
    const venueTypeMatch = !query.venueType || query.venueType === '全部考点类型' || item.venueType === query.venueType
    const seatCountMatch = !query.seatCount || query.seatCount === '不限考位数量' || item.seatBucket === query.seatCount

    return provinceMatch && cityMatch && sceneMatch && venueTypeMatch && seatCountMatch
  })
}

/** 生成首页筛选默认值。 */
export function createDefaultVenueFilters() {
  return venueFilterGroups.reduce<Record<string, string>>((result, item) => {
    result[item.key] = item.label
    return result
  }, {})
}

/** 获取考点列表。 */
export async function getVenueList(query: VenueListQuery = {}) {
  if (USE_REMOTE_VENUE_API) {
    return http.get<VenueListResp, VenueListQuery>(VENUE_BASE_URL, query)
  }

  const list = filterVenueItems(query)
  return Promise.resolve({
    code: 200,
    data: {
      list,
      total: list.length,
    },
    msg: 'success',
    success: true,
    timestamp: new Date().toISOString(),
  })
}

/** 获取考点详情。 */
export async function getVenueDetail(id: number) {
  if (USE_REMOTE_VENUE_API) {
    return http.get<VenueItem>(`${VENUE_BASE_URL}/${id}`)
  }

  const venue = getVenueById(id)
  return Promise.resolve({
    code: venue ? 200 : 404,
    data: venue ?? null,
    msg: venue ? 'success' : '未找到该考点',
    success: Boolean(venue),
    timestamp: new Date().toISOString(),
  })
}

/** 导出考点基础类型，便于页面统一从 API 层引用。 */
export type { VenueImageTheme, VenueItem }
