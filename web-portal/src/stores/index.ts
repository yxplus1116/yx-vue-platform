import { createPinia } from 'pinia'

// 统一从这里导出各个 store，调用方直接用 @/stores 即可
export * from './modules'

// 门户端全局 Pinia 实例，在 main.ts 里挂载
const pinia = createPinia()

export default pinia
