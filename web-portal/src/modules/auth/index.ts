import { computed, ref } from 'vue'
import {
  type AccountLoginReq,
  type AuthUser,
  accountLogin,
  getUserInfo,
  logout as logoutApi,
} from '@/api'
import { TENANT_ID_KEY, TOKEN_KEY, USER_KEY } from './constants'

/** 当前会话 token。 */
const token = ref('')
/** 当前登录用户。 */
const authUser = ref<AuthUser | null>(null)
/** 当前租户 ID。 */
const tenantId = ref('')

/** 从 localStorage / sessionStorage 中读取指定值。 */
function readStorage(storageKey: string) {
  return localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey) || ''
}

/** 按是否记住我策略写入缓存。 */
function writeSessionValue(storageKey: string, value: string, remember = true) {
  const storage = remember ? localStorage : sessionStorage
  const fallbackStorage = remember ? sessionStorage : localStorage

  fallbackStorage.removeItem(storageKey)
  storage.setItem(storageKey, value)
}

/** 清除两种浏览器存储中的指定键。 */
function removeSessionValue(storageKey: string) {
  localStorage.removeItem(storageKey)
  sessionStorage.removeItem(storageKey)
}

/** 将浏览器缓存同步到响应式状态。 */
function syncStateFromStorage() {
  token.value = readStorage(TOKEN_KEY)
  tenantId.value = readStorage(TENANT_ID_KEY)

  const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!rawUser) {
    authUser.value = null
    return
  }

  try {
    authUser.value = JSON.parse(rawUser) as AuthUser
  } catch {
    removeSessionValue(USER_KEY)
    authUser.value = null
  }
}

/** 设置 token 并持久化。 */
function setToken(value: string, remember = true) {
  token.value = value
  writeSessionValue(TOKEN_KEY, value, remember)
}

/** 设置租户 ID 并持久化。 */
function setTenantId(value: string, remember = true) {
  tenantId.value = value
  writeSessionValue(TENANT_ID_KEY, value, remember)
}

/** 设置用户信息并持久化。 */
function setAuthUser(user: AuthUser | null, remember = true) {
  authUser.value = user

  if (!user) {
    removeSessionValue(USER_KEY)
    return
  }

  writeSessionValue(USER_KEY, JSON.stringify(user), remember)
}

/** 获取当前 token。 */
export function getToken() {
  return token.value
}

/** 获取当前租户 ID。 */
export function getTenantId() {
  return tenantId.value
}

/** 获取当前登录用户。 */
export function getAuthUser() {
  return authUser.value
}

/** 判断是否处于已登录状态。 */
export function isAuthenticated() {
  return Boolean(token.value)
}

/** 暴露给组件层使用的响应式认证状态。 */
export const authState = {
  /** 当前 token。 */
  token: computed(() => token.value),
  /** 当前用户。 */
  user: computed(() => authUser.value),
  /** 当前租户 ID。 */
  tenantId: computed(() => tenantId.value),
  /** 是否已认证。 */
  isAuthenticated: computed(() => Boolean(token.value)),
}

/** 执行登录并在成功后补充用户资料。 */
export async function login(payload: Omit<AccountLoginReq, 'clientId' | 'authType'>, remember = true, tenantCode?: string) {
  const response = await accountLogin({
    ...payload,
    clientId: import.meta.env.VITE_CLIENT_ID,
    authType: 'ACCOUNT',
  }, tenantCode)

  setToken(response.data.token, remember)
  setTenantId(response.data.tenantId, remember)
  await fetchCurrentUser(remember)
  return response.data
}

/** 获取当前登录用户信息。 */
export async function fetchCurrentUser(remember = true) {
  const response = await getUserInfo()
  setAuthUser(response.data, remember)
  return response.data
}

/** 清空所有本地认证状态。 */
export function clearAuthState() {
  token.value = ''
  tenantId.value = ''
  authUser.value = null
  removeSessionValue(TOKEN_KEY)
  removeSessionValue(TENANT_ID_KEY)
  removeSessionValue(USER_KEY)
}

/** 退出当前登录会话。 */
export async function logout() {
  try {
    if (token.value) {
      await logoutApi()
    }
  } finally {
    clearAuthState()
  }
}

/** 模块初始化时先同步一次浏览器缓存。 */
syncStateFromStorage()
