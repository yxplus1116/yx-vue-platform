<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  createDefaultVenueFilters,
  getVenueList,
  venueCategoryItems,
  venueFilterGroups,
  type VenueCategoryItem,
  type VenueItem,
} from '@/api'
import HomeCategorySection from './modules/HomeCategorySection.vue'
import HomeFilterBar from './modules/HomeFilterBar.vue'
import HomeHeroSection from './modules/HomeHeroSection.vue'
import HomeRecommendSection from './modules/HomeRecommendSection.vue'
import type { FilterItem } from './modules/HomeFilterBar.vue'

/** 首页分类卡片数据。 */
const categoryItems = venueCategoryItems as VenueCategoryItem[]
/** 首页筛选项配置。 */
const filterGroups = venueFilterGroups as FilterItem[]
/** 当前已选择的筛选条件。 */
const selectedFilters = ref<Record<string, string>>(createDefaultVenueFilters())
/** 当前首页推荐考点列表。 */
const recommendItems = ref<VenueItem[]>([])
/** 当前列表加载状态。 */
const loading = ref(false)

/** 统一给推荐区组件提供列表数据。 */
const filteredRecommendItems = computed(() => recommendItems.value)

/** 根据筛选条件加载考点列表。 */
async function loadVenueList() {
  loading.value = true

  try {
    const response = await getVenueList(selectedFilters.value)
    recommendItems.value = response.data.list
  } finally {
    loading.value = false
  }
}

/** 接收筛选变更并刷新列表。 */
async function handleFilterChange(values: Record<string, string>) {
  selectedFilters.value = values
  await loadVenueList()
}

/** 页面首次进入时加载默认考点列表。 */
onMounted(() => {
  loadVenueList()
})
</script>

<template>
  <div class="home-page">
    <HomeHeroSection>
      <HomeCategorySection :items="categoryItems" />
    </HomeHeroSection>

    <div class="page-shell home-page__body">
      <HomeFilterBar :items="filterGroups" @change="handleFilterChange" />
      <HomeRecommendSection :items="filteredRecommendItems" :loading="loading" />
    </div>
  </div>
</template>

<style scoped lang="less">
.home-page {
  display: flex;
  flex-direction: column;
}

.home-page__body {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-top: 18px;
  padding-bottom: 40px;
}

@media (max-width: 768px) {
  .home-page__body {
    gap: 20px;
    padding-top: 14px;
    padding-bottom: 28px;
  }
}
</style>
