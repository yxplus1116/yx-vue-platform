import { findTree } from 'xe-utils'
import { defineMock } from '../_base'
import { getDelayTime, resultSuccess } from '../_utils'
import areaData from '../_data/area'

export default defineMock([
  {
    url: '/region/children/:code',
    method: 'get',
    timeout: getDelayTime(),
    response: ({ query, url }) => {
      const rawCode = url?.split('/').pop() || query.code || '100000'
      const parentCode = String(rawCode)

      if (parentCode === '100000') {
        return resultSuccess(areaData.map((item) => ({
          code: item.code,
          name: item.label,
          fullname: item.label.endsWith('市') ? item.label : `${item.label}市`,
          level: 'province',
          children: [],
        })))
      }

      const parent = findTree(areaData, (item) => item.code === parentCode)
      return resultSuccess(parent?.item?.children?.map((item) => ({
        code: item.code,
        name: item.label,
        fullname: item.label,
        level: 'city',
        children: [],
      })) || [])
    },
  },
])
