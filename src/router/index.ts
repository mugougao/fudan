import type { App } from "vue";
import { createRouter, createWebHashHistory, type Router } from "vue-router";
import { setupGuards } from "@/router/guard";
import { routes } from "./routes";

const router: Router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export function setupRouter(app: App) {
  setupGuards(router);
  return app.use(router);
}

export default router;
