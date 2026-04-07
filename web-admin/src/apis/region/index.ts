import type * as T from "./type";
import http from "@/utils/http";

export type * from "./type";

/** 根据父级地区编码获取下一级地区列表。 */
export const getRegionChildren = (parentCode: string) => {
  return http.get<T.RegionItem[]>(`/dashboard/region/children/${parentCode}`);
};
