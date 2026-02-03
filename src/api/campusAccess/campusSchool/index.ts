import { request } from "@/utils/request";

export interface IFetchCampusOverviewResult {
  jxrsfb: { name: string; value: number }[];
  skjxsl: { name: string; value: { name: string; value: number }[] }[];
  crksl: { name: string; value: number }[];
}
/**
 * 校园概览
 */
export const fetchCampusOverview = () => request.post<ApiResponseDataType<IFetchCampusOverviewResult>>("/getGateCampusOverview", {}, {});

// 校区 出入口大门 点位
export const fetchCampusGate = (campusName: string) => request.post<ApiResponseDataType<any>>("/getCampusSupervisorPoint", { name: campusName }, {});

// 校区人流分布
export function fetchCampusFlowDistribution(campusName: string) {
  return request.post<ApiResponseDataType<{ name: string;value: number }[]>>("/getCampusSupervisorHour", { name: campusName }, {});
}

export interface IFetchCampusGateSituationResult {
  jrjx: {
    xn: number;
    zrs: number;
    xw: number;
  };
  sbsl: number;
  crksl: number;
}
// 入口态势
export function fetchCampusGateSituation(campusName: string) {
  return request.post<ApiResponseDataType<IFetchCampusGateSituationResult>>("/getCampusSupervisor", { name: campusName }, {});
}

// 刷卡类型占比
export function fetchCampusCardType(campusName: string) {
  return request.post<ApiResponseDataType<{ name: string;value: number }[]>>("/getCampusSupervisorType", { name: campusName }, {});
}

// 校区人流分布 热力图
export function fetchCampusFlowDistributionHeatMap(campusName: string) {
  return request.post<ApiResponseDataType<{ name: string; geom: string; value: number }[]>>("/getCampusSupervisorGeom", { name: campusName }, {});
}

// 门岗-校内/校外进出统计
export function fetchCampusGateInOutStatistics(schoolDoorId: string) {
  return request.post<ApiResponseDataType<{ xn: number; xw: number }>>("/getGateNum", { name: schoolDoorId }, {});
}

// 门岗-人流量分布
export function fetchCampusGateFlowDistribution(schoolDoorId: string) {
  return request.post<ApiResponseDataType<{ name: string;value1: number;value2: number }[]>>("/getGateHourNum", { name: schoolDoorId }, {});
}

// 门岗-近30天进校人次 /getGateDayNum
export function fetchCampusGateInOutStatistics30Days(schoolDoorId: string) {
  return request.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getGateDayNum", { name: schoolDoorId }, {});
}

// 门岗-平均进校人次 /getGateDayAVG
export function fetchCampusGateInOutStatisticsAVG(schoolDoorId: string) {
  return request.post<ApiResponseDataType<number>>("/getGateDayAVG", { name: schoolDoorId }, {});
}
