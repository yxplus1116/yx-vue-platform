# 考点数据库表字段说明

本文档用于直接发给后端，作为“考点管理”数据库表设计与接口字段设计的统一标准。

## 1. 业务对象

对象名称：`考点`

建议表名：`venues`

用途：

- 门户首页考点列表展示
- 门户首页筛选查询
- 考点详情页展示
- 地图定位与高德导航
- 后台管理系统的新增、编辑、启停、推荐、排序维护

## 2. 建表建议

建议采用“主表 + 扩展 JSON/子表”两种方式之一：

1. 简化版：单表 `venues`
适合当前一期需求，开发快，成本低。

2. 标准版：`venues` + `venue_tags` + `venue_gallery`
适合后续标签、图集、推荐位会继续扩展的场景。

当前阶段建议先用单表 `venues` 落地，优先保证后台维护效率。

## 3. 主表字段

| 字段名 | 类型建议 | 是否必填 | 默认值建议 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | bigint unsigned | 是 | 自增 | 主键 ID |
| `title` | varchar(100) | 是 | 无 | 考点名称 |
| `summary` | varchar(500) | 是 | `''` | 首页卡片摘要 |
| `description` | text | 是 | 无 | 考点详情介绍，建议存富文本 HTML 或纯文本 |
| `province` | varchar(50) | 是 | 无 | 省份名称，用于筛选 |
| `city` | varchar(50) | 是 | 无 | 城市名称，用于筛选 |
| `location_text` | varchar(255) | 否 | `''` | 列表展示短地址，不传时可由省市区地址拼接 |
| `address` | varchar(255) | 是 | 无 | 详情展示完整地址 |
| `longitude` | decimal(10,6) | 是 | 无 | 地图经度 |
| `latitude` | decimal(10,6) | 是 | 无 | 地图纬度 |
| `phone` | varchar(50) | 否 | `''` | 联系电话 |
| `email` | varchar(100) | 否 | `''` | 联系邮箱 |
| `room_count` | int unsigned | 是 | `0` | 考场数量 |
| `seat_count` | int unsigned | 是 | `0` | 考位数量 |
| `seat_bucket` | varchar(50) | 否 | `''` | 考位区间，例如 `100以内`、`100-500`、`1000以上` |
| `scene` | varchar(50) | 是 | 无 | 应用场景 |
| `venue_type` | varchar(50) | 是 | 无 | 考点类型 |
| `tags` | json | 否 | `[]` | 标签数组，例如 `["机考","纸考","公办院校"]` |
| `cover_image` | varchar(255) | 否 | `''` | 首页封面图 |
| `gallery` | json | 否 | `[]` | 详情图集数组，建议直接存图片 URL 数组 |
| `status` | tinyint(1) | 是 | `1` | 启用状态，`1=启用`，`0=停用` |
| `is_recommended` | tinyint(1) | 是 | `0` | 是否首页推荐，`1=推荐`，`0=不推荐` |
| `sort` | int | 是 | `0` | 排序值，越小越靠前 |
| `created_by` | bigint unsigned | 否 | `null` | 创建人 ID |
| `updated_by` | bigint unsigned | 否 | `null` | 更新人 ID |
| `created_at` | datetime | 是 | current_timestamp | 创建时间 |
| `updated_at` | datetime | 是 | current_timestamp | 更新时间 |
| `deleted_at` | datetime | 否 | `null` | 软删除时间，如果不用软删可不加 |

## 4. 字段含义补充

### 4.1 `scene`

用于首页筛选“全部应用场景”。

建议一期先按字符串存储，常见值：

- `社会考试`
- `校园考试`
- `企业认证`
- `培训测评`

如果后续场景需要后台可配置，再拆成字典表。

### 4.2 `venue_type`

用于首页筛选“全部考点类型”。

建议一期先按字符串存储，常见值：

- `商业考点`
- `公办院校`
- `民办院校`

### 4.3 `tags`

用于首页卡片和详情页顶部标签展示。

建议直接存 JSON 数组，例如：

```json
["机考", "纸考", "公办院校"]
```

### 4.4 `gallery`

用于详情页主图和缩略图展示。

建议直接存 JSON 数组，例如：

```json
[
  "https://xxx.com/venue/1.jpg",
  "https://xxx.com/venue/2.jpg",
  "https://xxx.com/venue/3.jpg"
]
```

### 4.5 `longitude` / `latitude`

这两个字段是地图功能的核心字段。

前台当前依赖这两个字段实现：

- 地图定位展示
- marker 点位展示
- 跳转高德地图导航

