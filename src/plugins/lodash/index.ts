import type { App } from "vue";
import _ from "lodash";

export function setupLodash(app: App) {
  app.config.globalProperties.$_ = _;
  return app;
}
