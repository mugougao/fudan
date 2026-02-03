import { type App, defineComponent } from "vue";
import { createI18n, useI18n } from "vue-i18n";
import { wrapperApp } from "@/plugins/utils.ts";
import { useI18nStore } from "@/stores/i18n.ts";
import en from "./lang/en.ts";
import zhCN from "./lang/zhCN.ts";

export function setupI18n(app: App) {
  const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem("lang") || "zhCN",
    fallbackLocale: "zhCN",
    messages: { zhCN, en },
    /* datetimeFormats: {
      en: {
        short: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
        long: {
          year: "numeric",
          month: "short",
          day: "numeric",
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
        },
      },
      zhCN: {
        short: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
        long: {
          year: "numeric",
          month: "short",
          day: "numeric",
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        },
      },
    }, */
  });
  wrapperApp(
    app,
    appRender => defineComponent({
      setup() {
        const { locale } = useI18n();
        const i18nStore = useI18nStore();
        const { lang } = storeToRefs(i18nStore);
        watch(lang, newVal => (locale.value = newVal));
        return () => h(appRender);
      },
    }),
  );
  return app.use(i18n);
}
