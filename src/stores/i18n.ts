import { defineStore } from "pinia";

export const useI18nStore = defineStore("i18n", () => {
  const lang = useLocalStorage<"en" | "zhCN">("lang", "zhCN");
  const setLang = (val: "en" | "zhCN") => {
    lang.value = val;
  };

  const isChinese = computed(() => lang.value === "zhCN");
  const isEnglish = computed(() => lang.value === "en");

  return { lang, setLang, isChinese, isEnglish };
});
