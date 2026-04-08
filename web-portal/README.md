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

- `VITE_BASE`: 项目部署基础路径，默认使用 `/`
- `VITE_API_PREFIX`: 接口基础前缀，开发环境建议 `/dev-api`
- `VITE_API_BASE_URL`: 直连后端时使用的接口基础地址
- `VITE_API_PROXY_TARGET`: 本地开发代理目标地址
- `VITE_CLIENT_ID`: 统一认证中心客户端 ID
- `VITE_TOKEN_STORAGE_KEY`: 本地 token 存储键名
- `VITE_USER_STORAGE_KEY`: 本地用户信息存储键名
- `VITE_TENANT_STORAGE_KEY`: 本地租户存储键名

## 目录规划

当前门户端目录规划已经按 `web-admin` 的分层方式重新整理，后续新增功能默认按这套规范继续扩展，不再新增兜底性质的 `modules` 目录。

```txt
web-portal/
  src/
    apis/
      auth/
      region/
      system/
      venues/
    assets/
      image/
    business/
      venues/
    components/
      layout/
      map/
    layouts/
    router/
    stores/
      modules/
    types/
    utils/
    views/
      auth/
      business/
      home/
        components/
        constants/
        hooks/
        image/
        types/
      solutions/
      system/
      venues/
        hooks/
```

## 基础路径别名

为了避免导入路径越写越乱，门户端现在统一保留两层基础别名，规则和 `web-admin` 保持一致：

- `~`
  指向项目根目录 `web-portal/`
- `@`
  指向源码根目录 `web-portal/src/`

示例：

```ts
import { useAuthStore } from '@/stores'
import http from '@/utils/http'
import AppHeader from '@/components/layout/AppHeader.vue'
import packageJson from '~/package.json'
```

使用约定：

- 跨分层、跨页面、跨业务域的导入，统一优先用 `@`
- 读取项目根目录下的配置、脚本或根级文件时，使用 `~`
- 同一个页面目录内部的组件、hooks、types、constants 之间允许继续使用相对路径
- 不允许在业务代码里出现连续很多层的 `../../../`

推荐写法：

```ts
import { getVenueList } from '@/apis/venues'
import { useAuthStore } from '@/stores'
import { useHomeVenuePage } from './hooks/useHomeVenuePage'
```

不推荐写法：

```ts
import { getVenueList } from '../../../apis/venues'
import { useAuthStore } from '../../../../stores/modules/auth'
```

## 分层说明

### `src/apis`

接口定义层，只负责和后端通信。

- 一个业务域一个目录，比如 `auth`、`venues`、`system`、`region`
- `index.ts` 放请求方法
- `type.ts` 放当前业务域的接口类型
- 这里不要夹带页面状态、格式化逻辑和业务判断

适合放在这里的代码：

- 登录、退出、获取用户信息
- 字典查询、地区查询
- 考点列表、考点详情

不适合放在这里的代码：

- 页面筛选状态
- 标签拼接、图片地址处理
- 登录态持久化

### `src/stores`

Pinia 状态仓库层，只放跨页面共享的响应式状态。

当前目录：

```txt
src/stores/
  index.ts
  modules/
    auth.ts
    index.ts
```

职责约定：

- `index.ts` 负责创建 Pinia 实例，并统一导出各个 store
- `modules/*.ts` 一个文件对应一个 store
- 只有真正需要跨页面共享、并且会响应式变化的数据，才进入 store

当前已落地的 store：

- `auth`
  负责 token、用户信息、租户信息、登录、登出、登录态恢复

后续推荐的 store 规划：

- `auth.ts`
  继续负责认证、登录态、当前用户
- `app.ts`
  如果后续门户端出现全局主题、端类型、全局弹窗状态，再新增
- `dict.ts`
  只有在多个页面反复复用并且需要缓存字典时再新增
- `region.ts`
  只有在多个页面共享地区数据缓存时再新增

判断要不要进 store 的标准：

- 跨页面共享
- 需要响应式更新
- 生命周期不止当前页面

如果只是当前页面内部使用，就不要放 store，优先放页面自己的 `hooks`

### `src/business`

业务域层，放跨页面共享的业务规则、业务常量、业务工具。

当前目录：

