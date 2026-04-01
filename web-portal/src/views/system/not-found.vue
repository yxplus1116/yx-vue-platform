<template>
  <div class="not-found">
    <a-result status="404" subtitle="当前页面不存在，可能已经迁移到新的门户路由结构。">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="$router.push('/')">返回首页</a-button>
          <a-button @click="$router.push('/business')">前往业务中心</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}
</style>
