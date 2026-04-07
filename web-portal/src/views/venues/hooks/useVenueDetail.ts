import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDictOptions, type DictOption } from '@/apis/system'
import { getVenueDetail, type VenueItem } from '@/apis/venues'
import {
  VENUE_DICT_CODES,
  findDictOptionLabel,
  parseVenueCoordinate,
  resolveVenueAssetUrl,
  splitVenueText,
} from '@/business/venues'
import { useAuthStore } from '@/stores'

// 考点详情页的数据读取和展示衍生逻辑统一放这里
export function useVenueDetail() {
  // 当前详情页路由，拿考点 id 和回跳地址都要用它
  const route = useRoute()

  // 登录引导按钮会通过它跳去登录页
  const router = useRouter()

  // 联系方式展示依赖登录态，所以这里直接拿认证仓库
  const authStore = useAuthStore()

  // 当前考点 id，路由参数变化时详情会自动重拉
  const venueId = computed(() => String(route.params.id || ''))

  // 当前考点详情数据，页面主展示区都围绕它渲染
  const venue = ref<VenueItem | null>(null)

  // 当前预览区选中的主图
  const activeImage = ref('')

  // 详情请求加载状态
  const loading = ref(false)

  // 考点类型字典，用来把 code 转成展示文案
  const venueTypeOptions = ref<DictOption[]>([])

  // 应用场景字典，用来补充标签展示
  const sceneOptions = ref<DictOption[]>([])

  // 考位区间字典，用来展示考位规模文案
  const seatBucketOptions = ref<DictOption[]>([])

  // 当前用户是否已登录，决定联系方式能否明文展示
  const authed = computed(() => authStore.isAuthenticated)

  // 预览区统一吃一份图集，封面图排在最前面
  const galleryImages = computed(() => {
    const rawImages = [
      venue.value?.coverImage || '',
      ...splitVenueText(venue.value?.gallery),
    ].filter(Boolean)

    const uniqueImages = Array.from(new Set(rawImages))
    return uniqueImages.map((item) => resolveVenueAssetUrl(item)).filter(Boolean)
  })

  // 推荐标记、字典文案和后台标签统一整理成展示标签
  const displayTags = computed(() => {
    const tags: string[] = []

    if (Number(venue.value?.isRecommended) === 1) {
      tags.push('推荐考点')
    }

    const venueTypeLabel = findDictOptionLabel(venueTypeOptions.value, venue.value?.venueType)
    const sceneLabel = findDictOptionLabel(sceneOptions.value, venue.value?.scene)
    const seatBucketLabel = findDictOptionLabel(seatBucketOptions.value, venue.value?.seatBucket)

    if (venueTypeLabel) {
      tags.push(venueTypeLabel)
    }

    if (sceneLabel) {
      tags.push(sceneLabel)
    }

    if (seatBucketLabel) {
      tags.push(seatBucketLabel)
    }

    tags.push(...splitVenueText(venue.value?.tags))

    return Array.from(new Set(tags))
  })

  // 地图组件要 number，经纬度这里提前转好
  const longitude = computed(() => parseVenueCoordinate(venue.value?.longitude))
  const latitude = computed(() => parseVenueCoordinate(venue.value?.latitude))

  // 联系方式区域的提示文案，跟登录态联动
  const contactTip = computed(() => authed.value
    ? '当前已登录，可直接查看完整联系方式。'
    : '登录后才能查看完整联系电话和联系邮箱。')

  // 拉取当前考点详情
  async function loadVenueDetail() {
    if (!venueId.value) {
      venue.value = null
      return
    }

    loading.value = true

    try {
      const response = await getVenueDetail(venueId.value)
      venue.value = response.data || null
    } finally {
      loading.value = false
    }
  }

  // 详情页会用到三类字典，这里一次性并发加载
  async function loadVenueDictionaries() {
    const [venueTypeRes, sceneRes, seatBucketRes] = await Promise.all([
      getDictOptions(VENUE_DICT_CODES.venueType),
      getDictOptions(VENUE_DICT_CODES.scene),
      getDictOptions(VENUE_DICT_CODES.seatBucket),
    ])

    venueTypeOptions.value = venueTypeRes.data || []
    sceneOptions.value = sceneRes.data || []
    seatBucketOptions.value = seatBucketRes.data || []
  }

  // 未登录时跳去登录页，并保留当前详情地址用于回跳
  function goLogin() {
    router.push({
      path: '/auth/login',
      query: {
        redirect: route.fullPath,
      },
    })
  }

  // 首次进入详情页时，字典和详情数据一起准备
  async function initializeVenueDetailPage() {
    await Promise.all([
      loadVenueDictionaries(),
      loadVenueDetail(),
    ])
  }

  // 图集刷新后默认选中第一张
  watch(
    galleryImages,
    (images) => {
      activeImage.value = images[0] || ''
    },
    { immediate: true },
  )

  // 切换详情页 id 时只重拉详情数据
  watch(venueId, () => {
    void loadVenueDetail()
  })

  return {
    venue,
    activeImage,
    loading,
    authed,
    galleryImages,
    displayTags,
    longitude,
    latitude,
    contactTip,
    goLogin,
    initializeVenueDetailPage,
  }
}
