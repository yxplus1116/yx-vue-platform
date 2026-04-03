<template>
  <div class="auth-layout">
    <div class="auth-layout__brand">
      <div class="auth-layout__brand-content">
        <a-tag color="arcoblue" size="large">考点平台</a-tag>
        <h1>聚合全国考点资源，为考试项目提供高效对接入口</h1>
        <p>
          登录后可查看优质考点、浏览考点详情、获取联系方式与地图位置，
          为考试组织、考点合作与业务拓展提供统一平台入口。
        </p>
        <a-space wrap size="large">
          <a-button type="primary" @click="$router.push('/')">返回首页</a-button>
          <!-- <a-button @click="$router.push('/business')">查看考点业务</a-button> -->
        </a-space>
      </div>
    </div>

    <div class="auth-layout__panel">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="less">
.auth-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 460px);
  background:
    radial-gradient(circle at top left, rgba(25, 118, 210, 0.12), transparent 28%),
    linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
}

.auth-layout__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 40px;
}

.auth-layout__brand-content {
  width: min(560px, 100%);
}

.auth-layout__brand-content h1 {
  margin: 20px 0 14px;
  font-size: 42px;
  line-height: 1.12;
  color: #102a43;
}

.auth-layout__brand-content p {
  margin: 0 0 28px;
  font-size: 16px;
  line-height: 1.8;
  color: #486581;
}

.auth-layout__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
}

@media (max-width: 960px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-layout__brand {
    padding: 32px 20px 12px;
  }

  .auth-layout__brand-content h1 {
    font-size: 34px;
  }

  .auth-layout__panel {
    padding: 12px 16px 24px;
  }
}

@media (max-width: 480px) {
  .auth-layout__brand {
    padding: 24px 16px 8px;
  }

  .auth-layout__brand-content h1 {
    margin: 16px 0 12px;
    font-size: 28px;
  }

  .auth-layout__brand-content p {
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.7;
  }

  .auth-layout__panel {
    padding: 10px 10px 20px;
  }
}
</style>
