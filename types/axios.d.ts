import "axios";

type messageType = "success" | "error" | "warning" | "info";

export { };

declare module "axios" {

  export interface AxiosRequestConfig<T = any> {
    custom?: {
      // 是否开启loading
      loading?: boolean;
      // 是否开启 message 消息提示
      message?: boolean | ((data: T) => boolean);
      // message 消息提示内容： 默认为 data.message
      messagePath?: string | ((data: T) => string);
      messageType?: messageType | ((data: T) => messageType);
      // 自动取消重复请求
      // cancelRepeat?: boolean;
      // 根据 请求结果 判断是否 成功 response.data.success
      success?: (data: T) => boolean;
    };
  }
}
