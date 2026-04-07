# web-admin 组件说明文档

## 说明

- 整理范围：`web-admin/src/components`
- 组件清单基于：`web-admin/src/types/components.d.ts`
- 文档重点：
  - 组件用途
  - 适用场景
  - 当前源码中显式声明的 `props`
  - 事件、插槽、`ref` 暴露方法
- 特别说明：
  - `GiForm`、`GiTable` 这类包装组件除了自定义 `props`，还会透传一部分 Arco 组件能力，文档里会单独标出来。
  - 个别组件存在“声明了 `props`，但当前版本代码里没有真正用到”的情况，文档里会备注，方便你后续二次封装或修正。

## 一、基础展示类

### Avatar

- 用途：统一展示用户头像，优先显示图片，其次回退为姓名/文本缩写，再回退为默认头像。
- 场景：用户列表、详情页、导航栏个人信息、评论列表。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `src` | `string` | - | 头像图片地址，有值时优先展示图片。 |
| `name` | `string` | - | 姓名，图片不存在时用于生成文字头像。 |
| `text` | `string` | - | 当没有 `name` 时展示的备用文本。 |
| `color` | `string` | `#168CFF` | 预留头像背景色。当前实现里实际颜色是根据 `name/text` 哈希计算，`color` 没有真正参与渲染。 |
| `size` | `string \| number` | `20` | 头像尺寸。 |
| `alt` | `string` | `avatar` | 图片 `alt` 文案。 |
| `trigger` | `boolean` | `false` | 是否启用头像触发角标。 |

- 插槽：
  - `trigger-icon`：当 `trigger=true` 时，自定义头像右下角触发图标。

### CellCopy

- 用途：把一段文本以“单行省略 + 复制按钮”的形式展示出来。
- 场景：表格单元格里的编号、URL、密钥、流水号。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `content` | `string` | `''` | 要展示并复制的文本内容。 |

### TextCopy

- 用途：只渲染一个复制图标，点击后复制指定值。
- 场景：配合其他文本组件使用，比如详情页字段值旁边补一个复制按钮。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `value` | `any` | - | 被复制的值，会直接写入临时 `textarea`。 |

### GiSvgIcon

- 用途：项目 SVG 精灵图图标组件。
- 场景：菜单图标、按钮图标、配置化图标渲染。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `name` | `string` | `''` | 图标名称，最终会拼成 `#icon-${name}`。 |
| `color` | `string` | `''` | 图标颜色，同时作用于 `color` 和 `fill`。 |
| `size` | `string \| number` | `20` | 图标宽高，数字会自动补 `px`。 |

### GiIconBox

- 用途：给图标包一层统一背景容器。
- 场景：卡片图标、统计模块入口、菜单辅助图标。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `color` | `'primary' \| 'success' \| 'warning' \| 'danger' \| string` | `#165DFF` | 背景色，可传预设状态色，也可传自定义颜色值。 |
| `size` | `number` | `20` | 容器宽高。 |
| `shape` | `'square' \| 'round'` | `square` | 容器形状，方形或圆形。 |

### GiDot

- 用途：小圆点状态标识。
- 场景：在线状态、消息未读状态、任务运行状态。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `animation` | `boolean` | `true` | 是否开启闪动/呼吸动画。 |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `primary` | 圆点颜色类型。 |

### GiTag

- 用途：轻量状态标签，支持语义色和自定义色。
- 场景：状态展示、分类标签、可关闭标签。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `type` | `'dark' \| 'light' \| 'outline' \| 'light-outline'` | `light` | 标签风格。 |
| `status` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `primary` | 语义状态色。 |
| `color` | `BaseColor \| string` | `''` | 自定义颜色，支持内置色名或十六进制色值。 |
| `size` | `'mini' \| 'small' \| 'large'` | `small` | 标签尺寸。 |
| `closable` | `boolean` | `false` | 是否显示关闭按钮。 |

- 事件：
  - `click`：点击标签触发。
  - `close`：点击关闭按钮触发。

### GiSpace

- 用途：比原生 `a-space` 更轻量的布局间距容器。
- 场景：按钮组、筛选项、卡片内横向/纵向排布。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `size` | `number \| [number, number] \| 'mini' \| 'small' \| 'medium' \| 'large'` | `small` | 间距大小。数组格式分别表示列间距、行间距。 |
| `direction` | `'horizontal' \| 'vertical'` | `horizontal` | 布局方向。 |
| `justify` | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `start` | 主轴对齐方式。 |
| `align` | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | `center` | 交叉轴对齐方式。 |
| `wrap` | `boolean` | `true` | 是否允许换行。 |
| `fill` | `boolean` | `false` | 是否拉伸为整行宽度。 |

