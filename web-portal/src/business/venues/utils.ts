import type { DictOption } from '@/apis/system'

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

// 按字典值取展示文案
export function findDictOptionLabel(list: DictOption[], value?: string) {
  if (!value) {
    return ''
  }

  const matched = list.find((item) => String(item.value) === String(value))
  return matched?.label || ''
}
