import DisableDevtool from "disable-devtool";
import { createApp } from "vue";
import { setupPlugins } from "@/plugins";
import { setupRouter } from "@/router";
import { setupPinia } from "@/stores";

import App from "./App.vue";
import { isDev } from "./utils/env";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import "@/assets/styles/index.scss";
import "@/assets/iconfont/iconfont.css";
import "animate.css";

function bootstrap() {
  if (!isDev) {
    DisableDevtool({
      md5: "6d4f76e03aae072873ec4ef4b238f2eb",
      rewriteHTML: `<h1>This website has been disabled</h1>`,
    });
  }
  const app = createApp(App);

  app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info);
  };

  [setupRouter, setupPinia, setupPlugins]
    .reduce(
      (app, plugin) => app.use(plugin),
      app,
    )
    .mount("#app");
}

bootstrap();
