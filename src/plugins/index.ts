import type { App } from "vue";
import { setupAntd } from "@/plugins/antd";
import { setupDayjs } from "@/plugins/dayjs";
import { setupECharts } from "@/plugins/echarts";
import { setupI18n } from "@/plugins/i18n";
import { setupLodash } from "@/plugins/lodash";

export function setupPlugins(app: App) {
  return [setupI18n, setupDayjs, setupLodash, setupAntd, setupECharts]
    .reduce((app, plugin) => app.use(plugin), app);
}
