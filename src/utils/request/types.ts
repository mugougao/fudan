import type { AxiosRequestConfig } from "axios";

export interface IRequestConfig extends AxiosRequestConfig {
  custom?: {
    // 是否开启loading
    loading?: boolean;
    // 是否开启 message 消息提示
    message?: boolean;
    // message 消息提示内容： 默认为 data.message
    messagePath?: string;
    // 是否 提交 请求
    isSubmit?: boolean;
  };
}
