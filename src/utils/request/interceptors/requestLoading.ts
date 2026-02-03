import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { createLoading } from "@/utils/createLoading";

let loadingInstance: any;

const loadingRequest: AxiosRequestConfig[] = [];

function openLoading(config: AxiosRequestConfig) {
  if (!config.custom?.loading)
    return;
  loadingRequest.push(config);
  if (loadingInstance)
    return;
  loadingInstance = createLoading();
}

function closeLoading(config: AxiosRequestConfig) {
  if (!config.custom?.loading)
    return;
  const index = loadingRequest.findIndex(item => item === config);
  if (index !== -1)
    loadingRequest.splice(index, 1);
  if (loadingRequest.length <= 0) {
    loadingInstance?.close();
    loadingInstance = undefined;
  }
}

// 请求loading
export function requestLoading(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    openLoading(config);
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      closeLoading(response.config);
      return response;
    },
    (error) => {
      closeLoading(error.config);
      return Promise.reject(error);
    },
  );
}
