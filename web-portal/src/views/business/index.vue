<template>
  <div class="page-shell business-page">
    <section class="section-card business-hero">
      <div>
        <a-tag color="arcoblue">业务中心</a-tag>
        <h1 class="page-title">把核心业务能力沉淀到稳定的路由分区里</h1>
        <p class="page-subtitle">
          当前先给出门户型业务的承载样式，后面你可以把报名、订单、证书、成绩、消息等模块继续拆成二级路由。
        </p>
      </div>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :md="12" :xl="6">
          <a-card class="business-card" title="考试报名" :bordered="false">
            面向门户用户的标准入口，适合扩展时间线、状态流转和表单。
          </a-card>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-card class="business-card" title="在线缴费" :bordered="false">
            可继续接订单查询、支付结果回跳和支付凭证下载。
          </a-card>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-card class="business-card" title="成绩查询" :bordered="false">
            适合独立二级页面，并结合筛选条件和导出能力。
          </a-card>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-card class="business-card" title="证书服务" :bordered="false">
            可承接证书申领、邮寄信息维护和电子证书查看。
          </a-card>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<style scoped lang="less">
.business-page {
  display: flex;
  flex-direction: column;
}

.business-hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.business-card {
  height: 100%;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 248, 255, 0.92));
}

@media (max-width: 768px) {
  .business-hero {
    gap: 18px;
    padding: 18px;
  }

  .business-card {
    border-radius: 14px;
  }
}

@media (max-width: 480px) {
  .business-hero {
    padding: 16px;
  }
}
</style>
