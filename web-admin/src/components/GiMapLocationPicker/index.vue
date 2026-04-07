<template>
  <div class="gi-map-location-picker">
    <a-input
      :model-value="displayAddress"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      readonly
    >
      <template #append>
        <a-button type="text" :disabled="props.disabled" @click="openPicker">
          选择位置
        </a-button>
      </template>
    </a-input>
    <div v-if="currentValue.longitude || currentValue.latitude" class="gi-map-location-picker__meta">
      <span>已选经度：{{ currentValue.longitude || '--' }}</span>
      <span>已选纬度：{{ currentValue.latitude || '--' }}</span>
    </div>

    <a-modal
      v-model:visible="visible"
      title="选择位置"
      :width="width >= 1080 ? 1080 : '100%'"
      :mask-closable="false"
      :footer="false"
      @open="handleModalOpen"
      @close="handleModalClose"
    >
      <a-alert
        v-if="loadError"
        type="warning"
        :show-icon="true"
        class="mb-12px"
      >
        {{ loadError }}
      </a-alert>
      <div class="gi-map-location-picker__body">
        <div class="gi-map-location-picker__map">
          <div ref="mapRef" class="gi-map-location-picker__canvas"></div>
        </div>
        <div class="gi-map-location-picker__panel">
          <div class="gi-map-location-picker__current">
            <div class="gi-map-location-picker__current-title">当前选中</div>
            <div>{{ draftValue.address || '请点击地图或拖动标记选择坐标' }}</div>
            <div class="gi-map-location-picker__current-meta">
              <span>经度：{{ draftValue.longitude || '--' }}</span>
              <span>纬度：{{ draftValue.latitude || '--' }}</span>
            </div>
          </div>
          <a-alert :show-icon="true" type="info">
            点击地图或拖动标记即可选择坐标，确定后自动回填经纬度。
          </a-alert>
        </div>
      </div>
      <div class="gi-map-location-picker__footer">
        <a-space>
          <a-button @click="visible = false">取消</a-button>
          <a-button type="primary" :disabled="!draftValue.longitude || !draftValue.latitude" @click="handleConfirm">
            确定
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { useWindowSize } from '@vueuse/core'

/** 位置选择组件的值结构。 */
export interface GiMapLocationValue {
  /** 详细地址。 */
  address: string
  /** 经度。 */
  longitude: string
  /** 纬度。 */
  latitude: string
  /** 地点名称。 */
  name?: string
}

/** 地图位置选择组件属性。 */
export interface GiMapLocationPickerProps {
  /** 当前双向绑定的地址信息。 */
  modelValue?: Partial<GiMapLocationValue>
  /** 是否禁用组件。 */
  disabled?: boolean
  /** 输入框占位提示。 */
  placeholder?: string
  /** 地址字段名，用于 GiForm 多字段回填。 */
  addressField?: string
  /** 经度字段名，用于 GiForm 多字段回填。 */
  longitudeField?: string
  /** 纬度字段名，用于 GiForm 多字段回填。 */
  latitudeField?: string
}

/** 仅声明当前组件实际依赖的高德对象能力。 */
interface AMapSDK {
  Map: new (container: HTMLElement, options: Record<string, unknown>) => AMapMapInstance
  Marker: new (options: Record<string, unknown>) => AMapMarkerInstance
  Geocoder: new (options?: Record<string, unknown>) => AMapGeocoderInstance
  Geolocation: new (options?: Record<string, unknown>) => AMapGeolocationInstance
  Pixel: new (x: number, y: number) => unknown
}

/** 当前组件使用到的地图实例能力。 */
interface AMapMapInstance {
  on?: (eventName: string, handler: (...args: any[]) => void) => void
  off?: (eventName: string, handler: (...args: any[]) => void) => void
  destroy?: () => void
  setCenter?: (position: [number, number]) => void
  setZoom?: (zoom: number) => void
}

/** 当前组件使用到的 marker 能力。 */
interface AMapMarkerInstance {
  setMap?: (map: unknown) => void
  setPosition?: (position: [number, number]) => void
  on?: (eventName: string, handler: (...args: any[]) => void) => void
}

/** 当前组件使用到的地理编码能力。 */
interface AMapGeocoderInstance {
  getAddress?: (
    location: [number, number],
    callback: (status: string, result: { regeocode?: { formattedAddress?: string } }) => void,
  ) => void
}

/** 当前组件使用到的定位能力。 */
interface AMapGeolocationInstance {
  getCurrentPosition?: (
    callback: (status: string, result: { position?: { lng?: number, lat?: number } }) => void,
  ) => void
}

