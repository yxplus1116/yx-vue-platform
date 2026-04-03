/** 考点插画主题类型。 */
export type VenueImageTheme = 'classroom' | 'campus' | 'building' | 'hall'

// 考点详情与首页列表共用的数据结构。
// 现在是静态数据，后续接接口时也建议保持同一份字段语义。
export interface VenueItem {
  // 考点主键，用于列表跳详情和详情查询。
  id: number
  // 考点名称。
  title: string
  // 列表场景下展示的简要地址。
  location: string
  // 列表摘要描述。
  summary: string
  // 考点标签，例如机考、纸考、公办院校。
  tags: string[]
  // 考场数量。
  roomCount: string
  // 考位数量。
  seatCount: string
  // 省份筛选字段。
  province: string
  // 城市筛选字段。
  city: string
  // 应用场景筛选字段。
  scene: string
  // 考点类型筛选字段。
  venueType: string
  // 考位区间筛选字段。
  seatBucket: string
  // 列表卡片默认图形主题。
  imageTheme: VenueImageTheme
  // 联系电话。
  phone: string
  // 联系邮箱。
  email: string
  // 详情页完整地址文案。
  address: string
  // 地图经度，后台后续只需维护这个字段即可驱动前台地图显示。
  longitude: number
  // 地图纬度，后台后续只需维护这个字段即可驱动前台地图显示。
  latitude: number
  // 详情页简介分段内容。
  description: string[]
  // 详情页图集展示顺序。
  galleryThemes: VenueImageTheme[]
}

