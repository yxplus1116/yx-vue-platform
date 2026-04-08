import type { LabelValueState } from '@/types/global'
import { type VenueSaveReq, type VenuesDetailResp } from '@/apis/business/venues'
import { isHttp } from '@/utils/validate'
import type { GiCellTagsItemType } from '@/components/GiCell/type'
import type { VenueFormData } from '../types'

// 把接口里的逗号字符串统一拆成数组
export function splitVenueCsvValue(value?: string) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

// 多选字段提交前统一转回英文逗号字符串
export function joinVenueCsvValue(values?: Array<string | number>) {
  if (!values?.length) {
    return ''
  }

  return values
    .map((item) => String(item).trim())
    .filter(Boolean)
    .join(',')
}

// 列表和详情里的多值字典字段统一映射成带颜色信息的标签项
export function mapVenueDictTags(value: string | undefined, dict: LabelValueState[]): GiCellTagsItemType[] {
  return splitVenueCsvValue(value)
    .map((code) => {
      const dictItem = dict.find((item) => String(item.value) === code)

      if (!dictItem) {
        return { label: code, value: code }
      }

      return {
        label: dictItem.label,
        value: dictItem.value,
        extra: dictItem.extra,
      }
    })
    .filter((item) => item.label)
}

// 单值字典字段直接回填原始编码，列表和详情继续交给 GiCellTag 处理颜色
export function normalizeVenueDictValue(value?: string) {
  const [firstValue = ''] = splitVenueCsvValue(value)
  return firstValue
}

// 接口返回的是字符串，这里统一转成表单数字值
function parseVenueNumber(value?: string | number) {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : undefined
}

// 新增和重置时都走这份默认表单
export function createDefaultVenueForm(): VenueFormData {
  return {
    title: '',
    summary: '',
    description: '',
    region: {
      province: '',
      city: '',
      provinceCode: '',
      cityCode: '',
    },
    locationPicker: {
      address: '',
      longitude: '',
      latitude: '',
      name: '',
    },
    province: '',
    city: '',
    locationText: '',
    address: '',
    longitude: '',
    latitude: '',
    phone: '',
    email: '',
    roomCount: undefined,
    seatCount: undefined,
    venueType: '',
    sceneValues: [],
    seatBucket: '',
    tags: '',
    coverImage: '',
    gallery: '',
    status: 1,
    recommended: 0,
    sort: 0,
  }
}

// 详情数据回填到表单时，统一在这里把字符串字段转成数组和数字
export function buildVenueFormData(detail?: Partial<VenuesDetailResp>): VenueFormData {
  const defaultForm = createDefaultVenueForm()

  if (!detail) {
    return defaultForm
  }

  const {
    title = '',
    summary = '',
    description = '',
    province = '',
    city = '',
    locationText = '',
    address = '',
    longitude = '',
    latitude = '',
    phone = '',
    email = '',
    roomCount,
    seatCount,
    seatBucket,
    scene,
    venueType,
    tags = '',
    coverImage = '',
    gallery = '',
    status,
    recommended,
    sort,
  } = detail

  return {
    ...defaultForm,
    title,
    summary,
    description,
    province,
    city,
    locationText,
    address,
    longitude,
    latitude,
    phone,
    email,
    tags,
    coverImage,
    gallery,
    roomCount: parseVenueNumber(roomCount),
    seatCount: parseVenueNumber(seatCount),
    venueType: normalizeVenueDictValue(venueType),
    sceneValues: splitVenueCsvValue(scene),
    seatBucket: normalizeVenueDictValue(seatBucket),
    status: parseVenueNumber(status) ?? defaultForm.status,
    recommended: parseVenueNumber(recommended) ?? defaultForm.recommended,
    sort: parseVenueNumber(sort) ?? defaultForm.sort,
    region: {
      ...defaultForm.region,
      province,
      city,
    },
    locationPicker: {
      ...defaultForm.locationPicker,
      address,
      longitude,
      latitude,
    },
  }
}

// 提交前把表单模型整理回接口需要的原始结构
export function buildVenueSavePayload(form: VenueFormData): VenueSaveReq {
  const {
    region,
    locationPicker,
    sceneValues,
    venueType,
    seatBucket,
    ...rest
  } = form

  return {
    ...rest,
    province: region.province || form.province,
    city: region.city || form.city,
    venueType,
    scene: joinVenueCsvValue(sceneValues),
    seatBucket,
  }
}

// 后台返回相对路径时，统一补成前端可访问的完整地址
export function resolveVenueImageUrl(url?: string) {
  if (!url) {
    return ''
  }

  if (isHttp(url)) {
    return url
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  if (!baseUrl) {
    return url
  }

  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

// 图集字段本质也是逗号字符串，这里统一拆成图片地址列表
export function getVenueGalleryImages(value?: string) {
  return splitVenueCsvValue(value)
    .map((item) => resolveVenueImageUrl(item))
    .filter(Boolean)
}
