<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import mapMarkerIcon from '@/assets/image/map-marker.png'

// 地图组件对页面暴露的最小输入集合。
// 后台只要维护经纬度、地址和可选高度，就可以驱动前台显示。
interface Props {
  // 考点经度，用于地图中心点与 marker 定位。
  longitude?: number | null
  // 考点纬度，用于地图中心点与 marker 定位。
  latitude?: number | null
  // 详细地址，用于 marker title、导航链接和底部文案展示。
  address?: string
  // 地图默认缩放级别。
  zoom?: number
  // 地图容器高度，支持 number 和 css 字符串。
  height?: number | string
  // 是否允许在组件内放大查看地图。
  allowExpand?: boolean
}

// 当前组件实际用到的高德地图实例能力。
type AMapInstance = {
  destroy?: () => void
  setCenter?: (position: [number, number]) => void
  setZoom?: (zoom: number) => void
}

// 当前组件实际用到的高德 marker 能力。
type AMapMarkerInstance = {
  setMap?: (map: unknown) => void
}

const props = withDefaults(defineProps<Props>(), {
  longitude: null,
  latitude: null,
  address: '',
  zoom: 15,
  height: 260,
  allowExpand: true,
})

// 地图 Key 与安全密钥统一从环境变量读取，避免写死在代码里。
const amapKey = import.meta.env.VITE_AMAP_KEY?.trim()
const amapSecurityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE?.trim()

// 主地图容器节点。
const mapContainerRef = ref<HTMLElement | null>(null)
// 放大态地图容器节点。
const dialogMapContainerRef = ref<HTMLElement | null>(null)
// 主地图实例。
const mapInstance = ref<AMapInstance | null>(null)
// 放大态地图实例。
const dialogMapInstance = ref<AMapInstance | null>(null)
// 标记高德地图是否已经成功初始化。
const mapReady = ref(false)
// 放大弹层开关。
const expanded = ref(false)
// 记录高德地图加载失败信息，便于自动回退到占位图。
const loadError = ref('')

// 经纬度同时存在时，才允许渲染真实地图或占位 marker。
const hasCoordinates = computed(
  () => typeof props.longitude === 'number' && typeof props.latitude === 'number',
)

// 真实地图不可用时统一回退到占位图，保证页面始终可展示。
const useFallback = computed(() => !mapReady.value || !hasCoordinates.value || !!loadError.value)

// 占位地图里的 marker 会根据经纬度生成稳定位置，避免所有考点重叠在一起。
const markerStyle = computed(() => {
  if (!hasCoordinates.value) {
    return {
      left: '50%',
      top: '50%',
    }
  }

  const longitude = props.longitude as number
  const latitude = props.latitude as number
  const left = 20 + ((longitude * 100) % 60)
  const top = 18 + ((latitude * 100) % 52)

  return {
    left: `${Math.min(82, Math.max(18, left))}%`,
    top: `${Math.min(78, Math.max(16, top))}%`,
  }
})

// 统一格式化经纬度展示文案，方便排查后台配置是否正确。
const coordinateText = computed(() => {
  if (!hasCoordinates.value) {
    return '待配置经纬度'
  }

  return `${props.longitude}, ${props.latitude}`
})

// 地图状态文案会根据 Key、经纬度和加载结果自动切换。
const statusText = computed(() => {
  if (!amapKey) {
    return '未配置 AMap Key，当前展示占位地图'
  }

  if (!hasCoordinates.value) {
    return '待配置经纬度'
  }

  if (loadError.value) {
    return '高德地图加载失败，已回退占位地图'
  }

  return '高德地图'
})

// 统一将高度 props 转成内联样式，避免页面层重复写覆盖样式。
const canvasStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

// 放大查看时使用更大的容器高度，提升查看体验。
const dialogCanvasStyle = computed(() => ({
  height: '70vh',
}))

// 导航链接直接跳到高德地图，方便用户从浏览器端继续导航。
const navigationUrl = computed(() => {
  if (!hasCoordinates.value) {
    return ''
  }

  const name = encodeURIComponent(props.address || '考点位置')
  return `https://uri.amap.com/navigation?to=${props.longitude},${props.latitude},${name}&mode=car&src=pc-portal&coordinate=gaode`
})

let amapScriptPromise: Promise<void> | null = null