### GiCodeView

- 用途：只读代码查看器，内部基于 `vue-codemirror6`。
- 场景：代码示例展示、脚本配置预览、JSON/JS 代码查看。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `type` | `'javascript' \| 'vue'` | `javascript` | 代码高亮语言。 |
| `codeJson` | `string` | `''` | 要展示的代码内容。 |

### JsonPretty

- 用途：格式化 JSON 展示，并带一键复制。
- 场景：接口响应查看、配置预览、日志详情。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `json` | `string` | - | JSON 字符串，组件内部会 `JSON.parse` 后渲染。 |

- 注意：
  - `json` 必须是合法 JSON 字符串，否则会在解析时报错。

### Chart

- 用途：统一包装 `vue-echarts`，并预注册了 `china` / `world` 地图。
- 场景：统计图表、地图分布图、仪表盘类页面。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `option` | `object` | `{}` | ECharts 配置对象。 |
| `autoResize` | `boolean` | `true` | 容器尺寸变化时是否自动重绘。 |
| `width` | `string` | `100%` | 图表宽度。 |
| `height` | `string` | `100%` | 图表高度。 |

- `ref` 暴露：
  - `chart`：`vue-echarts` 实例引用。

### GiThemeBtn

- 用途：深浅色主题切换按钮。
- 场景：页面头部工具栏、系统设置区。
- Props：无。

### GiFooter

- 用途：统一底部版权信息展示。
- 场景：后台整体布局底部。
- Props：无。

### 状态/工具图标组件

- `Icon403` / `Icon404` / `Icon500`
  - 用途：错误页插画。
  - 场景：异常页、无权限页、服务错误页。
  - Props：无。
- `IconBorders`
  - 用途：表格边框类工具图标。
  - 场景：表格工具栏。
  - Props：无。
- `IconTableSize`
  - 用途：表格尺寸切换图标。
  - 场景：`GiTable` 工具栏。
  - Props：无。
- `IconTreeAdd` / `IconTreeReduce`
  - 用途：树结构展开/收起类辅助图标。
  - 场景：树表、树组件、层级菜单。
  - Props：无。

## 二、布局导航类

### Breadcrumb

- 用途：根据当前路由自动生成面包屑。
- 场景：后台页面头部导航。
- Props：无显式 `props`。
- 备注：
  - 组件会把 `$attrs` 透传给内部 `a-breadcrumb-item`。
  - 面包屑数据依赖路由 `meta.title` 和 `meta.breadcrumb`。

### ParentView

- 用途：路由中转容器，内部包了一层 `keep-alive`。
- 场景：多级菜单中的父级路由占位。
- Props：无。

### GiIframe

- 用途：包装 `iframe` 并带加载中状态。
- 场景：嵌入第三方页面、外部报表、低代码页面。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `src` | `string` | `''` | `iframe` 地址。 |

### GiPageLayout

- 用途：常见后台“左侧筛选/树 + 右侧内容区”的双栏页面布局。
- 场景：组织架构页、资源管理页、左右联动管理页。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `margin` | `boolean` | `true` | 整体是否加外边距。 |
| `padding` | `boolean` | `true` | 左侧、头部、主体区域是否加内边距。 |
| `gutter` | `boolean \| number` | `false` | 栅格间距；传 `true` 时使用默认值 `14`。 |
| `defaultCollapsed` | `boolean` | `true` | 当前实现里主要用于控制折叠按钮是否显示。 |
| `leftColProps` | `ColProps` | `{}` | 左侧列栅格参数。 |
| `rightColProps` | `ColProps` | `{}` | 右侧列栅格参数。 |
| `leftStyle` | `CSSProperties` | `{}` | 左侧容器样式。 |
| `headerStyle` | `CSSProperties` | `{}` | 头部容器样式。 |
| `bodyStyle` | `CSSProperties` | `{}` | 主体容器样式。 |

- 插槽：
  - `left`：左侧区域。
  - `header`：右侧头部区域。
  - `default`：右侧主体区域。
- 备注：
  - 当前源码里折叠状态主要跟随断点变化，`defaultCollapsed` 并不会直接决定初始折叠结果。

### GiSplitButton