// 门户首页和详情页先共用一份静态数据，后续接后端后可以统一替换为接口返回值。
export const venueItems: VenueItem[] = [
  {
    id: 1,
    title: '河北城乡建设学校',
    location: '河北省石家庄市裕华区东岗路31号碧莹大街西门',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '公办院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '河北省',
    city: '石家庄市',
    scene: '校园考试',
    venueType: '公办院校',
    seatBucket: '1000以上',
    imageTheme: 'classroom',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：河北省石家庄市裕华区东岗路31号碧莹大街西门',
    longitude: 114.51486,
    latitude: 38.042307,
    description: [
      '河北城乡建设学校考点拥有成熟的标准化考试场地和配套服务能力，可满足机考、纸笔考试以及综合测评等多种场景需求。',
      '考点整体空间规划清晰，候考区、考试区、巡考区和服务区动线独立，能够有效保障考试秩序与考生体验。',
      '场地支持多场次排考，网络和电力配置稳定，配套管理团队经验充足，适合长期合作与大规模项目落地。',
    ],
    galleryThemes: ['classroom', 'campus', 'hall', 'building'],
  },
  {
    id: 2,
    title: '河北宏教考试中心',
    location: '河北省石家庄市裕华区东岗路31号碧莹大街西门',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '公办院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '河北省',
    city: '石家庄市',
    scene: '社会考试',
    venueType: '公办院校',
    seatBucket: '1000以上',
    imageTheme: 'campus',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：河北省石家庄市裕华区东岗路31号碧莹大街西门',
    longitude: 114.522082,
    latitude: 38.045627,
    description: [
      '河北宏教考试中心具备规范的考试管理流程，场地承接能力强，能够满足大规模机考与纸考项目。',
      '考点位于城市主干道周边，交通便利，周边生活与安保配套完善，方便考生快速到达和集中疏散。',
      '中心配备稳定的网络、监控和应急电力方案，具备成熟的项目执行与现场服务经验。',
    ],
    galleryThemes: ['campus', 'hall', 'building', 'classroom'],
  },
  {
    id: 3,
    title: '瑞程标准化考试基地',
    location: '河北省石家庄市裕华区东岗路31号碧莹大街西门',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '公办院校'],
    roomCount: '40',
    seatCount: '2570',
    province: '河北省',
    city: '石家庄市',
    scene: '企业认证',
    venueType: '商业考点',
    seatBucket: '1000以上',
    imageTheme: 'building',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：湖南省长沙市长沙县星沙街道万家丽北路8号',
    longitude: 113.083839,
    latitude: 28.256773,
    description: [
      '瑞程标准化考试基地地理位置优越，周边地铁、公交与城市快速路衔接顺畅，能够为大规模考试项目提供稳定承载能力。',
      '基地拥有标准化考场、候考区、巡考区和独立服务空间，现场动线清晰，适合承接机考、纸考、综合测评等不同类型考试。',
      '考点硬件设施完善，桌椅、监控、广播、供电及网络系统稳定可靠，同时具备完善的现场组织与应急保障能力。',
      '项目团队具备丰富的考试运营经验，能够协助主办方完成排考、考生引导、考试保障和现场服务等工作。',
      '整体环境整洁规范，适合长期合作与标准化品牌项目落地，是兼顾承载能力与执行效率的优质考点。',
    ],
    galleryThemes: ['building', 'hall', 'campus', 'classroom'],
  },
  {
    id: 4,
    title: '武汉兴谷职业学院',
    location: '湖北省武汉市江夏区光谷大道66号',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '民办院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '湖北省',
    city: '武汉市',
    scene: '校园考试',
    venueType: '民办院校',
    seatBucket: '1000以上',
    imageTheme: 'campus',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：湖北省武汉市江夏区光谷大道66号',
    longitude: 114.440598,
    latitude: 30.445126,
    description: [
      '武汉兴谷职业学院考点空间宽敞，考试环境成熟，适合承接多类型教育考试与职业认证场景。',
      '考点配备规范的考务组织区与候考区，现场引导动线明确，可提升考试管理效率。',
      '周边交通与生活配套齐全，方便考生集中到场，适配常态化项目承接。',
    ],
    galleryThemes: ['campus', 'classroom', 'hall', 'building'],
  },
  {
    id: 5,
    title: '山西康庄考试中心',
    location: '山西省太原市小店区龙城大街108号',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '商业考点'],
    roomCount: '12',
    seatCount: '1300',
    province: '山西省',
    city: '太原市',
    scene: '培训测评',
    venueType: '商业考点',
    seatBucket: '1000以上',
    imageTheme: 'classroom',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：山西省太原市小店区龙城大街108号',
    longitude: 112.573456,
    latitude: 37.788884,
    description: [
      '山西康庄考试中心具备专业机考条件，考试组织流程成熟，能够满足培训测评与职业认证类项目。',
      '现场网络、电力与监控方案稳定，具备可持续承接中大型考试的条件。',
      '整体环境整洁，服务团队经验丰富，可为客户提供高效的考试执行支持。',
    ],
    galleryThemes: ['classroom', 'building', 'campus', 'hall'],
  },
  {
    id: 6,
    title: '武汉外语外事职业学院',
    location: '湖北省武汉市东湖高新区流芳路6号',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '民办院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '湖北省',
    city: '武汉市',
    scene: '校园考试',
    venueType: '民办院校',
    seatBucket: '1000以上',
    imageTheme: 'building',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：湖北省武汉市东湖高新区流芳路6号',
    longitude: 114.471149,
    latitude: 30.424654,
    description: [
      '武汉外语外事职业学院考点整体配套完善，场地灵活，可满足不同考试模式的组合承接。',
      '学校具备规范的教室环境与稳定的基础设施，是校园类考试的重要承接场地。',
      '服务团队响应迅速，能够协同完成考务执行与现场保障工作。',
    ],
    galleryThemes: ['building', 'campus', 'hall', 'classroom'],
  },
  {
    id: 7,
    title: '湖北第二师范学院',
    location: '湖北省武汉市东湖新技术开发区高新二路129号',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '公办院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '湖北省',
    city: '武汉市',
    scene: '社会考试',
    venueType: '公办院校',
    seatBucket: '1000以上',
    imageTheme: 'campus',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：湖北省武汉市东湖新技术开发区高新二路129号',
    longitude: 114.456479,
    latitude: 30.502814,
    description: [
      '湖北第二师范学院拥有良好的教学与考试空间，可稳定承接校园与社会类考试项目。',
      '考点环境规范，交通可达性高，具备多场次考试组织能力。',
      '学校配套资源完整，适合作为长期合作场地。',
    ],
    galleryThemes: ['campus', 'building', 'classroom', 'hall'],
  },
  {
    id: 8,
    title: '武汉城市学院',
    location: '湖北省武汉市洪山区白沙洲大道18号',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '民办院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '湖北省',
    city: '武汉市',
    scene: '校园考试',
    venueType: '民办院校',
    seatBucket: '1000以上',
    imageTheme: 'classroom',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：湖北省武汉市洪山区白沙洲大道18号',
    longitude: 114.304569,
    latitude: 30.498776,
    description: [
      '武汉城市学院考点具备成熟的教学楼与机考教室资源，适合教育考试和职业能力测评等项目。',
      '场地组织清晰，配套管理规范，能够支持多场次并发承接。',
      '周边交通便利，适合考生大规模集中到场。',
    ],
    galleryThemes: ['classroom', 'campus', 'building', 'hall'],
  },
  {
    id: 9,
    title: '贵州华泽无纸化考试中心',
    location: '贵州省贵阳市观山湖区林城西路118号',
    summary: '交通便利，商业配套设施齐全，拥有专业考试的硬件及软件环境，组织的考试任务大部分是国考承接。',
    tags: ['机考', '纸考', '办公院校'],
    roomCount: '12',
    seatCount: '1300',
    province: '贵州省',
    city: '贵阳市',
    scene: '企业认证',
    venueType: '商业考点',
    seatBucket: '1000以上',
    imageTheme: 'building',
    phone: '18******29',
    email: '23******14@QQ.COM',
    address: '详细地址：贵州省贵阳市观山湖区林城西路118号',
    longitude: 106.630153,
    latitude: 26.647661,
    description: [
      '贵州华泽无纸化考试中心聚焦机考场景，硬件设施稳定，适合职业认证与企业评测项目。',
      '中心具备规范的考务执行流程和完善的应急预案，能够保障项目顺利推进。',
      '现场服务经验成熟，适合标准化项目复制与长期合作。',
    ],
    galleryThemes: ['building', 'hall', 'classroom', 'campus'],
  },
]

// 根据考点 id 读取详情数据，供详情页和后续接口封装复用。
/** 根据考点 ID 获取单个考点详情。 */
export const getVenueById = (id: number) => venueItems.find((item) => item.id === id)
