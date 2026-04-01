<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="portal-layout">
    <!-- 门户主布局：头部和底部全站统一，中间内容由子路由注入。 -->
    <AppHeader />
    <main class="portal-layout__main">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.portal-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.portal-layout__main {
  flex: 1;
  padding: 20px 0 32px;
}

@media (max-width: 768px) {
  .portal-layout__main {
    padding-top: 14px;
    padding-bottom: 24px;
  }
}
</style>
