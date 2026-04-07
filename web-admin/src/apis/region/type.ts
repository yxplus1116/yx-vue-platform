/** 地区节点信息。 */
export interface RegionItem {
  /** 地区编码。 */
  code: string
  /** 当前层级地区名称。 */
  name: string
  /** 地区完整名称。 */
  fullname: string
  /** 地区层级。 */
  level: 'province' | 'city' | 'district' | string
  /** 下级地区节点列表。 */
  children: RegionItem[]
}
