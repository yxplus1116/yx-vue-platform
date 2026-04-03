<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import { getAuthUser, isAuthenticated, logout } from '@/modules/auth'

const route = useRoute()

// 设计稿里右侧是双按钮区域，这里保留同样布局，但根据登录态切换按钮语义。
const authed = computed(() => isAuthenticated())
const authUser = computed(() => getAuthUser())
const scrolled = ref(false)
const isHomePage = computed(() => route.name === 'home')
const useSolidHeader = computed(() => !isHomePage.value || scrolled.value)

// 头部默认透明吸顶，滚动后切换成浅白色渐变背景。
function handleScroll() {
  scrolled.value = window.scrollY > 12
}

async function handleLogout() {
  await logout()
  Message.success('已退出登录')
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header-wrap" :class="{ 'is-scrolled': useSolidHeader }">
    <div class="page-shell header">
      <!-- 顶部按设计稿保留“平台名称 + 右侧注册登录”结构。 -->
      <RouterLink class="header__brand" to="/">考点平台</RouterLink>

      <div class="header__actions">
        <template v-if="authed">
          <span class="header__user">你好，{{ authUser?.nickname || authUser?.username || '用户' }}</span>
          <a-button class="header__button header__button--light" @click="handleLogout">退出</a-button>
        </template>
        <template v-else>
          <a-button type="primary" class="header__button header__button--primary"
            @click="$router.push('/auth/register')">
            注册
          </a-button>
          <a-button class="header__button header__button--light" @click="$router.push('/auth/login')">
            登录
          </a-button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped lang="less">
.header-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 64px;
  background-color: rgba(255, 255, 255, 0.68);
  border-bottom: 1px solid transparent;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    backdrop-filter 0.25s ease;

  &.is-scrolled {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.94));
    border-bottom-color: rgba(44, 140, 255, 0.22);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(12px);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
  padding: 0;
}

.header__brand {
  color: #1677ff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__user {
  color: #4b5563;
  font-size: 14px;
  white-space: nowrap;
}

.header__button {
  min-width: 88px;
  height: 34px;
  border-radius: 6px;
  padding: 0 18px;
  font-size: 14px;

  &--primary {
    background: #3b82f6;
    border-color: #3b82f6;
    box-shadow: none;
  }

  &--light {
    color: #4b5563;
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(255, 255, 255, 0.92);
  }
}

@media (max-width: 900px) {
  .header-wrap {
    height: auto;
    // min-height: 72px;
  }

  .header {
    // flex-wrap: wrap;
    justify-content: space-between;
    padding: 12px 0;
  }

  .header__brand {
    font-size: 24px;
  }

  .header__actions {
    // width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
