<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import { getImageCaptcha } from '@/api'
import { login } from '@/modules/auth'

interface CaptchaState {
  uuid: string
  image: string
  enabled: boolean
}

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const captchaLoading = ref(false)
const tenantCode = ref('')
const captcha = reactive<CaptchaState>({
  uuid: '',
  image: '',
  enabled: true,
})
const form = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: true,
})

function normalizeCaptchaImage(value: string) {
  if (!value) {
    return ''
  }

  if (value.startsWith('data:image')) {
    return value
  }

  return `data:image/png;base64,${value}`
}

async function refreshCaptcha() {
  captchaLoading.value = true

  try {
    const response = await getImageCaptcha()
    captcha.uuid = response.data.uuid
    captcha.enabled = response.data.isEnabled
    captcha.image = normalizeCaptchaImage(response.data.img)

    if (!response.data.isEnabled) {
      form.captcha = ''
    }
  } finally {
    captchaLoading.value = false
  }
}

async function handleLogin() {
  if (!form.username || !form.password) {
    Message.warning('请输入账号和密码')
    return
  }

  if (captcha.enabled && !form.captcha) {
    Message.warning('请输入验证码')
    return
  }

  loading.value = true

  try {
    await login({
      username: form.username,
      password: form.password,
      captcha: form.captcha,
      uuid: captcha.uuid,
    }, form.remember, tenantCode.value || undefined)

    Message.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch {
    if (captcha.enabled) {
      form.captcha = ''
      await refreshCaptcha()
    }
  } finally {
    loading.value = false
  }
}

function handleForgotPassword() {
  Message.info('找回密码页面待接入')
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <a-card class="auth-card" :bordered="false">
    <template #title>
      <div class="auth-card__title">
        <div class="auth-card__title-copy">
          <h2>登录账号</h2>
          <p>门户端已对齐后台统一认证中心，请使用同一套账号体系登录。</p>
        </div>
      </div>
    </template>

    <a-form :model="form" layout="vertical" size="large">
      <a-form-item field="tenantCode" label="租户编码">
        <a-input v-model="tenantCode" placeholder="多租户场景可填写租户编码，单租户可留空" allow-clear />
      </a-form-item>
      <a-form-item field="username" label="账号">
        <a-input v-model="form.username" placeholder="请输入手机号 / 用户名" allow-clear />
      </a-form-item>
      <a-form-item field="password" label="密码">
        <a-input-password v-model="form.password" placeholder="请输入密码" allow-clear />
      </a-form-item>
      <a-form-item v-if="captcha.enabled" field="captcha" label="验证码">
        <div class="auth-card__captcha">
          <a-input v-model="form.captcha" placeholder="请输入验证码" allow-clear />
          <button
            class="auth-card__captcha-trigger"
            type="button"
            :disabled="captchaLoading"
            @click="refreshCaptcha"
          >
            <img v-if="captcha.image" :src="captcha.image" alt="验证码" />
            <span v-else>{{ captchaLoading ? '加载中...' : '点击刷新' }}</span>
          </button>
        </div>
      </a-form-item>
      <div class="auth-card__meta">
        <a-checkbox v-model="form.remember">记住我</a-checkbox>
        <a-button type="text" class="auth-card__link-button" @click="handleForgotPassword">忘记密码？</a-button>
      </div>
      <a-form-item class="auth-card__actions">
        <a-button type="primary" long class="auth-card__submit" :loading="loading" @click="handleLogin">
          登录
        </a-button>
        <a-button long class="auth-card__ghost" @click="$router.push('/auth/register')">注册</a-button>
      </a-form-item>
    </a-form>

    <div class="auth-card__tips">
      <span>登录即表示你同意全国考点平台服务协议与隐私政策</span>
    </div>
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

.auth-card__captcha {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 124px;
  gap: 12px;
  width: 100%;
}

.auth-card__captcha-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba(15, 35, 95, 0.12);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  img {
    display: block;
    width: 100%;
    height: 40px;
    object-fit: cover;
  }

  span {
    color: #6b7c93;
    font-size: 12px;
  }
}

.auth-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0 18px;
  color: #6b7c93;
  font-size: 13px;
}

.auth-card__link-button {
  padding: 0;
  color: #0f62fe;
}

.auth-card__submit {
  height: 42px;
  border-radius: 10px;
}

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

.auth-card__tips {
  margin-top: 4px;
  color: #97a6ba;
  font-size: 12px;
  line-height: 1.6;
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

  .auth-card__captcha {
    grid-template-columns: 1fr;
  }

  .auth-card__meta {
    align-items: flex-start;
    gap: 8px;
    flex-direction: column;
  }

  .auth-card__submit,
  .auth-card__ghost {
    height: 40px;
  }
}
</style>
