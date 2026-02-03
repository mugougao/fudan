import { CampusId, campusIdFormat } from "@/enums";
import { ETLRequest } from "@/utils/request";

export interface IFetchAssetsTotalResult {
  sl: number;
  je: number;
}

// 资产总数
export function fetchAssetsTotal(campusId?: CampusId) {
  let params = {};
  if (campusId) params = { xq: campusIdFormat(campusId) };
  return ETLRequest.post<ApiResponseDataType<IFetchAssetsTotalResult>>("/getBigZs", params, {});
}

export interface IFetchAssetsUseDirectionResultItem {
  name: string;
  value: number;
}
// 主要使用方向
export function fetchAssetsUseDirection(campusId?: CampusId) {
  if (!campusId || campusId === CampusId.Overview) {
    return ETLRequest.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getBigSyfx", {}, {});
  }
  return ETLRequest.post<ApiResponseDataType<{ name: string; value: number }[]>>("/getBigXqSyfx", { xq: campusIdFormat(campusId) }, {})
    .then((res) => {
      const { resultData = [] } = res;
      return {
        ...res,
        resultData: (resultData as any[]).map(({ name, sl }) => ({ value: sl, name })),
      };
    });
}

export interface IFetchAssetsDistributionResultItem {
  name: string;
  value: number;
  value1: number;
}
// 大型仪器分布
export function fetchAssetsDistribution() {
  return ETLRequest.post<ApiResponseDataType<IFetchAssetsDistributionResultItem[]>>("/getBigDxyqfb", {}, {});
}

// 已安装终端仪器数量
export function fetchAssetsTerminalInstalled() {
  return ETLRequest.post<ApiResponseDataType<IFetchAssetsUseDirectionResultItem[]>>("/getBigAzzd", {}, {});
}

export interface IFetchAssetsListResultItem {
  name: string;
  sl: number;
  zd: number;
  je: number;
}
// 大型仪器列表
export function fetchAssetsList() {
  return ETLRequest.post<ApiResponseDataType<IFetchAssetsListResultItem[]>>("/getBigDxyqlb", {}, {});
}

// 院系查询
export function fetchAssetsCollege(collegeName?: string) {
  return ETLRequest.post<ApiResponseDataType<{
    campus: string;
    sl: number;
    je: number;
  }[]>>("/getBigYxcx", { yx: collegeName }, {});
}

// 楼宇分布
export function fetchAssetsBuilding(campusId: CampusId) {
  return ETLRequest.post<ApiResponseDataType<{
    mc: string;
    sl: number;
    zd: number;
    je: number;
  }[]>>("/getBigLyfb", { xq: campusIdFormat(campusId) }, {});
}

// 大型仪器-某校区-信息查询列表
export function fetchCampusAssetsType(campusId: CampusId, build: string, faculties: string, parentField: "1" | "2") {
  return ETLRequest.post<ApiResponseDataType<{ name: number; sl: number; je: number }[]>>(
    "/getCampusBigEquipmentListCount",
    { name: campusIdFormat(campusId), ly: build, yx: faculties, parentField },
    {},
  );
}

export function fetchCampusAssetsTypeDetail(campusId: CampusId, build: string, faculties: string, parentField: "1" | "2", parentName: string) {
  return ETLRequest.post<ApiResponseDataType<{ zj: number; zcmc: string; zcbh: string; ly: string; yx: string }[]>>(
    "/getCampusBigEquipmentList",
    { name: campusIdFormat(campusId), ly: build, yx: faculties, parentField, parentName },
    {},
  );
}

export interface IFetchBuildingDetailResult {
  dxyqsl: { sl: number; zd: number; je: number };
  syfx: { name: string; value: number }[];
  sbfb: { name: string; value: number; value1: number }[];
}
// 楼顶详情
export function fetchBuildingDetail(buildName: string, buildId: string) {
  return ETLRequest.post<ApiResponseDataType<IFetchBuildingDetailResult>>("/getBigData", { ly: buildName, no: buildId }, {});
}

// 楼栋设备分布列表
export function fetchBuildingDeviceDistribution(buildName: string, campusId: CampusId, buildId: string) {
  return ETLRequest.post<ApiResponseDataType<any[]>>(
    "/getCampusBigEquipmentList",
    { ly: buildName, name: campusIdFormat(campusId), no: buildId },
    {},
  );
}

// 楼栋终端设备详情
export function fetchBuildingTerminalDetail(buildName: string, campusId: CampusId, buildId: string) {
  return ETLRequest.post<ApiResponseDataType<any[]>>(
    "/getCampusBigEquipmentList",
    { ly: buildName, name: campusIdFormat(campusId), no: buildId, syzd: "是" },
    {},
  );
}
