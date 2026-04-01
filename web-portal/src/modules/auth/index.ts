import { TOKEN_KEY } from '@/api/http'

const USER_KEY = 'portal_user'

export interface AuthUser {
  account: string
}

export function getToken() {
  // 兼容“记住我”和会话级登录两种 token 存储方式。
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function getAuthUser(): AuthUser | null {
  // 当前只维护最小用户信息，后续接真实接口时可替换为完整用户对象。
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function login(payload: AuthUser, remember = true) {
  // 这里先用本地 token 模拟登录成功，后续可直接换成后端返回值。
  const token = `portal-token-${Date.now()}`
  const storage = remember ? localStorage : sessionStorage

  // 登录前先清理旧 token，避免本地状态不一致。
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  storage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(payload))

  return token
}

export function logout() {
  // 退出时同步清理 token 和本地缓存用户信息。
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
