export type HomeFilterKey = 'province' | 'city' | 'scene' | 'venueType' | 'seatBucket'

export type HomeCategoryTheme = 'business' | 'public' | 'private'

export interface HomeFilterOption {
  label: string
  value: string
  code?: string
}

export interface HomeFilterGroup {
  key: HomeFilterKey
  label: string
  options: HomeFilterOption[]
}

export interface HomeCategoryItem {
  label: string
  value: string
  subtitle: string
  theme: HomeCategoryTheme
  active?: boolean
}

export interface HomeFilterState {
  title: string
  province: string
  provinceCode: string
  city: string
  cityCode: string
  scene: string
  venueType: string
  seatBucket: string
}

export interface HomePaginationState {
  current: number
  pageSize: number
  total: number
}
