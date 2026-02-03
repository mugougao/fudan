import { CampusName } from "@/enums";
import { request } from "@/utils/request";

function campusIdFormat(campusId: string) {
  return `${CampusName[campusId]}校区`;
}

// 获取教学楼点位
export function getSchoolBuildLayer(campusId: string) {
  return request.post<ApiResponseDataType<any>>("/getTeachingBuilding", { campus: campusIdFormat(campusId) }, {});
}

/**
 * 校园概览
 */
export function getCampusOverview(campusId: string) {
  return request.post<ApiResponseDataType<{
    jsslfb: Array<{ mc: string; num: number }>;
    jslxfb: Array<{ mc: string; num: number }>;
    jxls: number;
    jss: number;
  }>>("/getTeachCampusOverview", { campus: campusIdFormat(campusId) }, {});
}

// 楼栋教室 近七天使用率
export function getBuildingClassroomUsageRate(campusId: string) {
  return request.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getUr7D", { campus: campusIdFormat(campusId) }, {});
}

// 楼栋使用率
export function getBuildingUsageRate(campusId: string) {
  return request.post<ApiResponseDataType<{ id: string; name: string; value: number }[]>>("/getBuildingUr", { campus: campusIdFormat(campusId) }, {});
}

// 楼栋课程统计
export function getBuildingCourseStatistics(buildId: string) {
  return request.post<ApiResponseDataType<any>>("/getJXXQ", { id: buildId }, {});
}

// 楼栋教室 表
export function getBuildingClassroomTable(buildId: string) {
  return request.post<ApiResponseDataType<{
    lc: number;
    children: { name: string; id: string; type: string }[];
  }[]>>("/getJxLpB", { id: buildId }, {});
}

// 楼栋 详情
export function getBuildingDetail(buildId: string) {
  return request.post<ApiResponseDataType<any>>("/getJSXQ", { id: buildId }, {});
}

export interface IGetClassroomDetailPanelResult {
  jsxx: {
    sklx: string;
    kcdl: string;
    skjs: string;
    kcmc: string;
    skrs: string;
  };
  jszt: string;
  jsbh: string;
  jsfmd: number;
}

// 教室详情面板
export function getClassroomDetailPanel(classroomId: string) {
  return request.post<ApiResponseDataType<IGetClassroomDetailPanelResult>>("/getJXJSXQ", { id: classroomId }, {});
}

export type IGetClassroomBusynessTop5Result = { num: number; js: string }[];

// 教室 繁忙度 top5
export function getClassroomBusynessTop5(buildId: string) {
  return request.post<ApiResponseDataType<IGetClassroomBusynessTop5Result>>("/getJSFMD", { id: buildId }, {});
}

export interface IGetHeatMapRangeResult {
  mc: string;
  zs: string;
  ys: string;
  id: string;
  zx: string;
  yx: string;
}

// 使用热力图 范围
export function getHeatMapRange(campusId = "3") {
  return request.post<ApiResponseDataType<[IGetHeatMapRangeResult]>>(
    "/getTbRlt",
    { id: campusId },
    {},
  );
}

export interface IGetHeatMapDataResult {
  geo: string;
  name: string;
  value: number;
}

// 使用热力图 范围
export function getHeatMapData(campusId = "3") {
  return request.post<ApiResponseDataType<IGetHeatMapDataResult[]>>(
    "/getBuildingRL",
    { id: campusId },
    {},
  );
}

export interface IGetBuildingVectorData {
  features: {
    geometry: { coordinates: number[][][][]; type: string };
    type: string;
    properties: { d: string; mc: string; g: string; supnme: string; id: string };
  }[];
  type: string;
}

// 教学楼栋矢量面数据
export function getBuildingVectorData() {
  return request.post<ApiResponseDataType<IGetBuildingVectorData>>("/getGeomTeachBuilding", {}, {});
}
