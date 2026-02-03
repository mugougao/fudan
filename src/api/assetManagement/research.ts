import { request } from "@/utils/request";

// 设备列表
export function fetchInstrumentList() {
  return request.post<ApiResponseDataType<{ id: string;sbmc: string }[]>>("/getEquipmentList");
}

// 设备详情
export function fetchInstrumentDetail(id: string) {
  return request.post<ApiResponseDataType<any>>("/getEquipmentDetails", { id });
}
