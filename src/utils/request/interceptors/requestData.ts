import type { AxiosInstance } from "axios";
import qs from "qs";
import { ContentType } from "@/utils/request/createRequest";

const verifyReg = /post|put/i;

/**
 * 用于处理请求数据 参数转换
 * @param axiosInstance
 */
export function requestData(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    const method = config.method || "get";
    const contentType = config.headers["Content-Type"];
    const data = config.data || {};
    const verify = verifyReg.test(method);

    if (!verify)
      return config;

    if (contentType === ContentType.Json) {
      config.data = qs.stringify(data);
    }
    else if (contentType === ContentType.FormData) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value == null)
          return;
        const valueType = typeof value;
        if (["number", "boolean", "string"].includes(valueType)) {
          formData.append(key, `${value}`);
        }
        else if (valueType === "object") {
          if (Array.isArray(value)) {
            value.every(item => item instanceof Blob)
              ? value.forEach(item => formData.append(key, item))
              : formData.append(key, JSON.stringify(value));
          }
          else {
            formData.append(key, JSON.stringify(value));
          }
        }
      });
      config.data = formData;
    }

    return config;
  });
}