后台后续建议支持“地图选点后自动回填经纬度”。

## 5. 索引建议

建议至少增加以下索引：

| 索引名 | 字段 | 用途 |
| --- | --- | --- |
| `idx_venues_status_sort` | `status, sort` | 列表展示排序 |
| `idx_venues_recommended_status` | `is_recommended, status` | 首页推荐列表 |
| `idx_venues_province_city` | `province, city` | 地区筛选 |
| `idx_venues_scene` | `scene` | 场景筛选 |
| `idx_venues_venue_type` | `venue_type` | 类型筛选 |

如果后续搜索要支持名称关键字，建议补全文索引或 ES 检索，不建议一开始就堆复杂模糊索引。

## 6. 字段与前端映射关系

| 数据库字段 | 前端字段 | 页面用途 |
| --- | --- | --- |
| `id` | `id` | 列表跳详情 |
| `title` | `title` | 列表标题、详情标题 |
| `summary` | `summary` | 首页卡片摘要 |
| `location_text` | `location` | 首页卡片地址 |
| `tags` | `tags` | 卡片标签、详情标签 |
| `room_count` | `roomCount` | 详情规模、列表指标 |
| `seat_count` | `seatCount` | 详情规模、列表指标 |
| `province` | `province` | 首页筛选 |
| `city` | `city` | 首页筛选 |
| `scene` | `scene` | 首页筛选 |
| `venue_type` | `venueType` | 首页筛选 |
| `seat_bucket` | `seatBucket` | 首页筛选 |
| `phone` | `phone` | 详情联系方式 |
| `email` | `email` | 详情联系方式 |
| `address` | `address` | 详情地址 |
| `longitude` | `longitude` | 地图定位 |
| `latitude` | `latitude` | 地图定位 |
| `description` | `description` | 详情介绍 |
| `gallery` | `gallery` | 详情图集 |
| `cover_image` | `coverImage` | 首页封面图 |

## 7. 建表 SQL 示例

下面给后端一个 MySQL 方向的参考示例：

```sql
CREATE TABLE `venues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '考点名称',
  `summary` varchar(500) NOT NULL DEFAULT '' COMMENT '首页卡片摘要',
  `description` text NOT NULL COMMENT '详情介绍',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `location_text` varchar(255) NOT NULL DEFAULT '' COMMENT '列表短地址',
  `address` varchar(255) NOT NULL COMMENT '详细地址',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `phone` varchar(50) NOT NULL DEFAULT '' COMMENT '联系电话',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT '联系邮箱',
  `room_count` int unsigned NOT NULL DEFAULT 0 COMMENT '考场数量',
  `seat_count` int unsigned NOT NULL DEFAULT 0 COMMENT '考位数量',
  `seat_bucket` varchar(50) NOT NULL DEFAULT '' COMMENT '考位区间',
  `scene` varchar(50) NOT NULL COMMENT '应用场景',
  `venue_type` varchar(50) NOT NULL COMMENT '考点类型',
  `tags` json DEFAULT NULL COMMENT '标签数组',
  `cover_image` varchar(255) NOT NULL DEFAULT '' COMMENT '封面图',
  `gallery` json DEFAULT NULL COMMENT '图集数组',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态:1启用 0停用',
  `is_recommended` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否推荐',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序值',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_venues_status_sort` (`status`, `sort`),
  KEY `idx_venues_recommended_status` (`is_recommended`, `status`),
  KEY `idx_venues_province_city` (`province`, `city`),
  KEY `idx_venues_scene` (`scene`),
  KEY `idx_venues_venue_type` (`venue_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考点表';
```

## 8. 后台维护表单建议

后台“考点管理-新增/编辑”建议分成这几块：

### 基础信息

- 考点名称
- 省份
- 城市
- 列表短地址
- 详细地址

### 联系方式

- 联系电话
- 联系邮箱

### 业务信息

- 应用场景
- 考点类型
- 考场数量
- 考位数量
- 考位区间

### 展示信息

- 摘要简介
- 详情介绍
- 标签数组
- 封面图
- 图集数组

### 地图信息

- 地图选点
- 经度
- 纬度

### 运营信息

- 是否推荐
- 启用状态
- 排序值

## 9. 一期后端实现建议

一期建议后端先保证以下能力即可：

- 考点列表分页查询
- 按省份、城市、场景、考点类型、考位区间筛选
- 查询考点详情
- 新增/编辑考点
- 状态启停
- 首页推荐位查询

这样就足够支撑门户端与后台端并行开发。