```txt
src/business/
  venues/
    constants.ts
    index.ts
    utils.ts
```

这层和 `utils` 的区别很重要：

- `business` 有明确业务语义
- `utils` 是全局通用工具

例如：

- 考点图片地址处理、考点标签拆分、考点字典编码常量，属于 `business/venues`
- 加密、HTTP 封装、通用日期处理，属于 `utils`

### `src/views`

页面层，每个页面自己管理自己的组件、类型、常量和 hooks。

当前推荐结构：

```txt
src/views/<page>/
  index.vue
  components/
  hooks/
  types/
  constants/
```

说明：

- `components`
  只放当前页面私有组件
- `hooks`
  只放当前页面私有状态和交互逻辑
- `types`
  只放当前页面自己的类型
- `constants`
  只放当前页面的常量配置

如果某段逻辑被多个页面共享，就从 `views` 提升到 `business`

### `src/components`

全局组件层，只放真正跨页面复用的组件。

当前已存在的公共组件：

- 布局组件
- 地图组件

判断标准：

- 多个页面公用
- 业务语义不只属于单一页面

### `src/utils`

全局通用工具层，不绑定具体业务域。

当前适合放在这里的能力：

- `http.ts`
  请求封装和统一响应处理
- `encrypt.ts`
  RSA 加密

如果一个工具函数一眼就能看出是“考点专用”“报名专用”“订单专用”，那它不该放 `utils`，应该放对应的 `business/<domain>`

### `src/types`

全局公共类型层。

这层只放跨业务、跨模块通用的类型定义，比如统一响应结构、通用分页结构、请求配置等。某个业务域自己的类型，优先放回 `apis/<domain>/type.ts` 或 `views/<page>/types`

## 当前页面落地示例

### 首页 `views/home`

```txt
src/views/home/
  index.vue
  components/
    HomeCategorySection.vue
    HomeFilterBar.vue
    HomeHeroSection.vue
    HomeRecommendSection.vue
  constants/
    index.ts
  hooks/
    useHomeVenuePage.ts
  types/
    index.ts
```

职责拆分：

- `index.vue`
  负责组装页面
- `components`
  负责首页各个展示区块
- `hooks/useHomeVenuePage.ts`
  负责首页筛选、分页、列表加载、地区联动
- `types/index.ts`
  负责首页专属类型
- `constants/index.ts`
  负责首页标签、分类等常量

### 考点详情页 `views/venues`

```txt
src/views/venues/
  detail.vue
  hooks/
    useVenueDetail.ts
```

职责拆分：

- `detail.vue`
  负责详情页展示
- `hooks/useVenueDetail.ts`
  负责详情加载、图集处理、字典文案、登录引导

## 新增功能时怎么放代码

### 1. 先判断是不是接口

如果是后端请求，放到 `src/apis/<domain>`

### 2. 再判断是不是跨页面共享状态

如果是跨页面共享并且需要响应式更新，放到 `src/stores/modules`

### 3. 再判断是不是跨页面共享业务逻辑

如果是某个业务域的共享规则、共享格式化、共享常量，放到 `src/business/<domain>`

### 4. 最后判断是不是页面私有代码

如果只服务当前页面，放回 `src/views/<page>/components|hooks|types|constants`

## 注释规范

后续代码注释统一按下面的标准执行：

- 注释要自然，别写成接口文档口吻
- 优先解释作用、边界和业务原因，不解释一眼能看懂的语法
- 关键函数要有用途说明
- 关键状态变量要说明它是干什么的
- TS 的 `interface`、`type`、类型字段也要写清楚用途
- 业务联动、默认值、缓存策略、权限控制这些地方必须写注释
- 不要滥用长篇注释，尽量一两行说清楚

推荐写法：

```ts
// 当前页筛选条件，变更后会触发列表重新请求
const filters = reactive(...)

// 省份切换后，城市选项需要跟着刷新
async function loadCityOptions() {}
```

不推荐写法：

```ts
/** 定义一个筛选条件对象 */
const filters = reactive(...)
```

## 团队约定

- 拿不准目录怎么放时，优先参考 `web-admin`
- 不再新增 `modules` 这种职责不清的目录
- 不把业务代码塞进 `utils`
- 不把页面私有状态塞进 `store`
- 不把页面私有组件提到全局 `components`
