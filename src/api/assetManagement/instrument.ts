import type { CampusId } from "@/enums";
import { campusIdFormat } from "@/enums";
import { ETLRequest, request } from "@/utils/request";

export interface IFetchCampusAssetsTotalResult {
  zsbs: number;
  yxdxyqlb: { num: number; name: string; count: number; zdnum: number }[];
  zjes: number;
  xqzcfb: { name: string; value: number }[];
  zysyfx: { name: string; value: number }[];
  dbzs: number;
  xqzdfb: { name: string; value: number }[];
  zdzs: number;
  xqslfb: { name: string; value: number }[];
  xqdbfb: { name: string; value: number }[];
}

// 校区总览
export async function fetchCampusAssetsTotal() {
  return request.post<ApiResponseDataType<IFetchCampusAssetsTotalResult>>("/getCampusBigEquipment", { }, {});
}

// 根据院系查询校区资产分布
export async function fetchCampusAssetsDistribution(faculties: string) {
  return request.post<ApiResponseDataType<{ num: number; name: string; count: number }[]>>("/getCampusBigEquipmentYx", { name: faculties }, {});
}
export interface IFetchCampusAssetsResult {
  zsbs: number;
  yxdxyqlb: { num: number; name: string; count: number; zdnum: number }[];
  zjes: number;
  zysyfx: { name: string; value: number }[];
  xqdbzs: { num: number; dbl: number };
}
// 大型仪器-某校区-总览
export async function fetchCampusAssets(campusId: CampusId) {
  return request.post<ApiResponseDataType<IFetchCampusAssetsResult>>("/getXQBigEquipment", { name: campusIdFormat(campusId) }, {});
}

// 大型仪器-某校区-信息查询列表
export function fetchCampusAssetsType(campusId: CampusId, build: string, faculties: string, parentField: "1" | "2") {
  return request.post<ApiResponseDataType<{ name: number; sl: number; je: number }[]>>(
    "/getCampusBigEquipmentListCount",
    { name: campusIdFormat(campusId), ly: build, yx: faculties, parentField },
    {},
  );
}

export function fetchCampusAssetsTypeDetail(campusId: CampusId, build: string, faculties: string, parentField: "1" | "2", parentName: string) {
  return request.post<ApiResponseDataType<{ zj: number; zcmc: string; zcbh: string; ly: string; yx: string }[]>>(
    "/getCampusBigEquipmentList",
    { name: campusIdFormat(campusId), ly: build, yx: faculties, parentField, parentName },
    {},
  );
}

// 大型仪器-校区与学院POI
export function fetchCampusWithCollegePoi(campusName: string, collegeName: string = "", build: string = "") {
  return ETLRequest.post<ApiResponseDataType<any>>("/getPropertyGeomZs", { xq: campusName, yx: collegeName, ly: build }, {});
}

// 院系大型仪器poi
export function fetchFacultiesLargeInstrumentsPoiList(campusId: CampusId, build: string, faculties: string) {
  return request.post<ApiResponseDataType<any>>("/getPropertyGeomFb", {
    xq: campusIdFormat(campusId),
    ly: build,
    yx: faculties,
  }, {});
}

export interface IFetchBuildingDetailResult {
  zdazzs: number;
  zsbs: number;
  yxdxyqlb: { num: number; name: string; count: number }[];
  zjes: number;
  zysyfx: { name: string; value: number }[];
  xq: { num: number; name: string; zysyfx: string; yx: string }[];
  zdsbfbx: { num: number; name: string; zysyfx: string; yx: string }[];
}

// 楼栋详情信息
export function fetchBuildingDetail(buildName: string) {
  return request.post<ApiResponseDataType<IFetchBuildingDetailResult>>(
    "/getBigData",
    {
      name: buildName,
    },
    {},
  );
}
