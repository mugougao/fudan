import type { AxiosInstance, AxiosResponse } from "axios";

export function responseResultFailed(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponseType>) => {
      const code = response.status;
      if ((code >= 200 && code < 300) || code === 304) {
        const config = response.config;
        const success = config.custom?.success;

        if (success && response.data) {
          const _success = success(response.data);
          if (!_success)
            return Promise.reject(response.data);
        }
      }

      return response;
    },
    error => Promise.reject(error),
  );
}
