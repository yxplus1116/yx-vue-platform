import { computed, reactive, ref } from 'vue'
import { getRegionChildren, type RegionItem } from '@/apis/region'
import { getDictOptions, type DictOption } from '@/apis/system'
import { getVenueList, type VenueItem } from '@/apis/venues'
import { ROOT_REGION_CODE, VENUE_DICT_CODES, VENUE_ENABLED_STATUS } from '@/business/venues'
import { HOME_CATEGORY_META, HOME_FILTER_LABELS } from '../constants'
import type {
  HomeCategoryItem,
  HomeFilterGroup,
  HomeFilterKey,
  HomeFilterOption,
  HomeFilterState,
  HomePaginationState,
} from '../types'

// 每组筛选项都补一个“全部”选项，方便用户回到默认状态
function buildDefaultOption(label: string): HomeFilterOption {
  return {
    label,
    value: '',
  }
}

// 后端字典统一转成前端筛选组件需要的结构
function mapDictOptions(list: DictOption[]) {
  return list.map((item) => ({
    label: item.label,
    value: String(item.value),
  }))
}

// 地区接口返回的是行政区数据，这里统一转成筛选项
function mapRegionOptions(list: RegionItem[]) {
  return list.map((item) => ({
    label: item.fullname || item.name,
    value: item.fullname || item.name,
    code: item.code,
  }))
}

