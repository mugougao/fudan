import { type CampusId, campusIdFormat } from "@/enums";
import { ETLRequest, request } from "@/utils/request";

/**
 * 获取宿舍区 区域范围
 * @param campusId : 校区id
 */
export const getDormitoryArea = (campusId: string) => request.post<ApiResponseDataType<any>>("/getArea", { id: campusId }, {});

/**
 * 查询宿舍区楼栋
 * @param dormitoryAreaId : 宿舍区id
 */
export const getDormitoryAreaBuilding = (dormitoryAreaId: string) => request.post<ApiResponseDataType<any>>("/getBuilding", { id: dormitoryAreaId }, {});

/**
 * 查询楼栋房间
 * @param dormitoryBuildingId : 楼栋id
 */
export const getDormitoryBuildingRoom = (dormitoryBuildingId: string) => request.post<ApiResponseDataType<any>>("/getRoom", { id: dormitoryBuildingId }, {});

/**
 * 宿舍区面板数据
 * @param dormitoryAreaId : 宿舍区id
 */
export const getDormitoryAreaData = (dormitoryAreaId: string) => request.post<ApiResponseDataType<any>>("/getAreaOverview", { id: dormitoryAreaId }, {});

// 宿舍区用电数据
export const getDormitoryAreaElectricity = (dormitoryAreaId: string) => request.post<ApiResponseDataType<any>>("/getAreaUseElectricity", { id: dormitoryAreaId }, {});

export interface IGetDormitoryAreaEnergyResult {
  ndgdl: { name: string; value: number }[];
  zrydl: number;
  ndydl: { name: string; value: number }[];
  zrgdl: number;
}
// 宿舍区 能耗情况
export const getDormitoryAreaEnergy = (dormitoryAreaId: string) => ETLRequest.post<ApiResponseDataType<IGetDormitoryAreaEnergyResult>>("/getAreaOverview", { id: dormitoryAreaId }, {});

/**
 * 查询校区面板所有数据
 * @param id : 校区id
 */
export const getCampus = (id: string) => request.post<ApiResponseDataType<any>>("/getCampusOverview", { id: Number(id) }, {});

// 获取校区用电数据
export function getCampusElectricity(campusId: string, campusName: string) {
  return request.post<ApiResponseDataType<any>>("/getCampusUseElectricity", { id: Number(campusId), xq: campusName }, {});
}

export interface IGetCampusElectricDataResult {
  ydtb: { value1: number; name: string; value: number }[];
  yqyd: { name: string; value: number }[];
  ydzs: number;
  ydhb: { value1: number; name: string; value: number }[];
}
// 各个校区用电
export function getCampusElectricData(campusId: CampusId) {
  return ETLRequest.post<ApiResponseDataType<IGetCampusElectricDataResult>>("/getCampusUseElectricity", { id: campusId, xq: campusIdFormat(campusId) }, {});
}

export interface IGetCampusPurchaseDataResult {
  ndgd: { value2: number; value1: number; name: string }[];
  jrgd: { data: { name: string; value: number }[]; count: number };
  gdyddb: { value2: number; value1: number; name: string }[];
}
// 各个校区购电
export function getCampusPurchaseData(campusId: CampusId) {
  return ETLRequest.post<ApiResponseDataType<IGetCampusPurchaseDataResult>>("/getCampusOverview", { id: campusId }, {});
}

/**
 * 楼宇面板-查询面板分析数据
 * @param buildId : 楼宇id
 */
export const getBuildingOverview = (buildId: string) => request.post<ApiResponseDataType<any>>("/getBuildingOverview", { id: buildId }, {});

/**
 * 楼宇面板-楼盘表
 */
export const getBuildRoomTable = (buildId: string, type?: string) => request.post<ApiResponseDataType<any>>("/getHousingEstate", { id: buildId, type }, {});

// 楼宇面板-园委会查询
export function getBuildingOverviewYh(areaName: string, buildName: string) {
  return request.post<ApiResponseDataType<{ zs: number; lb: { xh: string; name: string; yx: string }[] }>>(
    "/getYwh",
    { yq: areaName, ly: buildName },
    {},
  );
}

/**
 * 楼宇详情
 * @param lyid
 */
export const getBuildDetail = (lyid: string) => request.post<ApiResponseDataType<any>>("/getBuilding", { lyid }, {});

/**
 * 房间面板-查询面板分析数据
 * @param roomId : 房间id
 */
export const getRoom = (roomId: string) => request.post<ApiResponseDataType<any>>("/getRoomOverview", { id: roomId }, {});

/**
 * 宿舍区-审批数据
 * @param dormitoryAreaId : 宿舍区id
 */
export const getApprove = (dormitoryAreaId: string) => request.post<ApiResponseDataType<any>>("/getApprove", { id: dormitoryAreaId }, {});

/**
 * 获取督导员人数及信息
 * @param { id, qyid } : 宿舍区面的id
 */
export const getSupervisor = ({ id, qyid }) => request.post<ApiResponseDataType<any>>("/getSupervisor", { id, qyid }, {});

// 重点关注学生信息 - 人员预警
export const getFocusStudentEarlyWarn = (buildId: string) => request.post<ApiResponseDataType<any>>("/getPostgraduateInformation", { lyid: buildId }, {});

export interface IGetDormitoryBuildElectricityResult {
  ydtb: { value2: number; value1: number; name: string }[];
  zrydl: number;
  zrgdl: number;
}
// 宿舍楼宇用电数据
export const getDormitoryBuildElectricity = (buildId: string) => ETLRequest.post<ApiResponseDataType<IGetDormitoryBuildElectricityResult>>("/getBuildingUseElectricity", { lyid: buildId }, {});

