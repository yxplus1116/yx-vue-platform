# pc-portal

基于 Vite + Vue 3 的门户端项目，已完成以下基础接入：

- Arco Design Vue
- `unplugin-vue-components` 组件按需引入
- Arco 组件样式按需加载
- 与 `web-admin` 对齐的 `src/apis + src/utils/http.ts` 请求层结构
- `/dev-api` 开发代理配置
- 图形验证码登录接入预留

## 开发

```bash
pnpm dev
```

## 环境变量

开发环境可在 `.env.development` 中配置：

- `VITE_API_PREFIX`: 接口基础前缀，开发环境建议 `/dev-api`
- `VITE_API_PROXY_TARGET`: 本地开发代理目标地址
- `VITE_CLIENT_ID`: 统一认证中心客户端 ID
- `VITE_TOKEN_STORAGE_KEY`: 本地 token 存储键名
- `VITE_USER_STORAGE_KEY`: 本地用户信息存储键名
- `VITE_TENANT_STORAGE_KEY`: 本地租户存储键名
