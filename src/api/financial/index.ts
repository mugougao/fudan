import { CampusId, campusIdFormat } from "@/enums";
import { request } from "@/utils/request/index.ts";

// 总览数据
export function fetchOverview(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ jz: number; sl: number; je: number }>>("/getCampusAssets", { xq: campusIdFormat(campusId) });
}

// 资产类型 统计
export function fetchCampusAssetsType(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ jz: number; sl: number; je: number; type: string }[]>>("/getCampusAssetsType", { xq: campusIdFormat(campusId) });
}

// 资产 校区分布 统计
export function fetchCampusAssetsDistribution(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ jz: number; sl: number; xq: string; je: number }[]>>("/getCampusAssetsDistribution", { name: campusIdFormat(campusId) });
}

// 校区 用水用电 统计
export function fetchCampusUseWaterWithElectricityCount(campusId: CampusId = CampusId.HanDan) {
  return request.post<ApiResponseDataType<{ electamount: number; wateramount: number; name: string; water: number; elect: number }[]>>("/getElectricityConsumptionFourCampusesAmount", { name: campusIdFormat(campusId) });
}

// 资产楼栋列表
export function fetchCampusAssetsBuildingList(campusId: CampusId = CampusId.Overview, buildingName: string = "", departmentName: string = "") {
  return request.post<ApiResponseDataType<{ jz: number; name: string; sl: number; id: string; je: number }[]>>("/getBuildingAssetsList", { yx: departmentName, name: buildingName, xq: campusIdFormat(campusId) });
}

// 楼栋用水用电 列表
export function fetchCampusBuildingUseWaterWithElectricityList(campusId: CampusId = CampusId.Overview, buildingName: string = "") {
  return request.post<ApiResponseDataType<{ electamount: number; wateramount: number; name: string; id: string; water: number; elect: number }[]>>("/getBuildingEnergyList", { name: buildingName, xq: campusIdFormat(campusId) });
}

// 根据Id查询楼栋点位
export function fetchBuildingPointById(id: string) {
  return request.post<ApiResponseDataType<any>>("/getBuildingPointData", { id });
}

// 根据Id查询楼栋统计信息
export function fetchBuildingCountInfoById(id: string) {
  return request.post<ApiResponseDataType<any>>("/getBuildingBusinessDetails", { lyid: id });
}
// 根据Id查询楼栋统计详情信息
export function fetchBuildingCountDetailInfoById(id: string) {
  return request.post<ApiResponseDataType<any>>("/getBuildingBusinessDetailsData", { lyid: id });
}

// 查询楼栋资产详情
export function fetchBuildingAssetsDetail(params: { id: string; pageNum: number; pageSize: number; zcbh?: string; bgr?: string; glbm?: string; cfd?: string }) {
  return request.post<ApiResponsePageInfoType<any[]>>("/getAssetStatement", { lyid: params.id, ...params });
}

// 导出 楼栋资产详情
export function exportBuildingAssetsDetail(params: { id: string; zcbh?: string; bgr?: string; glbm?: string; cfd?: string }) {
  return request.download("/getAssetStatementExport", "楼栋资产详情.xlsx", { lyid: params.id, ...params });
}

//  查询楼栋资产详情 筛选条件
export function fetchBuildingAssetsDetailFilter(buildingId: string) {
  return request.post<ApiResponseDataType<{ cfd: string[];bgrxm: string[];ejdw: string[] }>>("/getFilterCriteria", { lyid: buildingId });
}

// 基础设施点位
export function fetchInfrastructurePoint(campusId: CampusId = CampusId.Overview, type: string) {
  return request.post<ApiResponseDataType<any>>(
    "/getBuildingFinanceCoord",
    { xq: campusIdFormat(campusId), type },
  );
}

// 基础设施点位详情
export function fetchInfrastructurePointDetail(id: string, type: string) {
  return request.post<ApiResponseDataType<any>>(
    "/getFinanceCoordData",
    { lyid: id, type },
  );
}

// 资产热力图
export function fetchCampusAssetsHeatMap(campusId: CampusId = CampusId.Overview) {
  return request.post<ApiResponseDataType<{ jz: number; name: string; sl: number; id: string; je: number; geom: string }[]>>(
    "/getBuildingAssetsList",
    { xq: campusIdFormat(campusId) },
  );
}

// 水电热力图
export function fetchCampusWaterElectricityHeatMap(campusId: CampusId = CampusId.Overview, type: "water" | "electricity" = "water") {
  return request.post<ApiResponseDataType<{
    electamount: number;
    wateramount: number;
    name: string;
    id: string;
    geom: string;
    water: number;
    elect: number;
  }[]>>(
    "/getBuildingEnergyList",
    {
      xq: campusIdFormat(campusId),
      type: type === "water" ? "1" : "2",
    },
  );
}
