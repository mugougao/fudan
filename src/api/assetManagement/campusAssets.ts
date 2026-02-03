import type { CampusId } from "@/enums";
import { campusIdFormat } from "@/enums";
import { ETLRequest, request } from "@/utils/request";

// 获取校区资产总数量及金额
export function fetchCampusAssets(campusId: CampusId) {
  const campusName = campusIdFormat(campusId);
  return ETLRequest.post<ApiResponseDataType<{ sl: number; je: number }>>("/getCampusNum", { xq: campusName }, {});
}

// 获取校区资产类型数量及金额
export function fetchCampusAssetsType(campusId: CampusId) {
  const campusName = campusIdFormat(campusId);
  return ETLRequest.post<ApiResponseDataType<{ name: "设备" | "家具" | "软件"; sl: number; je: number }[]>>("/getCampusTypeNameNum", { xq: campusName }, {});
}

// 获取四校区资产数量分布
export function fetchCampusAssetsDistribution() {
  return ETLRequest.post<ApiResponseDataType<{ name: string; sl: number; je: number }[]>>("/getCampusPropertyInformation", {}, {});
}

// 获取 四校区资产到期分布
export function fetchCampusAssetsExpireDistribution(campusId: CampusId, type: 0 | 1) {
  const type_name = ["仪器设备", "家具用具装具"][type];
  return ETLRequest.post<ApiResponseDataType<{ time: string; sl: number; je: number }[]>>("/getCampusTypeNameYearNum", { xq: campusIdFormat(campusId), type_name }, {});
}

// 获取四校区大型仪器分布
export function fetchCampusAssetsLargeInstrumentDistribution(campusId: CampusId) {
  const campusName = campusIdFormat(campusId);
  return ETLRequest.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getCampusBigNum", { xq: campusName }, {});
}

// 校区资产建筑 楼栋
export function fetchCampusAssetsBuild(campusId: CampusId) {
  const campusName = campusIdFormat(campusId);
  return request.post<ApiResponseDataType<any>>("/getPropertyGeom", { xq: campusName }, {});
}

// 校区资产建筑 楼栋 - 房产信息
export function fetchCampusAssetsBuildInfo(buildId: string) {
  return request.post<ApiResponseDataType<{ sfydt: string; symj: string; name: string; lyxz: string; jzmj: string }>>("/getBuildingProperty", { no: buildId }, {});
}

// 校区资产建筑 楼栋 - 资产信息
export function fetchCampusAssetsBuildAssets(buildId: string) {
  return ETLRequest.post<ApiResponseDataType<{ sl: number; je: number; dxyqsl: number }>>("/getBuildingPropertyNum", { no: buildId }, {});
}

// 校区资产建筑 楼栋 - 资产类型统计
export function fetchCampusAssetsBuildAssetsType(buildId: string) {
  return ETLRequest.post<ApiResponseDataType<{ value2: number; value1: number; name: string }[]>>("/getBuildingPropertyTypeCount", { no: buildId }, {});
}

// 校区资产建筑 楼栋 - 资产年份统计
export function fetchCampusAssetsBuildAssetsYear(buildId: string, type: 0 | 1) {
  return ETLRequest.post<ApiResponseDataType<{ sl: number; time: string; je: number }[]>>("/getBuildingPropertyYearCount", { no: buildId, type_name: ["仪器设备", "家具用具装具"][type] }, {});
}

// 设备根据校区统计，获取校区资产数量及金额 根据院系查询
export function fetchCampusAssetsTypeByCollege(collegeName: string = "") {
  return ETLRequest.post<ApiResponseDataType<{ campus: string; sl: number; je: number }[]>>("/getBigYxcxTwo", { yx: collegeName }, {});
}

// 设备根据校区统计，获取校区资产数量及金额 根据院系查询
export function fetchCampusAssetsTypePoiByCollege(campusName: string, collegeName: string = "") {
  return ETLRequest.post<ApiResponseDataType<any>>("/getPropertyGeomZsTwo", { xq: campusName, yx: collegeName }, {});
}
