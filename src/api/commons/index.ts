import { ETLRequest, request } from "@/utils/request";

// 获取校区范围及信息
export const getCampus = (campusId?: number) => request.post<ApiResponseDataType<any>>("/getCampusInformation", { id: campusId }, {});

// 区域范围
export function getAreaRange(id: string) {
  return request.post<ApiResponseDataType<[{ mc: string; zs: string; ys: string; id: string; zx: string; yx: string }]>>("/getTbRlt", { id }, {});
}

// 所有院系
export function getAllCollege(params = {}) {
  // return request.post<ApiResponseDataType<string[]>>("/getYxName", params, { custom: { loading: false } });
  return ETLRequest.post<ApiResponseDataType<string[]>>("/getBigYx", params, { custom: { loading: false } });
}

// 所有楼宇
export function getAllBuild(params = {}) {
  // return request.post<ApiResponseDataType<string[]>>("/getLyName", params, { custom: { loading: false } });
  return ETLRequest.post<ApiResponseDataType<{ name: string;value: string }[]>>("/getBigLy", params, { custom: { loading: false } });
}

// 部门列表
export function getAllDept(params = {}) {
  return request.post<ApiResponseDataType<string[]>>("/getAssetFaculty", params, { custom: { loading: false } });
}
