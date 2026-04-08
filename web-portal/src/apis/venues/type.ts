// 考点实体字段
export interface VenueItem {
  // 考点 id
  id: string;

  // 考点标题
  title: string;

  // 卡片摘要
  summary: string;

  // 富文本详情
  description: string;

  // 所在省份
  province: string;

  // 所在城市
  city: string;

  // 列表展示位置文案
  locationText: string;

  // 详细地址
  address: string;

  // 经度
  longitude: string;

  // 纬度
  latitude: string;

  // 联系电话
  phone: string;

  // 联系邮箱
  email: string;

  // 考场数量
  roomCount: string;

  // 考位数量
  seatCount: string;

  // 考位区间编码
  seatBucket: string;

  // 应用场景编码，多个值时用英文逗号拼接
  scene: string;

  // 考点类型编码
  venueType: string;

  // 后台自定义标签，逗号分隔
  tags: string;

  // 封面图地址
  coverImage: string;

  // 图集地址，逗号分隔
  gallery: string;

  // 状态
  status: string;

  // 是否推荐
  recommended: string;

  // 排序值
  sort: string;
}

// 考点列表查询参数
export interface VenueListQuery {
  // 标题关键字
  title?: string;

  // 省份
  province?: string;

  // 城市
  city?: string;

  // 状态
  status?: string;

  // 场景编码
  scene?: string;

  // 考点类型编码
  venueType?: string;

  // 考位区间编码
  seatBucket?: string;

  // 当前页码
  page?: number;

  // 每页条数
  size?: number;
}

// 考点分页返回结果
export interface VenueListResp {
  // 当前页数据
  list: VenueItem[];

  // 总条数
  total: number;
}
