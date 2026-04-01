<template>
  <div class="page-shell solutions-page">
    <section class="section-card solutions-card">
      <a-space direction="vertical" fill size="large">
        <a-tag color="orangered">解决方案</a-tag>
        <h1 class="page-title">这里适合放门户对外展示型内容</h1>
        <p class="page-subtitle">
          如果后续门户端不仅有业务办理，还有品牌介绍、服务方案、行业专题、新闻资讯，
          这类页面建议也挂在门户主布局下，继续复用统一头尾。
        </p>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-card title="活动专题" :bordered="false">承接大促、通知公告、专题运营页面。</a-card>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-card title="行业方案" :bordered="false">适合展示考试中心面向不同机构的解决方案。</a-card>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-card title="帮助中心" :bordered="false">可拓展常见问题、流程引导、文档下载。</a-card>
          </a-col>
        </a-row>
      </a-space>
    </section>
  </div>
</template>

<style scoped>
.solutions-page {
  display: flex;
  flex-direction: column;
}

.solutions-card {
  padding: 32px;
}
</style>