// 动态加载高德 JS SDK，避免在没有地图需求的页面提前引入脚本。
const loadAmapScript = () => {
  if (!amapKey) {
    return Promise.reject(new Error('AMap key is empty'))
  }

  if (window.AMap) {
    return Promise.resolve()
  }

  if (amapSecurityJsCode) {
    window._AMapSecurityConfig = {
      securityJsCode: amapSecurityJsCode,
    }
  }

  if (!amapScriptPromise) {
    amapScriptPromise = new Promise<void>((resolve, reject) => {
      const existed = document.querySelector<HTMLScriptElement>('script[data-amap-sdk="true"]')

      if (existed) {
        existed.addEventListener('load', () => resolve(), { once: true })
        existed.addEventListener('error', () => reject(new Error('高德地图脚本加载失败')), {
          once: true,
        })
        return
      }

      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`
      script.async = true
      script.defer = true
      script.dataset.amapSdk = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('高德地图脚本加载失败'))
      document.head.appendChild(script)
    })
  }

  return amapScriptPromise
}

// 构造统一的 marker DOM，保证主地图和放大地图视觉一致。
const createMarkerContent = () => `
  <div class="venue-map-marker">
    <img class="venue-map-marker__icon" src="${mapMarkerIcon}" alt="" />
  </div>
`

// 销毁指定地图实例，避免切换考点或放大状态时残留旧对象。
const destroyMap = (target: typeof mapInstance | typeof dialogMapInstance) => {
  target.value?.destroy?.()
  target.value = null
}

// 在指定容器中渲染一份高德地图实例。
const renderMapIntoContainer = async (
  container: HTMLElement | null,
  target: typeof mapInstance | typeof dialogMapInstance,
) => {
  if (!container || !hasCoordinates.value || !amapKey) {
    destroyMap(target)
    return
  }

  await loadAmapScript()

  if (!window.AMap) {
    throw new Error('高德地图对象不可用')
  }

  destroyMap(target)

  const center = [props.longitude, props.latitude] as [number, number]
  const map = new window.AMap.Map(container, {
    zoom: props.zoom,
    center,
    resizeEnable: true,
    viewMode: '2D',
  }) as AMapInstance

  const marker = new window.AMap.Marker({
    map,
    position: center,
    title: props.address,
    anchor: 'bottom-center',
    content: createMarkerContent(),
  }) as AMapMarkerInstance

  marker.setMap?.(map)
  map.setCenter?.(center)
  map.setZoom?.(props.zoom)

  target.value = map
}

// 主地图渲染入口。
const renderMainMap = async () => {
  if (!mapContainerRef.value || !hasCoordinates.value || !amapKey) {
    destroyMap(mapInstance)
    mapReady.value = false
    return
  }

  try {
    await renderMapIntoContainer(mapContainerRef.value, mapInstance)
    mapReady.value = true
    loadError.value = ''
  } catch (error) {
    destroyMap(mapInstance)
    mapReady.value = false
    loadError.value = error instanceof Error ? error.message : '高德地图加载失败'
  }
}

// 放大态地图渲染入口。
const renderDialogMap = async () => {
  if (!expanded.value || !dialogMapContainerRef.value) {
    destroyMap(dialogMapInstance)
    return
  }

  try {
    await renderMapIntoContainer(dialogMapContainerRef.value, dialogMapInstance)
  } catch {
    destroyMap(dialogMapInstance)
  }
}

// 打开高德地图导航页面。
const openNavigation = () => {
  if (!navigationUrl.value) {
    return
  }

  window.open(navigationUrl.value, '_blank', 'noopener,noreferrer')
}

// 打开放大查看弹层。
const openExpandedMap = () => {
  if (!props.allowExpand) {
    return
  }

  expanded.value = true
}

// 关闭放大查看弹层。
const closeExpandedMap = () => {
  expanded.value = false
}

// 首次挂载时初始化主地图。
onMounted(async () => {
  await nextTick()
  await renderMainMap()
})

// 经纬度、缩放或高度变化时同步刷新地图实例。
watch(
  () => [props.longitude, props.latitude, props.zoom, props.height] as const,
  async () => {
    await nextTick()
    await renderMainMap()

    if (expanded.value) {
      await nextTick()
      await renderDialogMap()
    }
  },
)

// 放大开关变化时控制放大地图的初始化和销毁。
watch(expanded, async (visible) => {
  if (!visible) {
    destroyMap(dialogMapInstance)
    return
  }

  await nextTick()
  await renderDialogMap()
})

// 组件卸载时清理主地图和放大地图实例。
onUnmounted(() => {
  destroyMap(mapInstance)
  destroyMap(dialogMapInstance)
})
</script>

<template>
  <div class="venue-map">
    <div class="venue-map__canvas" :class="{ 'is-fallback': useFallback }" :style="canvasStyle">
      <div class="venue-map__toolbar">
        <button v-if="allowExpand" type="button" class="venue-map__tool" @click="openExpandedMap">
          放大查看
        </button>
        <button type="button" class="venue-map__tool venue-map__tool--primary" :disabled="!navigationUrl"
          @click="openNavigation">
          高德导航
        </button>
      </div>

      <div v-if="useFallback" class="venue-map__fallback">
        <div class="venue-map__grid"></div>
        <div class="venue-map__road is-horizontal"></div>
        <div class="venue-map__road is-vertical"></div>
        <div class="venue-map__road is-diagonal"></div>
        <div class="venue-map__marker" :style="markerStyle"></div>
      </div>

      <div ref="mapContainerRef" class="venue-map__real"></div>

      <div class="venue-map__meta">
        <span>{{ statusText }}</span>
        <strong>{{ coordinateText }}</strong>
      </div>
    </div>

    <p v-if="address" class="venue-map__address">
      {{ address }}
    </p>

    <Teleport to="body">
      <div v-if="expanded" class="venue-map__dialog-mask" @click.self="closeExpandedMap">
        <div class="venue-map__dialog">
          <div class="venue-map__dialog-head">
            <div>
              <h3>考点地图</h3>
              <p>{{ address || '当前考点位置' }}</p>
            </div>
            <button type="button" class="venue-map__dialog-close" @click="closeExpandedMap">
              关闭
            </button>
          </div>

          <div class="venue-map__dialog-canvas" :style="dialogCanvasStyle">
            <div ref="dialogMapContainerRef" class="venue-map__real"></div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="less">
.venue-map {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__canvas,
  &__dialog-canvas {
    position: relative;
    overflow: hidden;
    border: 1px solid #edf1f7;
    border-radius: 8px;
    background: linear-gradient(180deg, #f5f8fc, #eef4fb);
  }

  &__real,
  &__fallback {
    position: absolute;
    inset: 0;
  }

  &__toolbar {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 3;
    display: flex;
    gap: 8px;
  }

  &__tool {
    height: 32px;
    padding: 0 12px;
    border: 1px solid #d6deee;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    color: #31425f;
    font-size: 13px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    &--primary {
      border-color: #2b74ff;
      background: #2b74ff;
      color: #fff;
    }
  }

  &__grid {
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(90deg,
        rgba(205, 220, 241, 0.28) 0,
        rgba(205, 220, 241, 0.28) 1px,
        transparent 1px,
        transparent 46px),
      repeating-linear-gradient(180deg,
        rgba(205, 220, 241, 0.28) 0,
        rgba(205, 220, 241, 0.28) 1px,
        transparent 1px,
        transparent 36px);
  }

  &__road {
    position: absolute;
    border-radius: 999px;
    background: #fde2a7;
    box-shadow: inset 0 0 0 1px rgba(235, 191, 105, 0.72);

    &.is-horizontal {
      top: 44%;
      left: 4%;
      width: 72%;
      height: 24px;
    }

    &.is-vertical {
      top: 4%;
      right: 8%;
      width: 28px;
      height: 88%;
    }

    &.is-diagonal {
      right: 22%;
      bottom: 18%;
      width: 30%;
      height: 20px;
      transform: rotate(-22deg);
    }
  }

  &__marker {
    position: absolute;
    width: 36px;
    height: 42px;
    background: url('@/assets/image/map-marker.png') center / contain no-repeat;
    transform: translate(-50%, -100%);
  }

  &__meta {
    position: absolute;
    right: 14px;
    bottom: 14px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 8px 20px rgba(45, 66, 114, 0.08);

    span {
      color: #7a8599;
      font-size: 12px;
      line-height: 1.2;
    }

    strong {
      color: #23304a;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.4;
    }
  }

  &__address {
    margin: 0;
    color: #4e5969;
    font-size: 13px;
    line-height: 1.8;
  }

  &__dialog-mask {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(10, 18, 35, 0.52);
    backdrop-filter: blur(4px);
  }

  &__dialog {
    width: min(1200px, 100%);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
  }

  &__dialog-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 20px 16px;



    h3 {
      margin: 0;
      color: #111827;
      font-size: 20px;
      line-height: 1.3;
    }

    p {
      margin: 6px 0 0;
      color: #667085;
      font-size: 13px;
      line-height: 1.6;
    }
  }

  &__dialog-close {
    height: 34px;
    padding: 0 14px;
    border: 1px solid #d6deee;
    border-radius: 999px;
    background: #fff;
    color: #31425f;
    font-size: 13px;
    cursor: pointer;
  }

  :deep(.venue-map-marker) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    transform: translateY(-6px);
  }

  :deep(.venue-map-marker::before) {
    position: absolute;
    inset: 50% auto auto 50%;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(49, 122, 247, 0.24);
    transform: translate(-50%, -8%) scale(1);
    animation: venue-map-pulse 1.8s ease-out infinite;
    content: '';
  }

  :deep(.venue-map-marker::after) {
    position: absolute;
    inset: auto auto 4px 50%;
    width: 34px;
    height: 12px;
    border-radius: 50%;
    background: rgba(31, 48, 88, 0.2);
    filter: blur(3px);
    transform: translateX(-50%);
    content: '';
  }

  :deep(.venue-map-marker__icon) {
    position: relative;
    z-index: 1;
    display: block;
    width: 36px;
    height: 42px;
    object-fit: contain;
  }
}

@keyframes venue-map-pulse {
  0% {
    opacity: 0.9;
    transform: translate(-50%, -8%) scale(0.85);
  }

  70% {
    opacity: 0;
    transform: translate(-50%, -8%) scale(3);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -8%) scale(3);
  }
}

@media (max-width: 768px) {
  .venue-map {
    &__toolbar {
      top: 10px;
      left: 10px;
      flex-wrap: wrap;
    }

    &__meta {
      right: 10px;
      bottom: 10px;
    }

    &__dialog-mask {
      padding: 12px;
    }

    &__dialog-head {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
