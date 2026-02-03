<script setup lang="ts">
import AntdConfig from "@/plugins/antd/AntdConfig.vue";
import { useI18nStore } from "./stores/i18n";

const i18nStore = useI18nStore();

watch(
  () => i18nStore.lang,
  async (val, oldV) => {
    await nextTick();
    // .lang-en / .lang-zhCN
    const html = document.querySelector("html");
    if (html) {
      oldV && html.classList.remove(`lang-${oldV}`);
      val && html.classList.add(`lang-${val}`);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <AntdConfig>
    <RouterView />
  </AntdConfig>
</template>
