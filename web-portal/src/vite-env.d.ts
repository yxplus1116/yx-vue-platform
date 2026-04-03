/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_PREFIX: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_TOKEN_STORAGE_KEY: string
  readonly VITE_AMAP_KEY?: string
  readonly VITE_AMAP_SECURITY_JS_CODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
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
  _AMapSecurityConfig?: {
    securityJsCode?: string
  }
}
