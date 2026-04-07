import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type AccountLoginReq,
  AuthTypeConstants,
  type AuthUser,
  accountLogin,
  getUserInfo,
  logout as logoutApi,
} from '@/apis'
import pinia from '@/stores'

// token 存储键，优先走环境变量，方便不同环境隔离
const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'token'

// 用户信息存储键，页面刷新后用它恢复当前登录用户
const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'portal_user'

// 租户信息存储键，多租户场景下请求头会用到
const TENANT_ID_KEY = import.meta.env.VITE_TENANT_STORAGE_KEY || 'tenant_id'

// 从 localStorage 和 sessionStorage 里按顺序取值
function readStorage(storageKey: string) {
  return localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey) || ''
}

// remember 为 true 时走 localStorage，否则走 sessionStorage
function writeSessionValue(storageKey: string, value: string, remember = true) {
  const storage = remember ? localStorage : sessionStorage
  const fallbackStorage = remember ? sessionStorage : localStorage

  fallbackStorage.removeItem(storageKey)
  storage.setItem(storageKey, value)
}

// 同时清掉两种存储，避免记住我切换后残留脏数据
function removeSessionValue(storageKey: string) {
  localStorage.removeItem(storageKey)
  sessionStorage.removeItem(storageKey)
}

export const useAuthStore = defineStore('auth', () => {
  // 当前登录 token，请求头认证会直接使用
  const token = ref('')

  // 当前登录用户，头部问候语和用户态判断会用到
  const user = ref<AuthUser | null>(null)

  // 当前租户 id，后端多租户接口需要带在请求头里
  const tenantId = ref('')

  // 是否已登录，门户端很多显示逻辑都依赖这个值
  const isAuthenticated = computed(() => Boolean(token.value))

  // 页面刷新后先从 storage 恢复一遍状态
  function syncStateFromStorage() {
    token.value = readStorage(TOKEN_KEY)
    tenantId.value = readStorage(TENANT_ID_KEY)

    const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
    if (!rawUser) {
      user.value = null
      return
    }

    try {
      user.value = JSON.parse(rawUser) as AuthUser
    } catch {
      removeSessionValue(USER_KEY)
      user.value = null
    }
  }

  // 更新 token，并按记住我策略写入对应存储
  function setToken(value: string, remember = true) {
    token.value = value
    writeSessionValue(TOKEN_KEY, value, remember)
  }

  // 更新租户 id，并保持和 token 一样的持久化策略
  function setTenantId(value: string, remember = true) {
    tenantId.value = value
    writeSessionValue(TENANT_ID_KEY, value, remember)
  }

  // 更新当前用户信息，传 null 时表示清空登录用户
  function setAuthUser(value: AuthUser | null, remember = true) {
    user.value = value

    if (!value) {
      removeSessionValue(USER_KEY)
      return
    }

    writeSessionValue(USER_KEY, JSON.stringify(value), remember)
  }

  // 登录成功后顺手把当前用户信息也补齐
  async function login(payload: Omit<AccountLoginReq, 'clientId' | 'authType'>, remember = true, tenantCode?: string) {
    const response = await accountLogin({
      ...payload,
      clientId: import.meta.env.VITE_CLIENT_ID,
      authType: AuthTypeConstants.ACCOUNT,
    }, tenantCode)

    setToken(response.data.token, remember)
    setTenantId(response.data.tenantId, remember)
    await fetchCurrentUser(remember)

    return response.data
  }

  // 拉取当前登录用户，用在登录后初始化和页面刷新补全信息
  async function fetchCurrentUser(remember = true) {
    const response = await getUserInfo()
    setAuthUser(response.data, remember)
    return response.data
  }

  // 清理本地认证状态，通常在退出登录或 401 时调用
  function clearAuthState() {
    token.value = ''
    tenantId.value = ''
    user.value = null
    removeSessionValue(TOKEN_KEY)
    removeSessionValue(TENANT_ID_KEY)
    removeSessionValue(USER_KEY)
  }

  // 主动退出登录时先通知后端，再回收本地状态
  async function logout() {
    try {
      if (token.value) {
        await logoutApi()
      }
    } finally {
      clearAuthState()
    }
  }

  syncStateFromStorage()

  return {
    token,
    user,
    tenantId,
    isAuthenticated,
    syncStateFromStorage,
    setToken,
    setTenantId,
    setAuthUser,
    login,
    fetchCurrentUser,
    clearAuthState,
    logout,
  }
})

// 在路由守卫、请求拦截器这些 setup 外场景里取 store
export function useAuthStoreWithOut() {
  return useAuthStore(pinia)
}
