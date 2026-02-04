import type { Router } from "vue-router";
import { pick } from "lodash";
import { asyncRoutes } from "@/router/routes/asyncRoutes.ts";
import { addAsyncRoutes } from "@/router/utils.ts";
import { useUserStore } from "@/stores/user.ts";

// 权限路由守卫 - 已禁用权限验证
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    // 总是添加异步路由，addAsyncRoutes 会检查避免重复添加
    addAsyncRoutes(asyncRoutes, []); // 传递空权限列表，addAsyncRoutes 已禁用过滤
    
    // 确保状态被设置（用于notFound页面等）
    if (!userStore.addAsyncRouted) {
      userStore.setAddAsyncRouted(true);
    }
    
    next();
  });
}
