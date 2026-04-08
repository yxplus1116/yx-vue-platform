/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 项目部署基础路径，默认使用根路径
  readonly VITE_BASE?: string
  // 开发环境接口代理前缀
  readonly VITE_API_PREFIX?: string
  // 直连后端时使用的接口基础地址
  readonly VITE_API_BASE_URL?: string
  // 本地开发代理目标地址
  readonly VITE_API_PROXY_TARGET?: string
  // 统一认证中心客户端 ID
  readonly VITE_CLIENT_ID?: string
  // 登录态本地存储键名
  readonly VITE_TOKEN_STORAGE_KEY: string
  // 当前登录用户本地存储键名
  readonly VITE_USER_STORAGE_KEY?: string
  // 当前租户本地存储键名
  readonly VITE_TENANT_STORAGE_KEY?: string
  // 高德地图 JS API Key
  readonly VITE_AMAP_KEY?: string
  // 高德地图安全密钥
  readonly VITE_AMAP_SECURITY_JS_CODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  // 高德地图运行时对象，地图组件按需挂载时会用到
  AMap?: {
    Map: new (
      container: string | HTMLElement,
      options?: Record<string, unknown>,
    ) => {
      destroy?: () => void
      setCenter?: (position: [number, number]) => void
      setZoom?: (zoom: number) => void
      setFitView?: (overlays?: unknown[]) => void
    }
    Marker: new (options?: Record<string, unknown>) => {
      setMap?: (map: unknown) => void
    }
    Pixel: new (x: number, y: number) => unknown
  }
  // 高德地图安全配置对象
  _AMapSecurityConfig?: {
    securityJsCode?: string
  }
}
