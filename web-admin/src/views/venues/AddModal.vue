<template>
  <a-modal v-model:visible="visible" :title="title" :mask-closable="false" :esc-to-close="false"
    :width="width >= 960 ? 960 : '100%'" draggable @before-ok="save" @close="reset">
    <GiForm ref="formRef" v-model="form" :columns="columns" layout="vertical" />
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { getVenues, addVenues, updateVenues } from '@/apis/business/venues'
import { type ColumnItem, GiForm } from '@/components/GiForm'
import { useResetReactive } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { width } = useWindowSize()

const dataId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改考点' : '新增考点'))
const formRef = ref<InstanceType<typeof GiForm>>()
const { venueType, seatCount, scene } = useDict('venueType', 'seatCount', 'scene')

/** 考点表单中的地区值。 */
interface VenueRegionValue {
  /** 当前选中的省份名称。 */
  province: string
  /** 当前选中的城市名称。 */
  city: string
  /** 当前选中的省份编码。 */
  provinceCode?: string
  /** 当前选中的城市编码。 */
  cityCode?: string
}

/** 考点表单中的地图选点值。 */
interface VenueLocationValue {
  /** 详细地址。 */
  address: string
  /** 经度。 */
  longitude: string
  /** 纬度。 */
  latitude: string
  /** 地点名称。 */
  name?: string
}

const [form, resetForm] = useResetReactive({
  title: '',
  summary: '',
  description: '',
  region: {
    province: '',
    city: '',
    provinceCode: '',
    cityCode: '',
  } as VenueRegionValue,
  locationPicker: {
    address: '',
    longitude: '',
    latitude: '',
    name: '',
  } as VenueLocationValue,
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
  seatBucket: undefined,
  scene: undefined,
  venueType: undefined,
  tags: '',
  coverImage: '',
  gallery: '',
  status: 1,
  isRecommended: 0,
  sort: 0,
})

