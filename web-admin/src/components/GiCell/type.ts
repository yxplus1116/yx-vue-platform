import type { LabelValueState } from '@/types/global'

export interface GiCellTagType {
  dict: LabelValueState[] | any[]
  value: number | string
}

export interface GiCellTagsItemType {
  label: string
  value?: number | string
  extra?: string
}
