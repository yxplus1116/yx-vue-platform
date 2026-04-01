# pc-portal

基于 Vite + Vue 3 的门户端项目，已完成以下基础接入：

- Arco Design Vue
- `unplugin-vue-components` 组件按需引入
- Arco 组件样式按需加载
- 与 `web-admin` 同后端约定的 axios 初始化
- `/api` 开发代理配置

## 开发

```bash
pnpm dev
```

## 环境变量

开发环境可在 `.env.development` 中配置：

- `VITE_API_BASE_PREFIX`: 接口基础前缀，默认 `/api`
- `VITE_API_PROXY_TARGET`: 本地开发代理目标地址
- `VITE_TOKEN_STORAGE_KEY`: 本地 token 存储键名
