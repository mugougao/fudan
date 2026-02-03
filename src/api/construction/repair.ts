import { CampusId, campusIdFormat } from "@/enums";
import { request } from "@/utils/request/index.ts";

// 面板数据
export function fetchRepairPanelData(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{
    zzxs: number;
    lxfb: { name: string; value: number }[];
    xqfb: { name: string; value: number }[];
    xszs: number;
  }>>("/getRepairCount", { name: campusIdFormat(campusId) });
}

// 楼宇修缮列表
export function fetchRepairList(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ count: number; name: string; lyid: string }[]>>("/getRcXsData", { xq: campusIdFormat(campusId) });
}

// 获取楼栋点位 根据 楼栋id
export function fetchBuildingPoint(id: string) {
  return request.post<ApiResponseDataType<any>>("/getBuildingPointData", { id });
}

// 楼栋正在修缮信息
export function fetchBuildingRepairingInfo(id: string) {
  return request.post<ApiResponseDataType<any>>("/getRcXsZZXSData", { lyid: id });
}

// 楼栋修缮历史信息
export function fetchBuildingRepairingHistory(id: string) {
  return request.post<ApiResponseDataType<any>>("/getRcXsLsXsList", { lyid: id });
}