const columns: ColumnItem[] = reactive([
  {
    label: '基础信息',
    field: 'basicInfoTitle',
    type: 'group-title',
    span: 24,
    formItemProps: {
      hideLabel: true,
    },
    props: {
      type: 'info',
    },
  },
  {
    label: '考点名称',
    field: 'title',
    type: 'textarea',
    span: 12,
    required: true,
    props: {
      maxLength: 20,
      autoSize: { minRows: 2, maxRows: 3 },
    },
  },
  {
    label: '首页卡片摘要',
    field: 'summary',
    type: 'textarea',
    span: 12,
    required: true,
    props: {
      maxLength: 200,
      autoSize: { minRows: 2, maxRows: 3 },
    },
  },
  {
    label: '详情介绍',
    field: 'description',
    type: 'editor',
    span: 24,
    required: true,
    props: {
      minHeight: 160,
      placeholder: '请输入考点详情介绍',
    },
  },
  {
    label: '考点类型',
    field: 'venueType',
    type: 'select',
    span: 6,
    required: true,
    props: {
      options: venueType,
    },
  },
  {
    label: '应用场景',
    field: 'scene',
    type: 'select',
    span: 6,
    required: true,
    props: {
      options: scene,
    },
  },
  {
    label: '考位区间',
    field: 'seatBucket',
    type: 'select',
    span: 6,
    required: true,
    props: {
      options: seatCount,
    },
  },
  {
    label: '标签',
    field: 'tags',
    type: 'input',
    span: 6,
    props: {
      maxLength: 100,
    },
    formItemSlots: {
      extra: '多个标签请使用英文逗号分隔，例如：机考,纸考,公办院校',
    },
  },
  {
    label: '位置信息',
    field: 'locationInfoTitle',
    type: 'group-title',
    span: 24,
    formItemProps: {
      hideLabel: true,
    },
    props: {
      type: 'info',
    },
  },
  {
    label: '所在地区',
    field: 'region',
    type: 'region-select',
    span: 24,
    required: true,
    props: {
      topCode: '100000',
      provinceField: 'province',
      cityField: 'city',
    },
  },
  {
    label: '详细地址',
    field: 'address',
    type: 'textarea',
    span: 24,
    required: true,
    props: {
      maxLength: 255,
      autoSize: { minRows: 2, maxRows: 3 },
    },
  },
  {
    label: '列表展示地址',
    field: 'locationText',
    type: 'input',
    span: 24,
    required: true,
    props: {
      maxLength: 100,
    },
  },
  {
    label: '地图选点',
    field: 'locationPicker',
    type: 'map-location-picker',
    span: 24,
    required: true,
    props: {
      longitudeField: 'longitude',
      latitudeField: 'latitude',
      placeholder: '请选择地图位置并自动回填经纬度',
    },
    formItemSlots: {
      extra: '点击地图或拖动标记即可选择坐标，确定后自动回填经纬度',
    },
  },

  {
    label: '联系与规模',
    field: 'contactInfoTitle',
    type: 'group-title',
    span: 24,
    formItemProps: {
      hideLabel: true,
    },
    props: {
      type: 'info',
    },
  },
  {
    label: '联系电话',
    field: 'phone',
    type: 'input',
    span: 12,
    required: true,
    props: {
      maxLength: 20,
    },
  },
  {
    label: '联系邮箱',
    field: 'email',
    type: 'input',
    span: 12,
    required: true,
    props: {
      maxLength: 100,
    },
    rules: [
      {
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入正确的邮箱地址',
      },
    ],
  },
  {
    label: '考场数量',
    field: 'roomCount',
    type: 'input-number',
    span: 12,
    required: true,
    props: {
      min: 0,
      mode: 'button',
    },
  },
  {
    label: '考位数量',
    field: 'seatCount',
    type: 'input-number',
    span: 12,
    required: true,
    props: {
      min: 0,
      mode: 'button',
    },
  },
  {
    label: '展示与运营',
    field: 'displayInfoTitle',
    type: 'group-title',
    span: 24,
    formItemProps: {
      hideLabel: true,
    },
    props: {
      type: 'info',
    },
  },
  {
    label: '封面图',
    field: 'coverImage',
    type: 'image-upload',
    span: 12,
    required: true,
    props: {
      listType: 'picture-card',
      limit: 1,
      valueType: 'string',
      parentPath: '/venues/cover',
    },
    formItemSlots: {
      extra: '建议上传一张用于首页卡片展示的封面图',
    },
  },
  {
    label: '图集',
    field: 'gallery',
    type: 'image-upload',
    span: 12,
    props: {
      listType: 'picture-card',
      multiple: true,
      limit: 9,
      valueType: 'csv',
      parentPath: '/venues/gallery',
    },
    formItemSlots: {
      extra: '可补充多张考点实景图片，提升门户展示效果',
    },
  },
  {
    label: '状态',
    field: 'status',
    type: 'switch',
    span: 12,
    props: {
      type: 'round',
      checkedValue: 1,
      uncheckedValue: 0,
      checkedText: '启用',
      uncheckedText: '停用',
    },
  },
  {
    label: '是否推荐',
    field: 'isRecommended',
    type: 'switch',
    span: 12,
    props: {
      type: 'round',
      checkedValue: 1,
      uncheckedValue: 0,
      checkedText: '推荐',
      uncheckedText: '普通',
    },
  },
  {
    label: '排序值',
    field: 'sort',
    type: 'input-number',
    span: 12,
    props: {
      min: 0,
      mode: 'button',
    },
  },
])

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    const payload = {
      ...form,
      province: form.region?.province || form.province,
      city: form.region?.city || form.city,
    }
    delete payload.region
    delete payload.locationPicker
    if (isUpdate.value) {
      await updateVenues(payload, dataId.value)
      Message.success('修改成功')
    } else {
      await addVenues(payload)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 新增
const onAdd = async () => {
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const { data } = await getVenues(id)
  Object.assign(form, data)
  form.region = {
    province: data.province || '',
    city: data.city || '',
    provinceCode: '',
    cityCode: '',
  }
  form.locationPicker = {
    address: data.address || '',
    longitude: data.longitude || '',
    latitude: data.latitude || '',
    name: '',
  }
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
