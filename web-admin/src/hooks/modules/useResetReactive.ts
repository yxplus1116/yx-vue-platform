import { reactive } from 'vue'
import { cloneDeep, isFunction } from 'lodash-es'

// 响应式状态重置时，既支持直接传初始对象，也支持传工厂函数
export function useResetReactive<T extends object>(value: T | (() => T)) {
  const getInitValue = () => isFunction(value) ? value() : cloneDeep(value)

  const state = reactive(getInitValue())

  const reset = () => {
    Object.keys(state).forEach((key) => delete state[key])
    Object.assign(state, getInitValue())
  }

  return [state, reset] as const
}
