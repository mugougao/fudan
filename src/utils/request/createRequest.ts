import type { AxiosInstance, AxiosRequestConfig, Canceler } from "axios";
import axios from "axios";
import { saveAs } from "file-saver";
import { createLoading } from "@/utils/createLoading";

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

class CreateRequest {
  public axiosInstance: AxiosInstance;
  public interceptors: AxiosInstance["interceptors"];

  static defaultConfig: AxiosRequestConfig = {
    // baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": ContentType.Json,
    },
    custom: {
      loading: true,
      message: true,
      messagePath: "message",
    },
  };

  constructor(config: AxiosRequestConfig = {}) {
    this.axiosInstance = axios.create({
      ...CreateRequest.defaultConfig,
      ...config,
      headers: {
        ...CreateRequest.defaultConfig.headers,
        ...(config?.headers || {}),
      },
      custom: {
        ...CreateRequest.defaultConfig.custom,
        ...(config.custom || {}),
      },
    });
    this.interceptors = this.axiosInstance.interceptors;
  }

  use(callback: (axiosInstance: AxiosInstance) => void) {
    callback(this.axiosInstance);
    return this;
  }

  static create(config: AxiosRequestConfig) {
    return new CreateRequest(config);
  }

  createCancellableTask<T, R>(requestFunc: ((config: AxiosRequestConfig<T>) => Promise<T>) | ((url: string, data: R, config: AxiosRequestConfig<T>) => Promise<T>)) {
    let cancel: Canceler | null = null;
    return (...args: any[]) => {
      return new Promise((resolve, reject) => {
        const config = args.pop();
        const params = [
          ...args,
          {
            ...config,
            cancelToken: new axios.CancelToken((_cancel) => {
              cancel = _cancel;
            }),
          },
        ] as [string, R, AxiosRequestConfig<T>];

        requestFunc(...params)
          .then(resolve, reject)
          .finally(() => {
            cancel = null;
          });
      });
    };
  }

  request<T>(config: AxiosRequestConfig<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request<T>(config)
        .then(
          res => resolve(res.data),
          reject,
        );
    });
  }

  get<T, R = any>(url: string, data: R = {} as any, config: AxiosRequestConfig<T> = {}) {
    return this.request<T>({ ...config, method: "GET", params: data, url });
  }

  post<T, R = any>(url: string, data: R = {} as any, config: AxiosRequestConfig<T> = {}) {
    return this.request<T>({ ...config, method: "POST", data: data as any, url });
  }

  put<T, R = any>(url: string, data: R = {} as any, config: AxiosRequestConfig<T> = {}) {
    return this.request<T>({ ...config, method: "PUT", data: data as any, url });
  }

  delete<T, R = any>(url: string, data: R = {} as any, config: AxiosRequestConfig<T> = {}) {
    return this.request<T>({ ...config, method: "DELETE", data: data as any, url });
  }

  patch<T, R = any>(url: string, data: R = {} as any, config: AxiosRequestConfig<T> = {}) {
    return this.request<T>({ ...config, method: "PATCH", data: data as any, url });
  }

  download(url: string, fileName: string, data: any = {}, config: AxiosRequestConfig = {}) {
    const loadingInstance = createLoading({
      tip: "数据导出中，请等待...",
      size: "large",
      isFullScreen: true,
    });
    return new Promise((resolve, reject) => {
      this.request<Blob>({ ...config, method: "POST", data: data as any, url, responseType: "blob" })
        .then((res) => {
          if (res instanceof Blob) {
            saveAs(res, fileName);
            resolve({ success: true, message: "数据导出成功" });
          }
          else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ success: false, message: "数据导出失败" });
          }
        }, () => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ success: false, message: "数据导出失败" });
        })
        .finally(() => {
          loadingInstance?.close?.();
        });
    });
  }
}

export default CreateRequest;
