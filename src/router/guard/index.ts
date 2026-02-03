import type { Router } from "vue-router";
import { createPermissionGuard } from "@/router/guard/createPermissionGuard.ts";
import { createLoginGuard } from "./createLoginGuard";

export function setupGuards(router: Router) {
  createLoginGuard(router);
  createPermissionGuard(router);
}
