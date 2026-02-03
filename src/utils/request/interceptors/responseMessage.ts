import type { AxiosInstance } from "axios";
import { message as Message } from "ant-design-vue";
import get from "lodash/get";

export function responseMessage(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => {
      const code = response.status;
      if ((code >= 200 && code < 300) || code === 304) {
        const { message = true, messagePath = "message", messageType = "success" } = response.config.custom || {};
        const isMessage = typeof message === "function" ? message(response.data) : Boolean(message);
        const messageContent = typeof messagePath === "function" ? messagePath(response.data) : get(response.data, messagePath, undefined);
        const _messageType = typeof messageType === "function" ? messageType(response.data) : messageType;
        isMessage && !!messageContent && Message.open({ content: messageContent, type: _messageType });
      }
      return response;
    },
    error => Promise.reject(error),
  );
}