const props = withDefaults(defineProps<GiMapLocationPickerProps>(), {
  modelValue: () => ({ address: '', longitude: '', latitude: '', name: '' }),
  disabled: false,
  placeholder: '请选择地图位置并自动回填经纬度',
  addressField: 'address',
  longitudeField: 'longitude',
  latitudeField: 'latitude',
})

const emit = defineEmits<{
  /** 更新当前地址信息。 */
  (e: 'update:modelValue', value: GiMapLocationValue): void
  /** 位置变化时抛出最新值。 */
  (e: 'change', value: GiMapLocationValue): void
}>()

const { width } = useWindowSize()

const amapKey = import.meta.env.VITE_AMAP_KEY?.trim()
const amapSecurityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE?.trim()

const visible = ref(false)
const loadError = ref('')
const mapRef = ref<HTMLElement>()
const mapInstance = ref<AMapMapInstance | null>(null)
const markerInstance = ref<AMapMarkerInstance | null>(null)
const geocoderInstance = ref<AMapGeocoderInstance | null>(null)
const geolocationInstance = ref<AMapGeolocationInstance | null>(null)
const currentValue = ref<GiMapLocationValue>({
  address: '',
  longitude: '',
  latitude: '',
  name: '',
})
const draftValue = ref<GiMapLocationValue>({
  address: '',
  longitude: '',
  latitude: '',
  name: '',
})

let amapLoaderPromise: Promise<AMapSDK> | null = null
let mapClickHandler: ((event: any) => void) | null = null

/** 输入框中展示的坐标文案。 */
const displayAddress = computed(() => {
  if (currentValue.value.longitude && currentValue.value.latitude) {
    return `${currentValue.value.longitude}, ${currentValue.value.latitude}`
  }

  return ''
})

/** 将任意值整理为稳定的位置对象。 */
function normalizeLocationValue(value?: Partial<GiMapLocationValue>): GiMapLocationValue {
  return {
    address: value?.address || '',
    longitude: value?.longitude || '',
    latitude: value?.latitude || '',
    name: value?.name || '',
  }
}

/** 将高德 SDK 加载成可复用的单例。 */
function loadAmap() {
  if (!amapKey) {
    return Promise.reject(new Error('未配置 VITE_AMAP_KEY'))
  }

  if (amapSecurityJsCode) {
    window._AMapSecurityConfig = {
      securityJsCode: amapSecurityJsCode,
    }
  }

  if (!amapLoaderPromise) {
    amapLoaderPromise = AMapLoader.load({
      key: amapKey,
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.Geolocation'],
    }) as Promise<AMapSDK>
  }

  return amapLoaderPromise
}

/** 销毁地图实例，避免弹窗反复打开时残留监听。 */
function destroyMap() {
  if (mapInstance.value && mapClickHandler) {
    mapInstance.value.off?.('click', mapClickHandler)
  }
  mapInstance.value?.destroy?.()
  mapInstance.value = null
  markerInstance.value = null
  geocoderInstance.value = null
  geolocationInstance.value = null
  mapClickHandler = null
}

/** 按经纬度把 marker 和地图中心同步到指定位置。 */
function updateMarkerPosition(longitude: string, latitude: string) {
  const lng = Number(longitude)
  const lat = Number(latitude)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return
  }

  const position: [number, number] = [lng, lat]
  markerInstance.value?.setPosition?.(position)
  mapInstance.value?.setCenter?.(position)
}

/** 根据经纬度反查地址，并写入草稿值。 */
function reverseGeocode(longitude: string, latitude: string) {
  return new Promise<void>((resolve) => {
    const lng = Number(longitude)
    const lat = Number(latitude)

    if (!geocoderInstance.value?.getAddress || !Number.isFinite(lng) || !Number.isFinite(lat)) {
      resolve()
      return
    }

    geocoderInstance.value.getAddress([lng, lat], (status, result) => {
      if (status === 'complete' && result?.regeocode?.formattedAddress) {
        draftValue.value = {
          ...draftValue.value,
          address: result.regeocode.formattedAddress,
          longitude,
          latitude,
        }
      }
      resolve()
    })
  })
}

