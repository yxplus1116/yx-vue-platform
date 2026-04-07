<script setup lang="ts">
import { onMounted } from 'vue'
import HomeCategorySection from './components/HomeCategorySection.vue'
import HomeFilterBar from './components/HomeFilterBar.vue'
import HomeHeroSection from './components/HomeHeroSection.vue'
import HomeRecommendSection from './components/HomeRecommendSection.vue'
import { useHomeVenuePage } from './hooks/useHomeVenuePage'

const {
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
} = useHomeVenuePage()

onMounted(() => {
  void initializeHomeVenuePage()
})
</script>

<template>
  <div class="home-page">
    <HomeHeroSection
      v-model:keyword="filters.title"
      :loading="loading"
      @search="handleSearch"
    >
      <HomeCategorySection :items="categoryItems" @select="handleCategorySelect" />
    </HomeHeroSection>

    <div class="page-shell home-page__body">
      <HomeFilterBar :items="filterGroups" :model-value="selectedFilterValues" @change="handleFilterChange" />
      <HomeRecommendSection
        :items="recommendItems"
        :loading="loading"
        :current="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @page-change="handlePageChange"
      />
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
