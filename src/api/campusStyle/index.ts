import { request } from "@/utils/request";

// 查询导览路线信息
export const getTourRoute = (id?: number) => request.post<ApiResponseDataType<any>>("/getTourRoute", { id }, {});

// 查询地标信息
export const getLandmark = (type?: string) => request.post<ApiResponseDataType<any>>("/getLandmark", { type }, {});

// 查询地标详细信息
export const getLandmarkFile = (id?: string) => request.post<ApiResponseDataType<any>>("/getLandmarkFile", { id }, {});
