import type { HomeCategoryItem, HomeFilterKey } from '../types'

export const HOME_FILTER_LABELS: Record<HomeFilterKey, string> = {
  province: '全部省份',
  city: '全部城市',
  scene: '全部应用场景',
  venueType: '全部考点类型',
  seatBucket: '不限考位数量',
}

export const HOME_CATEGORY_META: Array<Pick<HomeCategoryItem, 'subtitle' | 'theme'>> = [
  { subtitle: '专业商务场地', theme: 'business' },
  { subtitle: '高校开放教室', theme: 'public' },
  { subtitle: '优质办校配套考场', theme: 'private' },
]
