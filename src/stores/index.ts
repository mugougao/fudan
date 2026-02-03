import type { App } from "vue";
import { createPinia } from "pinia";

export function setupPinia(app: App) {
  const store = createPinia();
  return app.use(store);
}
