import type { App } from "vue";
import * as echarts from "echarts";
import { defaultTheme } from "./defaultTheme";

export function setupECharts(app: App) {
  echarts.registerTheme(...defaultTheme);
  app.config.globalProperties.$echarts = echarts;
  return app;
}
