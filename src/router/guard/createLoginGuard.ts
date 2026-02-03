import type { Router } from "vue-router";

// 登录守卫 - 已禁用
export function createLoginGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    window?.$message?.destroy?.();
    return true;
  });
}
