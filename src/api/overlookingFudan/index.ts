import { request } from "@/utils/request";

// 查询校区信息
export const getCampus = (campusId?: number) => request.post<ApiResponseDataType<any>>("/getCampus", { id: campusId }, {});

// 查询导览路线信息
export const getTourRoute = (id?: number) => request.post<ApiResponseDataType<any>>("/getTourRoute", { id }, {});

// 查询地标信息
export const getLandmark = (id?: number) => request.post<ApiResponseDataType<any>>("/getLandmark", { id }, {});
// export const getData1 = () => request.post<ApiResponsePageInfoType<any>>("/getData1", {}, {});
