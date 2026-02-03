import { CampusId, campusIdToName } from "@/enums";
import { request } from "@/utils/request/index.ts";

export interface FetchBuildListParams {
  xq: CampusId;
  name?: string;
  type?: string;
  area?: string;
  pageNum?: string | number;
  pageSize?: string | number;
}

export interface FetchBuildResultItem {
  area: string;
  level: string;
  name: string;
  x: number;
  y: number;
  id: string;
}

// 楼宇列表
export function fetchBuildList(params: FetchBuildListParams) {
  const { xq, name, type, area, pageNum = 1, pageSize = 10 } = params || { xq: CampusId.HanDan };
  return request.post<ApiResponsePageInfoType<FetchBuildResultItem>>("/getBuildingRepairList", { xq: campusIdToName(xq), name, type, area, pageNum, pageSize });
}

// 楼宇点位列表
export function fetchBuildPoints(campusId: CampusId, params: { name?: string; area?: string; type?: string }) {
  const { name, area, type } = params || {};
  return request.post<ApiResponseDataType<FetchBuildResultItem[]>>("/getBuildingRepairList", { xq: campusIdToName(campusId), name, area, type });
}

// 楼宇查询条件选项
export function fetchBuildQueryOptions(campusId: CampusId = CampusId.HanDan) {
  return request.post<ApiResponseDataType<{ area: string[]; type: string[] }>>("/getBuildingSelectType", { xq: campusIdToName(campusId) });
}

// 楼宇点位详情
export function fetchBuildDetail(id: string) {
  return request.post<ApiResponseDataType<{
    area: string;
    level: number;
    name: string;
    xq: string;
    id: string;
    type: string;
    geom: string;
    xy: string;
  }>>("/getBuildingRepair", { id });
}

// 新增
export function addBuild(data: any) {
  return request.post<ApiResponseDataType<string>>("/addBuildingRepair", data);
}

// 修改
export function updateBuild(data: any) {
  return request.post<ApiResponseDataType<string>>("/updateBuildingRepair", data);
}

// 删除
export function deleteBuild(id: string) {
  return request.post<ApiResponseDataType<string>>("/delBuildingRepair", { id });
}