- 用途：左右面板折叠按钮。
- 场景：`GiSplitPane`、侧边栏开合控制。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `collapsed` | `boolean` | `false` | 当前是否折叠，用于决定显示左箭头还是右箭头。 |
| `type` | `'default' \| 'circle'` | `circle` | 按钮样式。 |

- 事件：
  - `click`：点击按钮触发。

### GiSplitPane

- 用途：简单左右分栏容器，内置左侧开合逻辑。
- 场景：左侧树/筛选区 + 右侧列表/详情区。
- Props：无。
- 插槽：
  - `left`：左侧面板。
  - `default`：右侧内容区。

### GiSplitPaneFlexibleBox

- 用途：`GiSplitPane` 的左侧弹性容器，可根据屏幕宽度自动隐藏。
- 场景：需要响应式收起左栏时单独复用。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | 是否显示内容区。 |
| `direction` | `'left' \| 'right'` | `left` | 隐藏时的收起方向。 |

- 事件：
  - `update:visible`：可见性变化时触发。

### SplitPanel

- 用途：带折叠能力的双栏面板容器。
- 场景：文件管理、目录树 + 主工作区、移动端兼容的左右布局。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `size` | `string \| number` | `20%` | 侧栏宽度/高度。 |
| `minSize` | `number` | `200` | 预留最小尺寸。 |
| `maxSize` | `number` | `800` | 预留最大尺寸。 |
| `customStyle` | `any` | - | 根节点自定义样式。 |
| `bodyStyle` | `any` | - | 预留主体样式。 |
| `allowCollapse` | `boolean` | `true` | 是否允许折叠。 |
| `collapse` | `boolean` | `false` | 初始折叠状态。 |
| `vertical` | `boolean` | `false` | 是否改成上下布局。 |
| `reverse` | `boolean` | `false` | 预留反向布局开关。 |
| `responsive` | `boolean` | `true` | 是否启用移动端响应式行为。 |

- 事件：
  - `update:collapse`：折叠状态变化时触发。
- 插槽：
  - `left`：侧栏内容。
  - `main`：主区域内容。
- 备注：
  - 当前实现支持折叠与移动端响应式，但并没有真正实现拖拽改宽。
  - `minSize`、`maxSize`、`bodyStyle`、`reverse` 在当前源码里暂未看到实际生效逻辑。

### GiOption

- 用途：选项列表容器。
- 场景：下拉操作面板、自定义菜单、气泡卡片里的操作项列表。
- Props：无。
- 插槽：
  - `default`：选项项内容，一般搭配 `GiOptionItem` 使用。

### GiOptionItem

- 用途：单个操作项，支持图标、激活态和“更多”箭头。
- 场景：菜单项、操作面板项、侧边操作入口。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `icon` | `string` | `''` | 图标名，默认用 `GiSvgIcon` 渲染。 |
| `label` | `string` | `''` | 文本标签。 |
| `more` | `boolean` | `false` | 是否显示右箭头，表示还有下一级。 |
| `active` | `boolean` | `false` | 是否高亮当前项。 |

- 事件：
  - `click`：点击当前项触发。
- 插槽：
  - `icon`：自定义图标区域。
  - `default`：自定义整项内容。

## 三、表单输入类

### DateRangePicker

- 用途：统一封装带快捷选项的时间范围选择器。
- 场景：搜索表单、报表筛选、日志查询。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `format` | `string` | `YYYY-MM-DD HH:mm:ss` | 时间格式。 |
| `showTime` | `boolean` | `true` | 是否显示时分秒选择。 |
| `placeholder` | `string[]` | `['开始时间', '结束时间']` | 起止时间占位文案。 |
| `allowClear` | `boolean` | `true` | 是否允许清空。 |

- 内置快捷项：
  - 今天、昨天、本周、本月、本年。

### GiEditor

- 用途：富文本编辑器，内部基于 `aieditor`。
- 场景：公告内容、文章正文、富文本说明字段。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 当前 HTML 内容。 |
| `placeholder` | `string` | `请输入内容` | 占位提示。 |
| `readonly` | `boolean` | `false` | 是否只读。 |
| `minHeight` | `number` | `120` | 最小高度。 |

- 事件：
  - `update:modelValue`：内容变化时回传最新 HTML。

### GiImageUpload

