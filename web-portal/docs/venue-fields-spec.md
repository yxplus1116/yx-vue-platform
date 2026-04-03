# 考点字段说明

本文档用于与后端统一“考点”实体的数据标准。  
建议后端以此为基础建立数据库表、接口 DTO 和后台维护表单。

## 目标

- 支撑门户首页考点列表展示
- 支撑考点详情页展示
- 支撑地图展示与高德导航
- 支撑后台系统的新增、编辑、发布、排序维护

## 建议表名

`venues`

## 核心字段

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | bigint / varchar | 是 | 考点主键 |
| `title` | varchar(100) | 是 | 考点名称 |
| `summary` | varchar(500) | 是 | 列表摘要，用于首页推荐卡片简介 |
| `description` | text | 是 | 详情介绍正文，建议后端按富文本或分段数组存储 |
| `province` | varchar(50) | 是 | 省份名称，用于筛选 |
| `city` | varchar(50) | 是 | 城市名称，用于筛选 |
| `address` | varchar(255) | 是 | 详细地址，用于详情页展示 |
| `longitude` | decimal(10,6) | 是 | 地图经度，用于前台地图显示与导航 |
| `latitude` | decimal(10,6) | 是 | 地图纬度，用于前台地图显示与导航 |
| `phone` | varchar(50) | 否 | 联系电话 |
| `email` | varchar(100) | 否 | 联系邮箱 |
| `room_count` | int | 是 | 考场数量 |
| `seat_count` | int | 是 | 考位数量 |
| `scene` | varchar(50) | 是 | 应用场景，例如社会考试、校园考试、企业认证、培训测评 |
| `venue_type` | varchar(50) | 是 | 考点类型，例如商业考点、公办院校、民办院校 |
| `seat_bucket` | varchar(50) | 否 | 考位区间，用于前端筛选，例如 `100以内`、`100-500`、`1000以上` |
| `status` | tinyint | 是 | 状态，建议 `1=启用`、`0=停用` |
| `sort` | int | 否 | 排序值，值越小越靠前 |
| `created_at` | datetime | 是 | 创建时间 |
| `updated_at` | datetime | 是 | 更新时间 |

## 展示扩展字段

以下字段主要服务门户前台的展示效果，建议也纳入后台维护范围。

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `tags` | json / text | 否 | 考点标签数组，例如 `["机考","纸考","公办院校"]` |
| `gallery` | json / text | 否 | 详情图集数组，建议存图片 URL 列表 |
| `cover_image` | varchar(255) | 否 | 首页列表封面图 |
| `location_text` | varchar(255) | 否 | 列表场景展示的短地址，若不传可由 `province/city/address` 拼接 |
| `is_recommended` | tinyint | 否 | 是否推荐，用于首页“优质考点推荐” |

## 前端当前使用字段映射

当前门户前台 `VenueItem` 使用到的字段含义如下：

| 前端字段 | 建议后端字段 | 说明 |
| --- | --- | --- |
| `id` | `id` | 主键 |
| `title` | `title` | 考点名称 |
| `location` | `location_text` | 列表短地址 |
| `summary` | `summary` | 列表简介 |
| `tags` | `tags` | 标签数组 |
| `roomCount` | `room_count` | 考场数量 |
| `seatCount` | `seat_count` | 考位数量 |
| `province` | `province` | 省份 |
| `city` | `city` | 城市 |
| `scene` | `scene` | 应用场景 |
| `venueType` | `venue_type` | 考点类型 |
| `seatBucket` | `seat_bucket` | 考位区间 |
| `phone` | `phone` | 联系电话 |
| `email` | `email` | 联系邮箱 |
| `address` | `address` | 详细地址 |
| `longitude` | `longitude` | 经度 |
| `latitude` | `latitude` | 纬度 |
| `description` | `description` | 详情介绍 |
| `galleryThemes` | `gallery` | 当前前台先用占位主题，后续建议替换成真实图集 URL |

## 后台维护建议

### 基础信息

- 考点名称
- 省份
- 城市
- 详细地址
- 联系电话
- 联系邮箱

### 业务信息

- 应用场景
- 考点类型
- 考场数量
- 考位数量
- 考位区间
- 推荐状态
- 启用状态
- 排序值

### 展示信息

- 摘要简介
- 详情介绍
- 标签配置
- 封面图
- 图集图片

### 地图信息

- 经纬度选点
- 地图拖拽纠偏
- 点击“打开高德地图”进行位置核验

## 接口建议

### 列表接口

`GET /venues`

建议支持筛选参数：

- `province`
- `city`
- `scene`
- `venueType`
- `seatBucket`
- `keyword`
- `page`
- `pageSize`

### 详情接口

`GET /venues/{id}`

### 新增接口

`POST /venues`

### 编辑接口

`PUT /venues/{id}`

### 状态切换接口

`PATCH /venues/{id}/status`

## 地图实现约定

门户前台地图组件当前只依赖这几个字段：

- `longitude`
- `latitude`
- `address`

只要后台把这三个字段维护准确，前台即可支持：

- 地图定位显示
- 放大查看
- 一键跳转高德地图导航