/** 使用浏览器或高德能力尝试定位当前位置。 */
function resolveCurrentPosition() {
  return new Promise<{ longitude: string, latitude: string } | null>((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            longitude: String(position.coords.longitude),
            latitude: String(position.coords.latitude),
          })
        },
        () => {
          if (!geolocationInstance.value?.getCurrentPosition) {
            resolve(null)
            return
          }
          geolocationInstance.value.getCurrentPosition((status, result) => {
            if (status === 'complete' && result?.position?.lng && result?.position?.lat) {
              resolve({
                longitude: String(result.position.lng),
                latitude: String(result.position.lat),
              })
              return
            }
            resolve(null)
          })
        },
        { enableHighAccuracy: true, timeout: 8000 },
      )
      return
    }

    if (!geolocationInstance.value?.getCurrentPosition) {
      resolve(null)
      return
    }

    geolocationInstance.value.getCurrentPosition((status, result) => {
      if (status === 'complete' && result?.position?.lng && result?.position?.lat) {
        resolve({
          longitude: String(result.position.lng),
          latitude: String(result.position.lat),
        })
        return
      }
      resolve(null)
    })
  })
}

/** 初始化地图实例和 marker。 */
async function initMap() {
  if (!visible.value || !mapRef.value) {
    return
  }

  try {
    const AMap = await loadAmap()
    geolocationInstance.value = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 8000,
    })

    if (!draftValue.value.longitude || !draftValue.value.latitude) {
      const currentPosition = await resolveCurrentPosition()
      if (currentPosition) {
        draftValue.value = {
          ...draftValue.value,
          longitude: currentPosition.longitude,
          latitude: currentPosition.latitude,
        }
      }
    }

    const longitude = Number(draftValue.value.longitude || currentValue.value.longitude || '116.397428')
    const latitude = Number(draftValue.value.latitude || currentValue.value.latitude || '39.90923')
    const center: [number, number] = [longitude, latitude]

    destroyMap()

    mapInstance.value = new AMap.Map(mapRef.value, {
      zoom: 15,
      center,
      resizeEnable: true,
      viewMode: '2D',
    })

    markerInstance.value = new AMap.Marker({
      map: mapInstance.value,
      position: center,
      draggable: true,
      anchor: 'bottom-center',
    })

    geocoderInstance.value = new AMap.Geocoder()

    markerInstance.value.on?.('dragend', async (event: any) => {
      const longitude = String(event?.lnglat?.lng || '')
      const latitude = String(event?.lnglat?.lat || '')
      draftValue.value = {
        ...draftValue.value,
        longitude,
        latitude,
      }
      await reverseGeocode(longitude, latitude)
    })

    mapClickHandler = async (event: any) => {
      const longitude = String(event?.lnglat?.lng || '')
      const latitude = String(event?.lnglat?.lat || '')
      draftValue.value = {
        ...draftValue.value,
        longitude,
        latitude,
      }
      updateMarkerPosition(longitude, latitude)
      await reverseGeocode(longitude, latitude)
    }

    mapInstance.value.on?.('click', mapClickHandler)
    updateMarkerPosition(String(center[0]), String(center[1]))
    if (!draftValue.value.address) {
      await reverseGeocode(String(center[0]), String(center[1]))
    }
    loadError.value = ''
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '高德地图加载失败'
  }
}

/** 打开弹窗，并准备草稿值。 */
function openPicker() {
  draftValue.value = normalizeLocationValue(currentValue.value)
  visible.value = true
}

/** 弹窗打开后初始化地图。 */
async function handleModalOpen() {
  await nextTick()
  initMap()
}

/** 关闭弹窗时清理临时搜索结果和地图实例。 */
function handleModalClose() {
  destroyMap()
}

/** 确认当前草稿值，并同步给外层表单。 */
function handleConfirm() {
  currentValue.value = normalizeLocationValue(draftValue.value)
  emit('update:modelValue', currentValue.value)
  emit('change', currentValue.value)
  visible.value = false
}

watch(
  () => props.modelValue,
  (value) => {
    currentValue.value = normalizeLocationValue(value)
    if (!visible.value) {
      draftValue.value = normalizeLocationValue(value)
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss">
.gi-map-location-picker {
  width: 100%;
}

.gi-map-location-picker__meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: 12px;
  line-height: 1.5;
}

.gi-map-location-picker__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
}

.gi-map-location-picker__map {
  min-width: 0;
}

.gi-map-location-picker__canvas {
  height: 460px;
  overflow: hidden;
  border: 1px solid var(--color-border-2);
  border-radius: 6px;
}

.gi-map-location-picker__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.gi-map-location-picker__current {
  padding: 12px;
  border: 1px solid var(--color-border-2);
  border-radius: 6px;
  background: var(--color-fill-1);
  line-height: 1.7;
}

.gi-map-location-picker__current-title {
  margin-bottom: 6px;
  color: var(--color-text-1);
  font-weight: 500;
}

.gi-map-location-picker__current-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: 12px;
}

.gi-map-location-picker__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 960px) {
  .gi-map-location-picker__body {
    grid-template-columns: 1fr;
  }

  .gi-map-location-picker__canvas {
    height: 320px;
  }
}
</style>
