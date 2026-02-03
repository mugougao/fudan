import { CampusId, campusIdFormat } from "@/enums";
import { request } from "@/utils/request/index.ts";

// 校区能耗数据
export function fetchCampusEnergyConsumption(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<any>>("/getEnergyConsumptionOverview", { xq: campusIdFormat(campusId) });
}

// 校区 充电桩 电量/金额
export function fetchCampusChargingPile(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<any>>("/getChargingStation", { xq: campusIdFormat(campusId) });
}

// 校区 用水/用电
export function fetchCampusWaterElectricity(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ name: string;water: number;elect: number;electamount: number;wateramount: number }[]>>("/getElectricityConsumptionFourCampusesAmount", { xq: campusIdFormat(campusId) });
}

// 校区 用水/用电 楼栋 top5
export function fetchCampusWaterElectricityTop5(type: "water" | "electricity") {
  return request.post<ApiResponseDataType<{ name: string;value: number;value1: number }[]>>("/getEnergyConsumpTop5", { type: type === "water" ? "水" : "电" });
}

// 校区 能源监控
export function fetchCampusEnergyMonitor(campusId: CampusId = CampusId.Overview, type: "day" | "month" = "day") {
  return request.post<ApiResponseDataType<{ name: string;water: number;elect: number }[]>>(
    "/getEnergyMonitoring",
    {
      xq: campusIdFormat(campusId),
      type: type === "day" ? "日" : "月",
    },
  );
}

// 校区充电桩点位数据
export function fetchCampusChargingPilePoint(campusId: CampusId = CampusId.Overview, type: "electricBicycle" | "newEnergyVehicles") {
  return request.post<ApiResponseDataType<any>>("/getEcPoint", { xq: campusIdFormat(campusId), type: type === "newEnergyVehicles" ? "新能源" : "电瓶车" });
}

// 获取充电桩列表
export function fetchChargingPileList(id: string) {
  return request.post<ApiResponseDataType<{ dwid: string; name: string }[]>>("/getChargeDevice", { id });
}

// 获取充电桩 所在区域 年 统计数据
export function fetchChargingPileAreaYearStatistics(id: string) {
  return request.post<ApiResponseDataType<[{ update_time: string; value: number; amount: number }]>>("/getAreaChargeData", { id, type: "年" });
}

// 获取充电桩 所在区域 日/月 统计数据
export function fetchChargingPileAreaDayMonthStatistics(id: string, type: "day" | "month") {
  return request.post<ApiResponseDataType<{ update_time: string; value: number; amount: number }[]>>("/getAreaChargeData", { id, type: type === "day" ? "日" : "月" });
}

// 获取充电桩 充电量/金额  年统计数据
export function fetchChargingPileChargeYearStatistics(id: string) {
  return request.post<ApiResponseDataType<[{ update_time: string; value: number; amount: number }]>>("/getDeviceChargeData", { dwid: id, type: "年" });
}
// 获取充电桩 充电量/金额  日/月 统计数据
export function fetchChargingPileChargeDayMonthStatistics(id: string, type: "day" | "month") {
  return request.post<ApiResponseDataType<{ update_time: string; value: number; amount: number }[]>>("/getDeviceChargeData", { dwid: id, type: type === "day" ? "日" : "月" });
}

// 楼宇 能耗列表
export function fetchBuildingEnergyList(campusId: CampusId = CampusId.Overview, name: string = "") {
  return request.post<ApiResponseDataType<{ electamount: number; wateramount: number; name: string; id: string; water: number; elect: number }[]>>("/getBuildingEnergyList", { xq: campusIdFormat(campusId), name });
}

// 楼栋点位 根据楼栋id
export function fetchBuildingPointById(id: string) {
  return request.post<ApiResponseDataType<any>>("/getBuildingPointData", { id });
}

// 楼栋点位 详情（用水用电）
export function fetchBuildingPointDetail(id: string) {
  return request.post<ApiResponseDataType<{
    ydxx: Record<string, number>;
    rlb: { dayelectAmount: number; daywaterAmount: number; updatetime: string; daywater: number; dayelect: number }[];
    ylb: { dayelectAmount: number; daywaterAmount: number; updatetime: string; daywater: number; dayelect: number }[];
  }>>("/getBuildingEnergyDetails", { lyid: id });
}
