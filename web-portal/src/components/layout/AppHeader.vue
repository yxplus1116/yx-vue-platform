<script setup lang="ts">
import { computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import { useRoute } from 'vue-router'
import { getAuthUser, isAuthenticated, logout } from '@/modules/auth'

const route = useRoute()

// 顶部导航入口统一维护在这里，后续可替换为后端菜单配置。
const navItems = [
  { label: '首页', path: '/' },
  { label: '业务中心', path: '/business' },
  { label: '解决方案', path: '/solutions' },
]

const activePath = computed(() => {
  return (route.meta.navKey as string | undefined) || route.path
})

const authed = computed(() => {
  // 跟随路由变化重新计算，保证登录/退出后的头部状态及时更新。
  route.fullPath
  return isAuthenticated()
})

const authUser = computed(() => {
  // 当前轻量实现通过本地缓存恢复用户名展示。
  route.fullPath
  return getAuthUser()
})

function handleLogout() {
  logout()
  Message.success('已退出登录')
}
</script>

<template>
  <header class="header-wrap">
    <div class="page-shell header">
      <RouterLink class="header__brand" to="/">
        <span class="header__brand-mark">P</span>
        <div>
          <strong>PC Portal</strong>
          <p>统一门户前台</p>
        </div>
      </RouterLink>

      <nav class="header__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="header__nav-link"
          :class="{ 'is-active': activePath === item.path }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <template v-if="authed">
          <span class="header__welcome">你好，{{ authUser?.account || '用户' }}</span>
          <a-button type="outline" @click="$router.push('/business')">控制台</a-button>
          <a-button @click="handleLogout">退出</a-button>
        </template>
        <template v-else>
          <a-button type="text" @click="$router.push('/auth/login')">登录</a-button>
          <a-button type="primary" @click="$router.push('/auth/register')">注册</a-button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-wrap {
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  border-bottom: 1px solid rgba(15, 35, 95, 0.08);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  backdrop-filter: blur(14px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 0;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__brand strong {
  display: block;
  color: #102a43;
  font-size: 15px;
}

.header__brand p {
  margin: 2px 0 0;
  color: #829ab1;
  font-size: 12px;
}

.header__brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0f62fe, #19a974);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.header__nav-link {
  padding: 7px 12px;
  border-radius: 999px;
  color: #486581;
  font-size: 14px;
  transition: all 0.2s ease;
}

.header__nav-link.is-active,
.header__nav-link:hover {
  color: #0f62fe;
  background: rgba(15, 98, 254, 0.08);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__welcome {
  color: #486581;
  font-size: 13px;
}

@media (max-width: 900px) {
  .header {
    flex-wrap: wrap;
    padding: 12px 0;
  }

  .header__nav {
    order: 3;
    width: 100%;
  }

  .header__actions {
    margin-left: auto;
  }
}
</style>