// 首页考点页的查询、筛选、分页状态都收在这个 hook 里
export function useHomeVenuePage() {
  // 首页查询条件，搜索栏和筛选栏都会改这里
  const filters = reactive<HomeFilterState>({
    title: '',
    province: '',
    provinceCode: '',
    city: '',
    cityCode: '',
    scene: '',
    venueType: '',
    seatBucket: '',
  })

  // 列表分页状态，和后端分页参数保持一一对应
  const pagination = reactive<HomePaginationState>({
    current: 1,
    pageSize: 9,
    total: 0,
  })

  // 首页推荐区实际展示的考点列表
  const recommendItems = ref<VenueItem[]>([])

  // 列表加载中状态，控制骨架屏和按钮禁用
  const loading = ref(false)

  // 省份筛选项，初始化时从地区接口加载
  const provinceOptions = ref<HomeFilterOption[]>([])

  // 城市筛选项，会跟着省份变化动态刷新
  const cityOptions = ref<HomeFilterOption[]>([])

  // 应用场景筛选项，来自字典接口
  const sceneOptions = ref<HomeFilterOption[]>([])

  // 考点类型筛选项，分类卡片和筛选栏共用这份数据
  const venueTypeOptions = ref<HomeFilterOption[]>([])

  // 考位区间筛选项，来自字典接口
  const seatBucketOptions = ref<HomeFilterOption[]>([])

  // 首页分类卡片，本质上是考点类型筛选的另一种展示形式
  const categoryItems = computed<HomeCategoryItem[]>(() =>
    venueTypeOptions.value
      .filter((item) => item.value)
      .slice(0, HOME_CATEGORY_META.length)
      .map((item, index) => ({
        label: item.label,
        value: item.value,
        subtitle: HOME_CATEGORY_META[index]?.subtitle || '查看该分类',
        theme: HOME_CATEGORY_META[index]?.theme || 'business',
        active: filters.venueType === item.value,
      })),
  )

  // 筛选栏配置，页面组件直接按这份配置渲染
  const filterGroups = computed<HomeFilterGroup[]>(() => [
    { key: 'province', label: HOME_FILTER_LABELS.province, options: provinceOptions.value },
    { key: 'city', label: HOME_FILTER_LABELS.city, options: cityOptions.value },
    { key: 'scene', label: HOME_FILTER_LABELS.scene, options: sceneOptions.value },
    { key: 'venueType', label: HOME_FILTER_LABELS.venueType, options: venueTypeOptions.value },
    { key: 'seatBucket', label: HOME_FILTER_LABELS.seatBucket, options: seatBucketOptions.value },
  ])

  // 当前选中的筛选值，方便筛选栏做受控展示
  const selectedFilterValues = computed<Record<HomeFilterKey, string>>(() => ({
    province: filters.province,
    city: filters.city,
    scene: filters.scene,
    venueType: filters.venueType,
    seatBucket: filters.seatBucket,
  }))

  // 首次进入页面时加载省份和各类字典筛选项
  async function loadBaseFilterOptions() {
    const [provinceRes, sceneRes, venueTypeRes, seatBucketRes] = await Promise.all([
      getRegionChildren(ROOT_REGION_CODE),
      getDictOptions(VENUE_DICT_CODES.scene),
      getDictOptions(VENUE_DICT_CODES.venueType),
      getDictOptions(VENUE_DICT_CODES.seatBucket),
    ])

    provinceOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.province), ...mapRegionOptions(provinceRes.data || [])]
    cityOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.city)]
    sceneOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.scene), ...mapDictOptions(sceneRes.data || [])]
    venueTypeOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.venueType), ...mapDictOptions(venueTypeRes.data || [])]
    seatBucketOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.seatBucket), ...mapDictOptions(seatBucketRes.data || [])]
  }

  // 省份切换后，城市选项跟着刷新
  async function loadCityFilterOptions() {
    if (!filters.provinceCode) {
      cityOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.city)]
      return
    }

    const { data } = await getRegionChildren(filters.provinceCode)
    cityOptions.value = [buildDefaultOption(HOME_FILTER_LABELS.city), ...mapRegionOptions(data || [])]
  }

  // 按当前筛选条件请求考点列表
  async function loadVenueList() {
    loading.value = true

    try {
      const response = await getVenueList({
        title: filters.title || undefined,
        province: filters.province || undefined,
        city: filters.city || undefined,
        status: VENUE_ENABLED_STATUS,
        scene: filters.scene || undefined,
        venueType: filters.venueType || undefined,
        seatBucket: filters.seatBucket || undefined,
        page: pagination.current,
        size: pagination.pageSize,
      })

      recommendItems.value = response.data.list || []
      pagination.total = response.data.total || 0
    } finally {
      loading.value = false
    }
  }

  // 重新查询时统一回到第一页
  async function refreshVenueList() {
    pagination.current = 1
    await loadVenueList()
  }

  // 顶部关键字搜索走同一套列表刷新逻辑
  async function handleSearch() {
    await refreshVenueList()
  }

  // 省市筛选带联动，其他筛选直接刷新列表
  async function handleFilterChange(payload: { key: HomeFilterKey, option: HomeFilterOption }) {
    const { key, option } = payload

    if (key === 'province') {
      filters.province = option.value
      filters.provinceCode = option.code || ''
      filters.city = ''
      filters.cityCode = ''
      await loadCityFilterOptions()
      await refreshVenueList()
      return
    }

    if (key === 'city') {
      filters.city = option.value
      filters.cityCode = option.code || ''
      await refreshVenueList()
      return
    }

    if (key === 'scene') {
      filters.scene = option.value
    }

    if (key === 'venueType') {
      filters.venueType = option.value
    }

    if (key === 'seatBucket') {
      filters.seatBucket = option.value
    }

    await refreshVenueList()
  }

  // 首页分类卡片点击后，实际就是切换考点类型
  async function handleCategorySelect(value: string) {
    filters.venueType = value
    await refreshVenueList()
  }

  // 分页切换时保留当前筛选条件，只变更页码
  async function handlePageChange(page: number) {
    pagination.current = page
    await loadVenueList()
  }

  // 首页初始化时先把筛选项和首屏列表一起准备好
  async function initializeHomeVenuePage() {
    await loadBaseFilterOptions()
    await loadVenueList()
  }

  return {
    filters,
    pagination,
    recommendItems,
    loading,
    categoryItems,
    filterGroups,
    selectedFilterValues,
    initializeHomeVenuePage,
    handleSearch,
    handleFilterChange,
    handleCategorySelect,
    handlePageChange,
  }
}
