<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import { getImageCaptcha } from '@/apis'
import { useAuthStore } from '@/stores'
import { encryptByRsa } from '@/utils/encrypt'
import AuthPanelCard from './components/AuthPanelCard.vue'

interface CaptchaState {
  uuid: string
  image: string
  enabled: boolean
}

// 登录成功后用于页面跳转
const router = useRouter()

// 用来读取 redirect 回跳地址
const route = useRoute()

// 登录相关状态统一交给认证仓库
const authStore = useAuthStore()

// 登录按钮加载状态
const loading = ref(false)

// 验证码刷新加载状态
const captchaLoading = ref(false)

// 多租户场景下可手动输入租户编码
const tenantCode = ref('')

// 验证码显示状态，包含图片和 uuid
const captcha = reactive<CaptchaState>({
  uuid: '',
  image: '',
  enabled: true,
})

// 登录表单数据
const form = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: true,
})

// 后端有时直接返回 base64，有时只返回正文，这里统一补齐 data url
function normalizeCaptchaImage(value: string) {
  if (!value) {
    return ''
  }

  if (value.startsWith('data:image')) {
    return value
  }

  return `data:image/png;base64,${value}`
}

// 刷新验证码，同时同步是否启用验证码开关
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

// 提交登录，密码会先按后台同样的 RSA 规则加密
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
    await authStore.login({
      username: form.username,
      password: encryptByRsa(form.password) || '',
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

// 找回密码页面还没接，这里先给明确提示
function handleForgotPassword() {
  Message.info('找回密码页面待接入')
}

// 首次进入登录页就先拉一张验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <AuthPanelCard title="登录账号" description="" footer-tip="登录即表示你同意全国考点平台服务协议与隐私政策">
    <a-form :model="form" layout="vertical" size="large">
      <!-- <a-form-item field="tenantCode" label="租户编码">
        <a-input v-model="tenantCode" placeholder="多租户场景可填写租户编码，单租户可留空" allow-clear />
      </a-form-item> -->
      <a-form-item field="username" label="账号">
        <a-input v-model="form.username" placeholder="请输入手机号 / 用户名" allow-clear />
      </a-form-item>
      <a-form-item field="password" label="密码">
        <a-input-password v-model="form.password" placeholder="请输入密码" allow-clear />
      </a-form-item>
      <a-form-item v-if="captcha.enabled" field="captcha" label="验证码">
        <div class="auth-card__captcha">
          <a-input v-model="form.captcha" placeholder="请输入验证码" allow-clear />
          <button class="auth-card__captcha-trigger" type="button" :disabled="captchaLoading" @click="refreshCaptcha">
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
  </AuthPanelCard>
</template>

<style scoped lang="less">
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

@media (max-width: 480px) {
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
