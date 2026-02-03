import { CampusId, campusIdFormat } from "@/enums";
import { request } from "@/utils/request";

// 用户、终端
export interface IFetchUserAndTerminalAndTrafficResult {
  datetime: string;
  hours: string;
  sumtx: number;
  countac: number;
  userac: number;
  sumrx: number;
  concat: string;
}
export function fetchUserAndTerminal(campusId: CampusId = CampusId.Overview, datetime: "1" | "2") {
  return request.post<ApiResponseDataType<IFetchUserAndTerminalAndTrafficResult[]>>(
    "/getNetworkTrends",
    { datetime, xq: campusIdFormat(campusId) },
  );
}

// 人员分布楼宇top5
export interface IFetchUserDistributionTop5Result {
  yhs: number;
  zds: number;
  name: string;
}
export function fetchUserDistributionTop5(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<IFetchUserDistributionTop5Result[]>>(
    "/getWlBuildingTop5",
    { xq: campusIdFormat(campusId) },
  );
}

// 人员分布楼宇top5 更多
export interface IFetchUserDistributionTop5MoreResult {
  yhs: number;
  zds: number;
  name: string;
  x: string;
  y: string;
}
export function fetchUserDistributionTop5More(campusId: CampusId = CampusId.Overview, name: string = "") {
  return request.post<ApiResponseDataType<IFetchUserDistributionTop5MoreResult[]>>(
    "/getWlBuildingTop5",
    { xq: campusIdFormat(campusId), name },
  );
}

export function fetchUserDistributionTop5MoreDetails(buildId: string) {
  return request.post<ApiResponseDataType<{ name: string; value1: number; value2: number }[]>>(
    "/getTrendsBulidingData",
    { id: buildId },
  );
}

// 查询 存在网络设备的楼栋
export function fetchBuildingWithNetworkDevice(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<any>>(
    "/getWJLJPoint",
    { xq: campusIdFormat(campusId) },
  );
}

// 查询楼栋楼层列表
export function fetchBuildingFloor(buildIngId: string) {
  return request.post<ApiResponseDataType<string[]>>("/getWJLJPointLc", { id: buildIngId });
}

// 楼栋 楼层 网络设备点位
export function fetchBuildingFloorNetworkDevice(buildIngId: string, floorId: string) {
  return request.post<ApiResponseDataType<any[]>>(
    "/getWJLJPointXq",
    { id: buildIngId, lc: floorId },
  );
}

// 设备详情
export function fetchBuildingAssetsDetail(id: string) {
  return request.post<ApiResponseDataType<any>>("/getWJLJPointXqLb", { apid: id.replace("\n", "") });
}
