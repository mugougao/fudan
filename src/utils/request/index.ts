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

  [
    requestData,
    requestLoading,
    responseError,
    responseMessage,
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

  [
    requestData,
    requestLoading,
    responseError,
    responseMessage,
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

[
  requestData,
  requestLoading,
  responseError,
  responseMessage,
].forEach(localJsonRequest.use.bind(localJsonRequest));
