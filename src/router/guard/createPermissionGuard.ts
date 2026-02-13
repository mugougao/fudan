import type { Router } from "vue-router";
import { asyncRoutes } from "@/router/routes/asyncRoutes.ts";
import { addAsyncRoutes } from "@/router/utils.ts";
import { useUserStore } from "@/stores/user.ts";

// 标记是否为页面刷新
let isPageRefresh = true;

// 权限路由守卫 - 已禁用权限验证
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    // 页面刷新时，重定向到 /campusStyle
    if (isPageRefresh && to.path !== "/campusStyle") {
      console.log("🔄 [路由守卫] 检测到页面刷新，重定向到 /campusStyle");
      isPageRefresh = false;
      next({ path: "/campusStyle", replace: true });
      return;
    }

    // 标记已经不是页面刷新了
    isPageRefresh = false;

    if (!userStore.addAsyncRouted) {
      addAsyncRoutes(asyncRoutes, []);
      userStore.setAddAsyncRouted(true);

      next({ ...to, replace: true });
      return;
    }

    next();
  });
}
