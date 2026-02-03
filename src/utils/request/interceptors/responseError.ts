import type { AxiosInstance } from "axios";
import { message as Message } from "ant-design-vue";
import axios from "axios";

const errorStatusMap: Record<string, any> = {
  // '-1': '远程服务响应失败,请稍后重试',
  301: "（永久移动）请求的网页已永久移动到新位置。",
  302: "（临时移动）服务器目前从不同的位置响应请求。",
  400: "（错误请求）服务器不理解请求的语法。",
  401: "（未授权）请求要求身份验证。",
  403: "（禁止）无权限, 服务器拒绝请求。",
  404: "（未找到） 服务器找不到请求的资源",
  408: "（超时） 请求超时",
  422: "（验证错误） 请求参数未通过验证",
  429: "（被限制）请求次数过多",
  500: "（服务器内部错误） 服务器遇到错误，无法完成请求。",
  501: "（尚未实施） 服务器不具备完成请求的功能。",
  502: "（错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。",
  503: "（服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。",
  504: "（网关超时） 服务器作为网关或代理，但是没有及时从上游服务器收到请求。",
  505: "（HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。",
};

const responseErrorMessage: [(message: string) => boolean, (message: string) => string][] = [
  [message => message === "Network Error", () => "后端接口连接异常（网络链接异常）"],
  [message => message.includes("timeout"), () => "系统接口请求超时"],
  [
    message => message.includes("Request failed with status code"),
    message => `系统接口${message.slice(message.length - 3)}异常`,
  ],
];

// 响应拦截器 -- 错误拦截器
export function responseError(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => {
      const code = response.status;
      if ((code >= 200 && code < 300) || code === 304)
        return Promise.resolve(response);
      else
        return Promise.reject(response);
    },
    (error) => {
      // 取消请求 || 存在响应结果
      // if (error?.code === "ERR_CANCELED" || !error.response.data)
      //   return;
      if (axios.isCancel(error))
        return;

      if (error.response) {
        const status: number = error.response.status;
        const msg = `${status}：${errorStatusMap[status] || "未知错误"}`;
        Message.error(msg);
      }
      else {
        let { message } = error;
        // console.log('message', message);
        const result = responseErrorMessage.find(([verify]) => verify(message));
        if (result)
          message = result[1](message);
        Message.error(message);
      }
      return Promise.reject(error);
    },
  );
}
