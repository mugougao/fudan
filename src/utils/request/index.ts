import { requestToken } from "@/utils/request/interceptors/requestToken.ts";
import CreateRequest from "./createRequest";
import {
  requestData,
  requestLoading,
  responseDecodeData,
  responseError,
  responseMessage,
  responseResultFailed,
} from "./interceptors";

export const request = (() => {
  const request = CreateRequest.create({
    baseURL: import.meta.env.VITE_HTTP_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json;charset=UTF",
    },
    custom: {
      message: (data: ApiResponseType) => false,
      messageType: (data: ApiResponseType) => data.success ? "success" : "warning",
      success: (data: ApiResponseType) => true,
    },
  });

  // 🚫 注释掉 loading 和 message 拦截器
  [
    requestData,
    // requestLoading,      // 禁用加载蒙版
    // responseError,       // 禁用错误提示
    // responseMessage,     // 禁用成功消息
    responseResultFailed,
    requestToken,
    responseDecodeData,
  ].forEach(request.use.bind(request));

  return request;
})();

export const ETLRequest = (() => {
  const request = CreateRequest.create({
    baseURL: import.meta.env.VITE_HTTP_ETL_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json;charset=UTF",
    },
    custom: {
      message: (data: ApiResponseType) => false,
      messageType: (data: ApiResponseType) => data.success ? "success" : "error",
      success: (data: ApiResponseType) => true,
    },
  });

  // 🚫 注释掉 loading 和 message 拦截器
  [
    requestData,
    // requestLoading,      // 禁用加载蒙版
    // responseError,       // 禁用错误提示
    // responseMessage,     // 禁用成功消息
    responseResultFailed,
    requestToken,
    responseDecodeData,
  ].forEach(request.use.bind(request));

  return request;
})();

export const localJsonRequest = CreateRequest.create({
  baseURL: `${window.location.origin}/json`,
  timeout: 10000,
});

// 🚫 注释掉 loading 和 message 拦截器
[
  requestData,
  // requestLoading,      // 禁用加载蒙版
  // responseError,       // 禁用错误提示
  // responseMessage,     // 禁用成功消息
].forEach(localJsonRequest.use.bind(localJsonRequest));
