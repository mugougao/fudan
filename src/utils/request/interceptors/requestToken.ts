import type { AxiosInstance } from "axios";
import router from "@/router";
import { resetRouter } from "@/router/utils.ts";
import { useUserStore } from "@/stores/user.ts";

/**
 *  请求 token 拦截器
 * @param axiosInstance
 */
export function requestToken(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if (userStore.token)
      config.headers.token = userStore.token;
    return config;
  });
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.data.code === 40001) {
        const userStore = useUserStore();
        userStore.restUserStore();
        resetRouter();
        window.$message.destroy();
        router.push("/login")
          .then(() => {
            window.$message.warning("登录信息已过期，请重新登录");
          });
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}
