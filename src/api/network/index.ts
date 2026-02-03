import { CampusId, campusIdFormat } from "@/enums";
import { request } from "@/utils/request";

export interface IFetchTopCountResult {
  offlineap: number;
  sumtx: number;
  countac: number;
  userac: number;
  sumrx: number;
  runningap: number;
  runningac: number;
}
// 页面top指标统计
export function fetchTopCount(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<IFetchTopCountResult>>(
    "/getCountAPAndAc",
    { xq: campusIdFormat(campusId) },
  );
}

export interface IFetchApAndUserAndTerminalResult {
  acnum: number;
  userac: number;
  name: string;
  apnum: number;
}
// AP、用户、终端
export function fetchApAndUserAndTerminal(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<IFetchApAndUserAndTerminalResult[]>>(
    "/getCampusLocations",
    { xq: campusIdFormat(campusId) },
  );
}

// 设备统计
export interface IFetchDeviceCountResult {
  name: string;
  value: number;
}
export function fetchDeviceCount(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<IFetchDeviceCountResult[]>>(
    "/getEquipmentTypeCount",
    { xq: campusIdFormat(campusId) },
  );
}

// 健康度统计
export interface IFetchHealthCountResult {
  name: string;
  value: number;
}
export function fetchHealthCount(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<IFetchHealthCountResult[]>>(
    "/getHealthLevel",
    { xq: campusIdFormat(campusId) },
  );
}

// SSID 统计
export interface IFetchSsidCountResult {
  is5G: number;
  ssid: { name: string; value: number }[];
}
export function fetchSsidCount(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<IFetchSsidCountResult>>(
    "/getSignalChannel",
    { xq: campusIdFormat(campusId) },
  );
}

// 用户、终端、流量
export interface IFetchUserAndTerminalAndTrafficResult {
  datetime: string;
  hours: string;
  sumtx: number;
  countac: number;
  userac: number;
  sumrx: number;
  concat: string;
}
export function fetchUserAndTerminalAndTraffic(datetime: "1" | "2") {
  return request.post<ApiResponseDataType<IFetchUserAndTerminalAndTrafficResult[]>>(
    "/getNetworkTrends",
    { datetime },
  );
}