- 用途：统一图片上传组件，兼容单图、多图、CSV 字符串三种回填形式。
- 场景：表单图片字段、封面图、商品相册、资质图片上传。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[] \| null` | `''` | 组件绑定值。 |
| `multiple` | `boolean` | `false` | 是否多图模式。 |
| `limit` | `number` | `1` | 最大上传数量。 |
| `valueType` | `'string' \| 'array' \| 'csv'` | `string` | 提交值格式。 |
| `uploadName` | `string` | `file` | 上传文件字段名。 |
| `parentPath` | `string` | `/` | 上传到文件中心的父级目录。 |
| `accept` | `string` | `image/*` | 允许上传的文件类型。 |
| `listType` | `'text' \| 'picture' \| 'picture-card'` | `picture-card` | 文件列表展示样式。 |
| `showFileList` | `boolean` | `true` | 是否展示文件列表。 |
| `imagePreview` | `boolean` | `true` | 是否开启图片预览。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `responseUrlResolver` | `(response:any)=>string` | - | 自定义从上传响应中提取 URL 的逻辑。 |

- 事件：
  - `update:modelValue`：上传列表变化时回写值。
  - `change`：返回标准化值和当前 `fileList`。
- 插槽：
  - `upload-button`：自定义上传按钮内容。

### GiIconSelector

- 用途：选择项目 SVG 图标名称，并支持搜索、分页、复制代码片段。
- 场景：菜单管理、图标配置、低代码配置表单。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 当前选中的图标名。 |
| `enableCopy` | `boolean` | `false` | 选择图标时是否自动复制 `<icon />` 代码片段。 |

- 事件：
  - `select`：选中图标时触发。
  - `update:modelValue`：同步图标名。

### GiRegionSelect

- 用途：省市二级联动选择器，可同时回填名称和编码。
- 场景：地址表单、机构归属地、场馆所在地。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `Partial<GiRegionValue>` | `{ province:'', city:'', provinceCode:'', cityCode:'' }` | 当前省市值。 |
| `topCode` | `string` | `100000` | 顶级地区编码。 |
| `provincePlaceholder` | `string` | `请选择省份` | 省份下拉占位。 |
| `cityPlaceholder` | `string` | `请选择城市` | 城市下拉占位。 |
| `allowClear` | `boolean` | `true` | 是否允许清空。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `provinceField` | `string` | `province` | 配合 `GiForm` 回填省份字段名。 |
| `cityField` | `string` | `city` | 配合 `GiForm` 回填城市字段名。 |

- 事件：
  - `update:modelValue`
  - `change`
- 返回值结构 `GiRegionValue`：
  - `province`：省份名称
  - `city`：城市名称
  - `provinceCode`：省份编码
  - `cityCode`：城市编码

### GiMapLocationPicker

- 用途：基于高德地图的地图选点组件，可同时回填地址、经度、纬度。
- 场景：场馆位置、考点位置、门店地址、配送范围中心点设置。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `Partial<GiMapLocationValue>` | `{ address:'', longitude:'', latitude:'', name:'' }` | 当前位置信息。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `placeholder` | `string` | `请选择地图位置并自动回填经纬度` | 输入框占位提示。 |
| `addressField` | `string` | `address` | 配合 `GiForm` 回填地址字段名。 |
| `longitudeField` | `string` | `longitude` | 配合 `GiForm` 回填经度字段名。 |
| `latitudeField` | `string` | `latitude` | 配合 `GiForm` 回填纬度字段名。 |

- 事件：
  - `update:modelValue`
  - `change`
- 返回值结构 `GiMapLocationValue`：
  - `address`：地址
  - `longitude`：经度
  - `latitude`：纬度
  - `name`：地点名称
- 备注：
  - 依赖环境变量 `VITE_AMAP_KEY`，可选 `VITE_AMAP_SECURITY_JS_CODE`。

### GiForm

- 用途：配置化表单包装器，统一表单布局、搜索区、异步字典加载和复杂组件接入。
- 场景：新增/编辑表单、查询表单、动态表单。

#### 1. 组件级 Props

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `any` | - | 表单模型。 |
| `layout` | `FormInstance['layout']` | `search ? 'inline' : 'horizontal'` | 布局方式。 |
| `size` | `FormInstance['size']` | `large` | 表单尺寸。 |
| `labelColProps` | `FormInstance['labelColProps']` | - | 标签列配置。 |
| `wrapperColProps` | `FormInstance['wrapperColProps']` | - | 内容列配置。 |
| `labelAlign` | `FormInstance['labelAlign']` | - | 标签对齐方式。 |
| `disabled` | `FormInstance['disabled']` | - | 整体禁用。 |
| `rules` | `FormInstance['rules']` | - | 全局校验规则。 |
| `autoLabelWidth` | `FormInstance['autoLabelWidth']` | `true` | 是否自动计算标签宽度。 |
| `id` | `FormInstance['id']` | - | 表单 ID。 |
| `scrollToFirstError` | `FormInstance['scrollToFirstError']` | `true` | 校验失败时是否滚动到首个错误项。 |
| `columns` | `ColumnItem[]` | - | 表单项配置数组。 |
| `gridProps` | `GridProps` | - | 内部 `a-grid` 配置。 |
| `gridItemProps` | `GridItemProps` | `{ span: { xs:24, sm:8, xxl:8 } }` | 表单项栅格配置。 |
| `search` | `boolean` | `false` | 是否启用搜索表单模式。 |
| `defaultCollapsed` | `boolean` | `false` | 搜索模式下默认是否折叠。 |
| `searchBtnText` | `string` | `搜索` | 搜索按钮文案。 |
| `hideFoldBtn` | `boolean` | `false` | 是否隐藏展开/收起按钮。 |
| `suffix` | `boolean` | `true` | 是否在尾部自动渲染默认操作区。 |

#### 2. `columns[]` 配置字段

- `type`
  - 作用：定义渲染控件类型。
  - 支持值：`input`、`input-password`、`input-number`、`input-tag`、`textarea`、`select`、`tree-select`、`radio-group`、`checkbox-group`、`date-picker`、`year-picker`、`quarter-picker`、`month-picker`、`week-picker`、`time-picker`、`range-picker`、`color-picker`、`rate`、`switch`、`slider`、`cascader`、`upload`、`image-upload`、`editor`、`map-location-picker`、`region-select`、`auto-complete`、`mention`、`group-title`。
- `label`
  - 作用：表单标签，支持字符串或渲染函数。
- `field`
  - 作用：字段名，必须唯一。
- `span`
  - 作用：当前表单项栅格宽度。
- `props`
  - 作用：透传给具体控件的属性。
- `gridItemProps`
  - 作用：透传给 `a-grid-item`。
- `formItemProps`
  - 作用：透传给 `a-form-item`。
- `rules`
  - 作用：当前字段校验规则。
- `required`
  - 作用：是否必填，可传布尔值或函数 `(form)=>boolean`。
- `hide`
  - 作用：是否隐藏，可传布尔值或函数。
- `show`
  - 作用：是否显示，优先级高于 `hide`。
- `disabled`
  - 作用：是否禁用，可传布尔值或函数。
- `request`
  - 作用：异步加载选项数据的方法。
- `resultFormat`
  - 作用：对异步请求结果做格式化。
- `init`
  - 作用：是否在初始化时执行 `request`。
- `cascader`
  - 作用：声明级联依赖字段，当前字段变化后触发依赖项重新拉取数据。
- `slots`
  - 作用：组件级插槽配置。
- `formItemSlots`
  - 作用：表单项级插槽，目前支持 `help`、`extra`。

#### 3. 事件与暴露

- 事件：
  - `update:modelValue`
  - `search`
  - `reset`
- `ref` 暴露：
  - `formRef`：Arco `FormInstance`。

#### 4. 适用场景补充

- 搜索表单：配合 `search=true` 自动生成搜索/重置/折叠区。
- 动态字典表单：配合 `request + resultFormat + cascader` 实现联动下拉。
- 混合组件表单：内置支持 `GiEditor`、`GiImageUpload`、`GiRegionSelect`、`GiMapLocationPicker`。

### CronForm

- 用途：可视化编辑 Cron 表达式，并实时预览近五次执行时间。
- 场景：定时任务配置、调度中心、周期提醒设置。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `modelValue` | `string` | - | 当前 Cron 表达式。 |
| `disabled` | `boolean` | `false` | 是否禁用整个编辑器。 |
| `hideSecond` | `boolean` | `false` | 是否隐藏“秒”位。 |
| `hideYear` | `boolean` | `false` | 是否隐藏“年”位。 |
| `placeholder` | `string` | `请输入 Cron 表达式` | 直接输入表达式时的占位文案。 |
| `callback` | `(expression, timestamp, validated)=>void` | - | 预览计算完成后的回调，可拿到表达式和校验结果。 |

- 事件：
  - `change`
  - `update:modelValue`
- `ref` 暴露：
  - `checkCron()`：检查“日”和“周”是否同时为 `?`。

### CronModal

- 用途：把 `CronForm` 放进弹窗里，便于在普通表单中弹出配置。
- 场景：新增/编辑任务时单独弹窗生成 Cron。
- Props：无。
- 事件：
  - `ok`：点击确定时返回最终 Cron 表达式。
- `ref` 暴露：
  - `open(cron?: string)`：打开弹窗，并可回填现有表达式。

### Cron 子表单组件

- 这一组组件通常作为 `CronForm` 的内部构件使用，也可以独立用在更细粒度的定时配置场景。
- 通用事件：
  - `change`
  - `update:modelValue`
- 通用 Props：
  - `modelValue: string`
  - `disabled: boolean`

| 组件 | 额外 Props | 用途 | 场景 |
| --- | --- | --- | --- |
| `SecondForm` | 无 | 编辑秒位，支持每秒、区间、循环、指定值。 | 需要单独控制秒级频率。 |
| `MinuteForm` | 无 | 编辑分位，支持每分、区间、循环、指定值。 | 需要单独控制分钟频率。 |
| `HourForm` | 无 | 编辑时位，支持每时、区间、循环、指定值。 | 需要单独控制小时频率。 |
| `DayForm` | `week: string = '?'` | 编辑日位，和周位互斥。 | 按自然日执行的任务。 |
| `MonthForm` | 无 | 编辑月份位。 | 按月计划执行。 |
| `WeekForm` | `day: string = '*'` | 编辑周位，和日位互斥。 | 按星期执行的任务。 |
| `YearForm` | 无 | 编辑年份位。 | 需要限制执行年份范围的任务。 |

## 四、数据展示与选择类

### GiTable

- 用途：二次封装的表格组件，补了标题栏、工具栏、列设置、全屏等能力。
- 场景：后台绝大多数列表页。

#### 1. 扩展 Props

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 表格标题。 |
| `disabledColumnKeys` | `string[]` | `[]` | 禁止在列设置中隐藏/调整的列。 |
| `disabledTools` | `string[]` | `[]` | 禁用工具栏按钮，可选 `refresh`、`size`、`setting`、`fullscreen`。 |
| `data` | `T[]` | `[]` | 表格数据。 |
| `tableId` | `string` | - | 用于区分不同表格的列设置本地缓存键。 |

#### 2. 透传的 `a-table` Props

- 数据与结构：
  - `columns`、`rowKey`、`loading`、`rowSelection`、`expandable`、`draggable`、`columnResizable`、`rowNumber`
- 滚动与分页：
  - `scroll`、`pagination`、`pagePosition`、`stickyHeader`、`scrollbar`、`virtualListProps`、`loadMore`
- 展示样式：
  - `bordered`、`hoverable`、`stripe`、`size`、`tableLayoutFixed`、`showHeader`、`showEmptyTree`、`filterIconAlignLeft`、`hideExpandButtonOnEmpty`
- 行列行为：
  - `indentSize`、`spanMethod`、`spanAll`、`rowClass`
- 汇总与状态：
  - `summary`、`summaryText`、`summarySpanMethod`
- 受控数据：
  - `selectedKeys`、`defaultSelectedKeys`、`expandedKeys`、`defaultExpandedKeys`、`defaultExpandAllRows`

#### 3. 事件与插槽

- 事件：
  - `refresh`
  - `update:columns`
  - `change`
- 常用插槽：
  - `custom-title`
  - `top`
  - `toolbar-left`
  - `toolbar-right`
  - `toolbar-bottom`
  - 以及原生 `a-table` 的 `th`、`td`、`tr`、`expand-row`、`empty` 等插槽。
- `ref` 暴露：
  - `tableRef`
  - `resetColumns()`
  - `saveColumns()`

#### 4. 备注

- 当前源码里表格尺寸、边框、斑马纹由组件内部状态维护，外部同名 `props` 虽然在类型上声明了，但没有直接覆盖内部展示状态。

### ColumnSetting

- 用途：`GiTable` 的列显示/顺序/固定列设置面板。
- 场景：需要让用户自定义表格列展示方式时。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `columns` | `TableColumnData[]` | - | 原始列配置。 |
| `disabledKeys` | `string[]` | - | 禁止调整的列 key。 |
| `tableId` | `string` | - | 本地缓存标识。 |

- 事件：
  - `update:columns`
  - `visible-columns-change`
- `ref` 暴露：
  - `visibleColumns`
  - `resetColumns()`
  - `saveColumns()`

### GiEditTable

- 用途：可编辑表格，把单元格和 `a-form-item` 结合起来做行内编辑。
- 场景：批量录入、明细项编辑、配置列表维护。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `columns` | `ColumnItem[]` | - | 列配置。 |
| `data` | `T[]` | - | 行数据。 |
| `cellDisabled` | `boolean \| (({ row, rowIndex, col })=>boolean)` | `false` | 控制单元格是否禁用。 |

- `columns[]` 配置字段：
  - `type`：控件类型，支持 `input`、`input-number`、`input-tag`、`textarea`、`select`、`tree-select`、`radio-group`、`checkbox-group`、`date-picker`、`year-picker`、`quarter-picker`、`month-picker`、`week-picker`、`time-picker`、`range-picker`、`color-picker`、`rate`、`switch`、`slider`、`cascader`、`upload`、`auto-complete`、`mention`。
  - `title`：列表头标题。
  - `dataIndex`：字段名。
  - `required`：是否必填。
  - `rules`：校验规则。
  - `props`：透传给具体控件。
  - `columnProps`：透传给 `a-table-column`。
  - `formItemProps`：透传给 `a-form-item`。
  - `slotName`：是否改走具名插槽渲染。
- 事件：
  - `tr-dblclick`
  - `td-dblclick`
- 插槽：
  - 默认按 `dataIndex` 命名的具名插槽。
- `ref` 暴露：
  - `formRef`

### FilePreview

- 用途：统一文件预览弹窗，支持 PDF、Word、Excel。
- 场景：附件预览、合同预览、导入文件查看。
- Props：无。
- `ref` 暴露：
  - `onPreview(previewInfo)`

#### `previewInfo` 结构

- `fileInfo.data`
  - 类型：`string | Blob | ArrayBuffer`
  - 作用：预览文件本体或 URL。
- `fileInfo.fileType`
  - 类型：`string`
  - 作用：文件类型，如 `pdf`、`docx`、`xlsx`。
- `fileInfo.fileName`
  - 类型：`string`
  - 作用：弹窗标题展示名。
- `excelConfig`
  - 类型：`Partial<ExcelConfig>`
  - 作用：Excel 预览配置，如 `xls`、最小渲染行列数、宽高偏移等。

### UserSelect

- 用途：用户选择器，左侧分页列表，右侧已选结果。
- 场景：角色绑定用户、通知接收人选择、场馆管理员选择。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `true` | 是否多选。 |
| `value` | `string \| string[]` | `[]` | 初始选中用户 ID。 |
| `roleId` | `string` | - | 按角色过滤用户列表。 |

- 事件：
  - `select-user`：返回当前选中的用户 ID 数组。
- `ref` 暴露：
  - `onClearSelected()`：清空所有已选用户。

### MultipartUpload

- 用途：大文件/分片上传任务面板，支持文件、文件夹、拖拽、暂停、续传、重试。
- 场景：批量文件导入、资源中心、大附件上传。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `extraParams` | `Record<string, any>` | - | 预留额外参数。 |
| `maxConcurrentFiles` | `number` | - | 同时上传的文件数上限。 |
| `maxConcurrentChunks` | `number` | - | 单文件分片并发数上限。 |
| `maxUploadWorkers` | `number` | - | 上传 Worker 数量。 |
| `rootPath` | `string` | - | 上传根目录。 |

- 备注：
  - 当前源码里 `extraParams` 已声明，但暂未传入上传逻辑。

### GiCell 组组件

- 这一组组件主要用于列表/详情页里的“单元格格式化展示”。

#### GiCellAvatar

- 用途：头像 + 名称组合展示。
- 场景：用户列表、联系人列表。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `avatar` | `string` | `''` | 头像地址。 |
| `name` | `string` | `''` | 名称文本。 |
| `isLink` | `boolean` | `false` | 是否按链接样式展示并可点击。 |

- 事件：
  - `click`

#### GiCellGender

- 用途：把性别值格式化为标签。
- 场景：用户管理、人员详情。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `gender` | `0 \| 1 \| 2` | `1` | 性别值，`1=男`、`2=女`、`0=未知`。 |

#### GiCellStatus

- 用途：把启用/禁用状态格式化为图标 + 文案。
- 场景：状态列、详情页状态字段。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `status` | `1 \| 2` | `1` | 状态值，`1=启用`、`2=禁用`。 |

#### GiCellTag

- 用途：把字典值格式化成标签文案或语义色标签。
- 场景：字典枚举列、状态码展示、类型字段。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `dict` | `LabelValueState[] \| any[]` | `[{ label:'', value:'' }]` | 字典数组。 |
| `value` | `string \| number` | `''` | 当前值。 |

- 备注：
  - `dictItem.extra` 支持 `primary`、`success`、`warning`、`error`、`default` 这几种语义色。

#### GiCellTags

- 用途：把字符串数组渲染成多个标签，超出时自动折叠。
- 场景：角色列表、权限标签、通知方式集合。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `data` | `string[]` | `[]` | 标签数组。 |

## 五、验证码与安全校验类

### Verify

- 用途：验证码总入口组件，根据 `captchaType` 决定渲染滑块验证或点选验证。
- 场景：登录、手机号/邮箱验证码获取前的人机校验、敏感操作二次验证。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `captchaType` | `string` | - | 验证码类型，常见值为 `blockPuzzle` 或 `clickWord`。 |
| `figure` | `number` | - | 预留图形验证码参数。 |
| `arith` | `number` | - | 预留算术验证码参数。 |
| `mode` | `string` | `pop` | 展示模式，常见为弹窗式。 |
| `space` | `number` | - | 预留间距参数。 |
| `explain` | `string` | - | 验证提示文案。 |
| `imgSize` | `object` | `{ width:'310px', height:'155px' }` | 图片区域尺寸。 |
| `blockSize` | `object` | - | 滑块尺寸。 |
| `barSize` | `object` | - | 底部拖拽条尺寸。 |

- 事件：
  - `success({ captchaVerification })`
  - `error(instance)`
  - `ready(instance)`
- 通过 `ref` 可调用：
  - `show()`
  - `closeBox()`

### VerifySlide

- 用途：滑块拼图验证码内核。
- 场景：需要单独嵌入滑块验证时。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `captchaType` | `string` | - | 验证码类型。 |
| `type` | `string` | `1` | 验证类型标识，组件内部用 `2` 表示拼图模式。 |
| `mode` | `string` | `fixed` | 展示模式。 |
| `vSpace` | `number` | `5` | 图片与拖拽条间距。 |
| `explain` | `string` | `向右滑动完成验证` | 默认提示文案。 |
| `imgSize` | `object` | `{ width:'310px', height:'155px' }` | 图片区域尺寸。 |
| `blockSize` | `object` | `{ width:'50px', height:'50px' }` | 滑块尺寸。 |
| `barSize` | `object` | `{ width:'310px', height:'40px' }` | 拖拽条尺寸。 |

- 说明：
  - 验证成功后会向父组件抛出 `success({ captchaVerification })`。

### VerifyPoints

- 用途：文字点选验证码内核。
- 场景：需要单独嵌入点选验证码时。

| Prop | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `mode` | `string` | `''` | 展示模式。 |
| `captchaType` | `string` | - | 验证码类型。 |
| `vSpace` | `number` | `5` | 图片与提示条间距。 |
| `imgSize` | `object` | `{ width:'310px', height:'155px' }` | 图片区域尺寸。 |
| `barSize` | `object` | `{ width:'310px', height:'40px' }` | 底部提示条尺寸。 |

- 说明：
  - 验证成功后同样会向父组件抛出 `success({ captchaVerification })`。

## 六、辅助与其他组件

### GiTable 相关内置工具图标

- `IconBorders`
  - 用途：表格样式类图标。
  - 场景：工具栏或设置入口。
- `IconTableSize`
  - 用途：表格尺寸切换图标。
  - 场景：`GiTable` 尺寸控制。

### 错误页插画

- `Icon403`：无权限页。
- `Icon404`：页面不存在。
- `Icon500`：服务器异常。
- 以上三个组件均无 `props`，直接作为静态插画使用。

## 七、使用建议

- 如果你是做“新增/编辑/搜索表单”：
  - 优先看 `GiForm`、`GiEditor`、`GiImageUpload`、`GiRegionSelect`、`GiMapLocationPicker`、`DateRangePicker`、`CronForm`。
- 如果你是做“列表页/明细页”：
  - 优先看 `GiTable`、`GiEditTable`、`GiCell*`、`FilePreview`、`CellCopy`、`TextCopy`。
- 如果你是做“左右布局/配置面板”：
  - 优先看 `GiPageLayout`、`GiSplitPane`、`SplitPanel`、`GiOption`、`GiOptionItem`。
- 如果你是做“安全验证/登录流程”：
  - 优先看 `Verify`、`VerifySlide`、`VerifyPoints`。

