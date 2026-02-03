import type { Router } from "vue-router";
import { pick } from "lodash";
import { asyncRoutes } from "@/router/routes/asyncRoutes.ts";
import { addAsyncRoutes } from "@/router/utils.ts";
import { useUserStore } from "@/stores/user.ts";

// 权限路由守卫 - 已禁用权限验证
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore();
    if (userStore.addAsyncRouted) return true;
    addAsyncRoutes(asyncRoutes, []); // 传递空权限列表，addAsyncRoutes 已禁用过滤
    userStore.setAddAsyncRouted(true);
    return true;
  });
}
