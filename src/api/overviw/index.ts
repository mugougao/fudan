import { CampusId, campusIdFormat } from "@/enums";
import { request } from "@/utils/request";

// 今日校园 -- 今日进校人次
export function fetchTodaySchoolInCount(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ count: number }>>(
    "/GetJxRsCount",
    { name: campusIdFormat(campusId) },
  );
}

// 今日校园 -- 校园门岗 -- 今日人流量
export function fetchTodaySchoolTraffic(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ name: string;value: number }[]>>(
    "/getCampusSupervisorHour",
    { name: campusIdFormat(campusId) },
  );
}

// 今日校园 -- 校园资产
export function fetchTodaySchoolAssets(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ jz: number; sl: number; je: number }>>(
    "/getCampusAssets",
    { xq: campusIdFormat(campusId) },
  );
}

// 今日校园 -- 能耗统计
export function fetchTodaySchoolEnergy(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ yearelectmom: number; oldyearwater: number; oldyearelect: number; yearwater: number; yearelect: number; yearwatermom: number }>>(
    "/getNhNdCount",
    { xq: campusIdFormat(campusId) },
  );
}
