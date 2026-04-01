<template>
  <div class="auth-layout">
    <div class="auth-layout__brand">
      <div class="auth-layout__brand-content">
        <a-tag color="arcoblue" size="large">PC Portal</a-tag>
        <h1>为门户端预留清晰、稳定的认证入口</h1>
        <p>
          登录、注册、找回密码等认证流程都可以继续挂在这套布局下，
          与门户业务页保持解耦。
        </p>
        <a-space wrap size="large">
          <a-button type="primary" @click="$router.push('/')">返回首页</a-button>
          <a-button @click="$router.push('/business')">查看业务中心</a-button>
        </a-space>
      </div>
    </div>

    <div class="auth-layout__panel">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
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
</style>
