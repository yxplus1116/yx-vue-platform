<template>
  <a-space class="gi-region-select" fill>
    <a-select v-model="provinceCode" :options="provinceOptions" :loading="provinceLoading" :disabled="props.disabled"
      :allow-clear="props.allowClear" :placeholder="props.provincePlaceholder" @change="handleProvinceChange"
      allow-search />
    <a-select v-model="cityCode" :options="cityOptions" :loading="cityLoading"
      :disabled="props.disabled || !provinceCode" :allow-clear="props.allowClear" :placeholder="props.cityPlaceholder"
      @change="handleCityChange" allow-search />
  </a-space>
</template>

<script setup lang="ts">
import { getRegionChildren, type RegionItem } from '@/apis/region'

/** 省市联动组件的值结构。 */
export interface GiRegionValue {
  /** 当前选中的省份名称。 */
  province: string
  /** 当前选中的城市名称。 */
  city: string
  /** 当前选中的省份编码。 */
  provinceCode?: string
  /** 当前选中的城市编码。 */
  cityCode?: string
}

/** 省市联动组件属性。 */
export interface GiRegionSelectProps {
  /** 当前双向绑定的地区值。 */
  modelValue?: Partial<GiRegionValue>
  /** 顶级地区编码，默认从全国根节点开始。 */
  topCode?: string
  /** 省份下拉占位提示。 */
  provincePlaceholder?: string
  /** 城市下拉占位提示。 */
  cityPlaceholder?: string
  /** 是否允许清空。 */
  allowClear?: boolean
  /** 是否禁用组件。 */
  disabled?: boolean
  /** 省份字段名，用于 GiForm 多字段回填。 */
  provinceField?: string
  /** 城市字段名，用于 GiForm 多字段回填。 */
  cityField?: string
}

/** 地区下拉选项。 */
interface RegionOption {
  /** 选项展示名称。 */
  label: string
  /** 选项完整名称。 */
  fullname: string
  /** 选项编码值。 */
  value: string
}

const props = withDefaults(defineProps<GiRegionSelectProps>(), {
  modelValue: () => ({ province: '', city: '', provinceCode: '', cityCode: '' }),
  topCode: '100000',
  provincePlaceholder: '请选择省份',
  cityPlaceholder: '请选择城市',
  allowClear: true,
  disabled: false,
  provinceField: 'province',
  cityField: 'city',
})

const emit = defineEmits<{
  /** 更新当前地区值。 */
  (e: 'update:modelValue', value: GiRegionValue): void
  /** 省市值变化时抛出最新结果。 */
  (e: 'change', value: GiRegionValue): void
}>()

/** 省份下拉选项列表。 */
const provinceOptions = ref<RegionOption[]>([])
/** 城市下拉选项列表。 */
const cityOptions = ref<RegionOption[]>([])
/** 当前选中的省份编码。 */
const provinceCode = ref('')
/** 当前选中的城市编码。 */
const cityCode = ref('')
/** 省份加载状态。 */
const provinceLoading = ref(false)
/** 城市加载状态。 */
const cityLoading = ref(false)

/** 将接口返回结果转换为下拉选项。 */
function mapRegionOptions(list: RegionItem[]) {
  return list.map((item) => ({
    label: item.name,
    fullname: item.fullname,
    value: item.code,
  }))
}

/** 组装统一的地区值对象。 */
function buildRegionValue() {
  const selectedProvince = provinceOptions.value.find((item) => item.value === provinceCode.value)
  const selectedCity = cityOptions.value.find((item) => item.value === cityCode.value)

  return {
    province: selectedProvince?.fullname || selectedProvince?.label || '',
    city: selectedCity?.fullname || selectedCity?.label || '',
    provinceCode: provinceCode.value,
    cityCode: cityCode.value,
  }
}

/** 加载省份选项。 */
async function loadProvinceOptions() {
  provinceLoading.value = true
  try {
    const { data } = await getRegionChildren(props.topCode)
    provinceOptions.value = mapRegionOptions(data || [])
  } finally {
    provinceLoading.value = false
  }
}

/** 根据省份编码加载城市选项。 */
async function loadCityOptions(parentCode?: string) {
  if (!parentCode) {
    cityOptions.value = []
    return
  }

  cityLoading.value = true
  try {
    const { data } = await getRegionChildren(parentCode)
    cityOptions.value = mapRegionOptions(data || [])
  } finally {
    cityLoading.value = false
  }
}

/** 按外部值回填省市编码和下拉数据。 */
async function syncFromModelValue(value?: Partial<GiRegionValue>) {
  if (!provinceOptions.value.length) {
    await loadProvinceOptions()
  }

  provinceCode.value = value?.provinceCode || provinceOptions.value.find((item) => item.fullname === value?.province || item.label === value?.province)?.value || ''
  await loadCityOptions(provinceCode.value)
  cityCode.value = value?.cityCode || cityOptions.value.find((item) => item.fullname === value?.city || item.label === value?.city)?.value || ''
}

/** 处理省份变化，并级联清空城市。 */
async function handleProvinceChange(value?: string | number | boolean) {
  provinceCode.value = String(value || '')
  cityCode.value = ''
  await loadCityOptions(provinceCode.value)
  const nextValue = buildRegionValue()
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

/** 处理城市变化，并同步输出完整地区值。 */
function handleCityChange(value?: string | number | boolean) {
  cityCode.value = String(value || '')
  const nextValue = buildRegionValue()
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

watch(
  () => props.modelValue,
  (value) => {
    syncFromModelValue(value)
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss">
.gi-region-select {
  width: 100%;
}

.gi-region-select :deep(.arco-space-item) {
  flex: 1;
}
</style>
