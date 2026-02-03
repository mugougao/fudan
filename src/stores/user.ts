import to from "await-to-js";
import { defineStore } from "pinia";
import { getUserPermissions } from "@/api/admin/user.ts";
import { fetchLogin, fetchThirdPartyLogin } from "@/api/login.ts";
import { asyncRoutes } from "@/router/routes/asyncRoutes.ts";
import { addAsyncRoutes } from "@/router/utils.ts";
import { env } from "@/utils/env.ts";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const userInfo = useLocalStorage<any>("userInfo", {});
    // 第三方登录 ticket
    const ticket = useLocalStorage<string>("ticket", "");
    // 系统 token
    const token = useLocalStorage<string>("token", "");
    const permissionList = useLocalStorage<string[]>("permission", []);
    async function getPermissionListAction() {
      if (!userInfo.value.id) return;
      const [err, res] = await to(getUserPermissions(userInfo.value.id));
      if (err) {
        // window.$message.error("获取权限失败");
        throw new Error("获取权限失败");
      }
      permissionList.value = (res?.resultData || [])?.map(item => item.route_url);
    }

    const addAsyncRouted = ref(false);
    function setAddAsyncRouted(val: boolean) {
      addAsyncRouted.value = val;
    }
    function setTicket(val: string) {
      ticket.value = val;
    }

    const restUserStore = () => {
      userInfo.value = {};
      token.value = "";
      ticket.value = "";
      permissionList.value = [];
      addAsyncRouted.value = false;
    };

    const loginAction = async (username: string, password: string) => {
      const [err, res] = await to(fetchLogin({ username, password }));
      if (err) {
        window.$message.error("登录失败");
        throw new Error("登录失败");
      }
      const { token: tokenVal, loginUserInfo: userInfoVal } = res?.resultData || {};
      if (!tokenVal || !userInfoVal) {
        window.$message.error("登录失败");
        throw new Error("登录失败");
      }
      token.value = tokenVal;
      userInfo.value = userInfoVal;
      // 获取权限
      await getPermissionListAction();
      addAsyncRoutes(asyncRoutes, permissionList.value);
      addAsyncRouted.value = true;
    };

    // 第三方登录
    const thirdPartyLoginAction = async (ticket: string) => {
      const [err, res] = await to(fetchThirdPartyLogin(ticket));
      if (err) {
        window.$message.error("登录失败");
        throw new Error("登录失败");
      }
      const { token: tokenVal, loginUserInfo: userInfoVal } = res?.resultData || {};
      if (!tokenVal || !userInfoVal) {
        window.$message.error("登录失败");
        throw new Error("登录失败");
      }
      token.value = tokenVal;
      userInfo.value = userInfoVal;
      await getPermissionListAction();
      addAsyncRoutes(asyncRoutes, permissionList.value);
      addAsyncRouted.value = true;
    };

    // 退出登录
    function logoutAction() {
      const _ticket = ticket.value;
      restUserStore();
      // 第三方 退出登录
      if (_ticket) {
        window.location.href = env.VITE_THIRD_PARTY_LOGOUT_URL;
      }
    }

    return {
      userInfo,
      token,
      permissionList,
      addAsyncRouted,
      setAddAsyncRouted,
      loginAction,
      thirdPartyLoginAction,
      logoutAction,
      restUserStore,
      ticket,
      setTicket,
    };
  },
);
