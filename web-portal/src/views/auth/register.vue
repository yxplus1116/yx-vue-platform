<script setup lang="ts">
import BehaviorVerify from '@/components/verify/BehaviorVerify.vue'
import { useRegisterForm } from './hooks/useRegisterForm'
import AuthPanelCard from './components/AuthPanelCard.vue'

const {
  form,
  loading,
  captchaLoading,
  captchaDisabled,
  captchaButtonText,
  verifyRef,
  handleOpenBehaviorVerify,
  handleBehaviorVerifySuccess,
  handleRegister,
} = useRegisterForm()

// 行为验证码实例主要给模板 ref 和 hook 内部联动使用
void verifyRef
</script>

<template>
  <AuthPanelCard title="注册账号" description="">
    <a-form :model="form" layout="vertical" size="large">
      <a-form-item field="username" label="用户名">
        <a-input v-model="form.username" placeholder="请输入用户名" allow-clear />
      </a-form-item>
      <a-form-item field="phone" label="手机号">
        <a-input v-model="form.phone" placeholder="请输入手机号" :max-length="11" allow-clear />
      </a-form-item>
      <a-form-item field="captcha" label="短信验证码">
        <div class="auth-card__captcha">
          <a-input v-model="form.captcha" placeholder="请输入短信验证码" :max-length="6" allow-clear />
          <a-button class="auth-card__captcha-button" :loading="captchaLoading" :disabled="captchaDisabled"
            @click="handleOpenBehaviorVerify">
            {{ captchaButtonText }}
          </a-button>
        </div>
      </a-form-item>
      <a-form-item field="password" label="密码">
        <a-input-password v-model="form.password" placeholder="请输入密码" allow-clear />
      </a-form-item>
      <a-form-item class="auth-card__actions">
        <a-button type="primary" long class="auth-card__submit" :loading="loading" @click="handleRegister">
          立即注册
        </a-button>
        <a-button long class="auth-card__ghost" @click="$router.push('/auth/login')">登录</a-button>
      </a-form-item>
    </a-form>

    <BehaviorVerify ref="verifyRef" captcha-type="blockPuzzle" @success="handleBehaviorVerifySuccess" />
  </AuthPanelCard>
</template>

<style scoped lang="less">
.auth-card__captcha {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 124px;
  gap: 12px;
  width: 100%;
}

.auth-card__captcha-button {
  height: 42px;
  border-radius: 10px;
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
  .auth-card__captcha {
    grid-template-columns: 1fr;
  }

  .auth-card__captcha-button,
  .auth-card__submit,
  .auth-card__ghost {
    height: 40px;
  }
}
</style>
