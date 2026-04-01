<template>
  <div class="page-shell home-page">
    <section class="section-card home-hero">
      <div class="home-hero__content">
        <a-tag color="green" size="large">门户首页</a-tag>
        <h1 class="page-title">统一头部、统一底部、统一内容承载区已经就位</h1>
        <p class="page-subtitle">
          这套布局适合继续承接公告、服务入口、活动专题、个人中心入口和业务导航。
          路由结构已经拆成门户主布局与认证布局，后续扩展页面不会互相污染。
        </p>
        <a-space wrap size="large">
          <a-button type="primary" size="large" @click="$router.push('/business')">进入业务中心</a-button>
          <a-button size="large" @click="$router.push('/auth/login')">前往登录</a-button>
        </a-space>
      </div>

      <a-card class="home-hero__meta" :bordered="false">
        <a-statistic title="共享布局" :value="2" suffix="套" />
        <a-divider />
        <a-statistic title="初始化路由" :value="6" suffix="个" />
        <a-divider />
        <a-alert type="info" show-icon>后续增加业务页时，只需要挂到对应 layout 的 children 下。</a-alert>
      </a-card>
    </section>

    <section class="home-grid">
      <a-card class="section-card" title="推荐信息架构" :bordered="false">
        <a-space direction="vertical" fill size="large">
          <a-alert type="success" show-icon>首页聚合公告、办事入口、常用服务、精选业务。</a-alert>
          <a-alert type="warning" show-icon>认证相关页面从主门户抽离，避免头部导航和表单交叉干扰。</a-alert>
          <a-alert type="info" show-icon>业务中心适合再细分二级路由，例如报名、缴费、成绩、证书。</a-alert>
        </a-space>
      </a-card>

      <a-card class="section-card" title="下一阶段建议" :bordered="false">
        <a-timeline>
          <a-timeline-item>接入登录态与路由守卫</a-timeline-item>
          <a-timeline-item>补齐业务模块二级路由</a-timeline-item>
          <a-timeline-item>对接真实接口与菜单配置</a-timeline-item>
        </a-timeline>
      </a-card>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 360px;
  gap: 24px;
  padding: 32px;
}

.home-hero__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home-hero__meta {
  align-self: stretch;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(243, 248, 255, 0.95), rgba(255, 255, 255, 0.92));
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 960px) {
  .home-hero,
  .home-grid {
    grid-template-columns: 1fr;
  }

  .home-hero {
    padding: 24px;
  }
}
</style>
