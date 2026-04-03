<template>
  <a-card class="auth-card" :bordered="false">
    <template #title>
      <div class="auth-card__title">
        <div class="auth-card__title-copy">

          <h2>注册账号</h2>
          <p>后续可以在这里继续补短信验证码、协议确认和企业注册逻辑。</p>
        </div>
      </div>
    </template>

    <a-form layout="vertical" size="large">
      <a-form-item field="name" label="用户名">
        <a-input placeholder="请输入用户名" allow-clear />
      </a-form-item>
      <a-form-item field="mobile" label="手机号">
        <a-input placeholder="请输入手机号" allow-clear />
      </a-form-item>
      <a-form-item field="password" label="密码">
        <a-input-password placeholder="请输入密码" allow-clear />
      </a-form-item>
      <a-form-item class="auth-card__actions">
        <a-button type="primary" long class="auth-card__submit">立即注册</a-button>
        <a-button long class="auth-card__ghost" @click="$router.push('/auth/login')">登录</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style scoped lang="less">
.auth-card {
  width: min(100%, 420px);
  border-radius: 18px;
  border: 1px solid rgba(15, 35, 95, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 250, 255, 0.94));
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);

  :deep(.arco-card-header) {
    height: auto;
    min-height: unset;
    align-items: flex-start;
  }
}

.auth-card__title-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-card__eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #829ab1;
  font-size: 12px;
}

.auth-card__title h2 {
  margin: 0;
  color: #102a43;
  font-size: 26px;
}

.auth-card__title p {
  margin: 0;
  color: #6b7c93;
  line-height: 1.7;
  font-size: 14px;
}

.auth-card__submit,
.auth-card__ghost {
  height: 42px;
  border-radius: 10px;
}

.auth-card__actions :deep(.arco-form-item-content-flex) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

@media (max-width: 480px) {
  .auth-card {
    width: 100%;
    border-radius: 14px;
  }

  .auth-card__title h2 {
    font-size: 22px;
  }

  .auth-card__title p {
    font-size: 13px;
  }

  .auth-card__submit,
  .auth-card__ghost {
    height: 40px;
  }
}
</style>
