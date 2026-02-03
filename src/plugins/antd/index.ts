import type { App } from "vue";
// import 'ant-design-vue/dist/reset.css';
import Antd from "ant-design-vue";

export function setupAntd(app: App) {
  app.use(Antd);
  return app;
}
