import type { Dayjs } from "dayjs";
import type { App } from "vue";
import dayjs from "dayjs";
import { useI18nStore } from "@/stores/i18n.ts";
import "dayjs/locale/zh-cn";

export function dateFormat(date: string | number | Dayjs, template: string = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(date).isValid() ? dayjs(date).format(template) : undefined;
}

export function setupDayjs(app: App) {
  app.config.globalProperties.$dayjs = dayjs;
  app.config.globalProperties.$dateFormat = dateFormat;
  const i18nStore = useI18nStore();
  watch(
    () => i18nStore.lang,
    (newVal) => {
      dayjs.locale(newVal === "zhCN" ? "zh-cn" : "en");
    },
    { immediate: true },
  );
  return app;
}
