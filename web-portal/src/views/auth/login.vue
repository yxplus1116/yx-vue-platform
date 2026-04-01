<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/modules/auth'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
// 登录表单先走本地状态，后续接接口时可以直接映射为请求参数。
const form = reactive({
  account: '',
  password: '',
  remember: true,
})

async function handleLogin() {
  // 当前只做最基础校验，避免空值直接提交。
  if (!form.account || !form.password) {
    Message.warning('请输入账号和密码')
    return
  }

  loading.value = true

  try {
    // 本地先完成登录态闭环，后续可替换为真实登录接口。
    login({ account: form.account }, form.remember)
    Message.success('登录成功')
    // 优先回跳到守卫带过来的目标页。
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/business'
    await router.push(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-card class="auth-card" :bordered="false">
    <template #title>
      <div class="auth-card__title">
        <!-- 卡片头部承担身份入口说明和品牌提示，保持登录页识别度。 -->
        <div class="auth-card__title-copy">
          <div class="auth-card__eyebrow">
            <a-tag size="small" color="arcoblue">Account Access</a-tag>
            <span>统一身份入口</span>
          </div>
          <div class="auth-card__headline">
            <h2>登录门户</h2>
            <p>进入报名、缴费、成绩与证书等业务前，请先完成身份验证。</p>
          </div>
          <div class="auth-card__feature">
            <span>统一后端</span>
            <span>门户认证</span>
            <span>业务联动</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 表单按钮保持纵向满宽，移动端和桌面端体验一致。 -->
    <a-form :model="form" layout="vertical" size="large">
      <a-form-item field="account" label="账号">
        <a-input v-model="form.account" placeholder="请输入手机号 / 用户名" allow-clear />
      </a-form-item>
      <a-form-item field="password" label="密码">
        <a-input-password v-model="form.password" placeholder="请输入密码" allow-clear />
      </a-form-item>
      <div class="auth-card__meta">
        <a-checkbox v-model="form.remember">记住我</a-checkbox>
        <RouterLink class="auth-card__link" to="/auth/register">忘记密码？</RouterLink>
      </div>
      <a-form-item class="auth-card__actions">
        <a-button type="primary" long class="auth-card__submit" :loading="loading" @click="handleLogin">
          登录
        </a-button>
        <a-button long class="auth-card__ghost" @click="$router.push('/auth/register')">注册</a-button>
      </a-form-item>
    </a-form>

    <div class="auth-card__tips">
      <span>登录即表示你同意平台服务协议与隐私政策</span>
    </div>
  </a-card>
</template>

<style scoped>
.auth-card {
  width: min(100%, 420px);
  border-radius: 18px;
  border: 1px solid rgba(15, 35, 95, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 250, 255, 0.94));
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
}

.auth-card__title-copy {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-card__eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #829ab1;
  font-size: 12px;
}

.auth-card__headline {
  padding: 14px 16px;
  border: 1px solid rgba(15, 98, 254, 0.08);
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(15, 98, 254, 0.08), rgba(25, 169, 116, 0.05));
}

.auth-card__feature {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.auth-card__feature span {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(15, 35, 95, 0.06);
  color: #486581;
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

.auth-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0 18px;
  color: #6b7c93;
  font-size: 13px;
}

.auth-card__link {
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
</style>