/**
 * 判断是否为文明寝室
 * @param roomId : 房间id
 */
export const getCivilizedDormitory = (roomId: string) => request.post<ApiResponseDataType<any>>("/getCivilizedDormitory", { id: roomId }, {});

// 房间面板-年度能耗信息
export const fetchRoomYearElectricity = (roomId: string) => request.post<ApiResponseDataType<any>>("/getRoomUseElectricity", { fjid: roomId }, {});

// 房间面板-当月用电信息
export const fetchRoomMonthElectricity = (roomId: string) => request.post<ApiResponseDataType<any>>("/getRoomMonthUseElectricity", { fjid: roomId }, {});

// 房间面板-当月购电信息
export const fetchRoomPurchaseElectricity = (roomId: string) => request.post<ApiResponseDataType<any>>("/getRoomPurchaseElectricity", { fjid: roomId }, {});

export interface IGetRoomElectricityResult {
  ndgd: number;
  ndyd: number;
  myyd: { name: string; value: number }[];
  mygd: { name: string; value: number }[];
  dygd: number;
  dyyd: number;
  myydhbzz: { value1: number; name: string; value: number }[];
}
// 房间面板-能耗信息
export const fetchRoomElectricity = (dormitoryAreaId: string, roomId: string) => ETLRequest.post<ApiResponseDataType<IGetRoomElectricityResult>>("/getRoomMonthUseElectricity", { fjid: roomId, yqid: dormitoryAreaId }, {});

/**
 * 宿舍区面板-督导员数量
 * @param dormitoryAreaId : 宿舍区id
 */
export const getAreaSupervisorCount = (dormitoryAreaId: string) => request.post<ApiResponseDataType<any>>("/getAreaSupervisorCount", { id: dormitoryAreaId }, {});

export interface IGetCheckInRateResult {
  mc: string;
  num: string;
  lyid: string;
  geom: string;
}
/**
 * 入住率分布
 * @param dormitoryAreaId : 宿舍区id
 */
export const getCheckInRate = (dormitoryAreaId: string) => request.post<ApiResponseDataType<IGetCheckInRateResult[]>>("/getBuildingRenovation", { id: dormitoryAreaId }, {});

export interface IGetCheckInRateRangeResult {
  mc: string;
  zs: string;
  ys: string;
  id: string;
  zx: string;
  yx: string;
}
// 入住率范围
export const getCheckInRateRange = (dormitoryAreaId: string) => request.post<ApiResponseDataType<[IGetCheckInRateRangeResult]>>("/getTbRlt", { id: dormitoryAreaId }, {});

/**
 * 获取宿舍楼宇空间数据
 * @param buildId
 */
export const getDormitoryBuildingSpace = (buildId: string) => request.post<ApiResponseDataType<any>>("/getBuilding", { lyid: buildId }, {});

export interface IGetDormitoryBuildingVector {
  features: {
    geometry: { coordinates: number[][][][]; type: string };
    type: string;
    properties: { d: string; mc: string; g: string; supnme: string; id: string };
  }[];
  type: string;
}

// 宿舍楼 矢量面
export const getDormitoryBuildingVector = () => request.post<ApiResponseDataType<IGetDormitoryBuildingVector>>("/getGeomDormBuilding", { }, {});

// 宿舍房间 矢量面
export const getDormitoryRoomVector = () => request.post<ApiResponseDataType<IGetDormitoryBuildingVector>>("/getGeomDormRoom", { }, {});

// 楼宇房间状态
export function getBuildingRoomStatus(buildId: string) {
  return request.post<ApiResponseDataType<{
    fjid: string;
    type: "空置房间" | "空置床位房间" | "住满房间";
  }[]>>("/getFJFB", { id: buildId }, {});
}

// 楼宇房间用电top5
export function getBuildTop5Room(buildId: string) {
  return ETLRequest.post<ApiResponseDataType<{
    fjmc: string;
    id: string;
    value: number;
  }[]>>("/getBuildingUseElectricityTop5", { lyid: buildId }, {});
}

// 审批详情 - 统计信息
export function getApprovalDetailStatistics(dormitoryAreaId: string, startTime: string, endTime: string, buildId?: string) {
  return request.post<ApiResponseDataType<{ tiaosuzs: number; rzzs: number; tszs: number }>>(
    "/getTszsTj",
    { lyid: buildId, qyid: dormitoryAreaId, st_dt: startTime, ed_dt: endTime },
    {},
  );
}

// 审批详情 - 入住情况
export function getApprovalDetailCheckIn(dormitoryAreaId: string, startTime: string, endTime: string, type: string, buildId?: string) {
  return request.post<ApiResponseDataType<{ name: string; value: number }[]>>(
    "/getRzryQk",
    { lyid: buildId, qyid: dormitoryAreaId, st_dt: startTime, ed_dt: endTime, zszt: type },
    {},
  );
}

// 审批详情 - 人员列表
export function getApprovalDetailPersonnelList(dormitoryAreaId: string, buildId?: string) {
  return request.post<ApiResponseDataType<{ lymc: string; zs: number; qymc: string; ts: number }[]>>(
    "/getTsList",
    { lyid: buildId, qyid: dormitoryAreaId },
    {},
  );
}

// 审批详情 - 楼宇列表
export function getApprovalDetailBuildingList(dormitoryAreaId: string) {
  return request.post<ApiResponseDataType<{ lymc: string; id: string }[]>>(
    "/getLyNameTwo",
    { qyid: dormitoryAreaId },
    {},
  );
}
