import type { VenueItem } from '@/apis/venues'

// 考点字典选项的最小结构
interface VenueTagOption {
  // 展示文案
  label: string

  // 原始编码值
  value: string | number
}

// 构造考点标签时依赖的字典选项
interface BuildVenueTagOptions {
  // 考点类型字典
  venueTypeOptions?: VenueTagOption[]

  // 应用场景字典
  sceneOptions?: VenueTagOption[]

  // 考位区间字典
  seatBucketOptions?: VenueTagOption[]

  // 是否把推荐标记一起拼到展示标签里
  includeRecommended?: boolean
}

// 判断资源地址是不是已经是完整的 http 链接
function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

// 后台返回相对路径时，统一补成可直接访问的资源地址
export function resolveVenueAssetUrl(url?: string) {
  if (!url) {
    return ''
  }

  if (isHttpUrl(url)) {
    return url
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  if (!baseUrl) {
    return url
  }

  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

// 后台有些字段会用逗号拼接，这里统一拆成数组
export function splitVenueText(value?: string) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

// 地图组件需要 number，这里统一转一下
export function parseVenueCoordinate(value?: string) {
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : null
}

// 多值字典字段需要按原始顺序映射成多个展示文案
export function findDictOptionLabels(list: VenueTagOption[], value?: string) {
  return splitVenueText(value)
    .map((code) => list.find((item) => String(item.value) === code)?.label || code)
    .filter(Boolean)
}

// 单值字典字段直接取第一项展示文案
export function findDictOptionLabel(list: VenueTagOption[], value?: string) {
  const [firstLabel = ''] = findDictOptionLabels(list, value)
  return firstLabel
}

// 统一整理考点展示标签，首页卡片和详情页都走这套规则
export function buildVenueDisplayTags(
  venue:
    | Pick<VenueItem, 'recommended' | 'venueType' | 'scene' | 'seatBucket' | 'tags'>
    | null
    | undefined,
  options: BuildVenueTagOptions = {},
) {
  if (!venue) {
    return []
  }

  const {
    venueTypeOptions = [],
    sceneOptions = [],
    seatBucketOptions = [],
    includeRecommended = false,
  } = options

  const tags: string[] = []

  if (includeRecommended && Number(venue.recommended) === 1) {
    tags.push('推荐考点')
  }

  const venueTypeLabel = findDictOptionLabel(venueTypeOptions, venue.venueType)
  const seatBucketLabel = findDictOptionLabel(seatBucketOptions, venue.seatBucket)

  if (venueTypeLabel) {
    tags.push(venueTypeLabel)
  }

  tags.push(...findDictOptionLabels(sceneOptions, venue.scene))

  if (seatBucketLabel) {
    tags.push(seatBucketLabel)
  }

  tags.push(...splitVenueText(venue.tags))

  return Array.from(new Set(tags))
}
