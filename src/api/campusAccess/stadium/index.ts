import { request } from "@/utils/request";

// 场馆设施点位
export const fetchVenueFacilities = () => request.post<ApiResponseDataType<any>>("/getArenaGeom", { }, {});

// 场次总览统计
export function fetchOverviewCount() {
  return request.post<ApiResponseDataType<{ jn: number; jr: number }>>("/getArenaReserveYY", { }, {});
}

export interface IFetchVenueUsageRateResult {
  num: number;
  name: string;
  sttime: string;
  entime: string;
}
// 场馆当前使用率
export function fetchVenueUsageRate() {
  return request.post<ApiResponseDataType<IFetchVenueUsageRateResult[]>>("/getArenaReserveGroupName", { }, {});
}

// 场馆近七天预约数据
export function fetchVenueUsageRate7Days(publishname?: string) {
  return request.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getArenaReserveU7", { publishname }, {});
}

export interface IFetchSwimmingPoolOverviewResult {
  ryzs: number;
  xsyl: { name: string; value: number }[];
  rylxfb: { name: string; value: number }[];
}

// 游泳馆数据概览及人员分布
export function fetchSwimmingPoolOverview() {
  return request.post<ApiResponseDataType<IFetchSwimmingPoolOverviewResult>>("/getArenaReserveYyg", { }, {});
}

// 游泳馆近七天人数
export function fetchSwimmingPoolUsageRate7Days() {
  return request.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getArenaReserveBz", { }, {});
}
