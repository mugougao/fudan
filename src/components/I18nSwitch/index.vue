<script setup lang="ts">
import { useI18nStore } from "@/stores/i18n.ts";

defineOptions({ name: "I18nSwitch" });

const i18nStore = useI18nStore();

const value = computed({
  get: () => i18nStore.lang == "zhCN",
  set: val => i18nStore.setLang(!val ? "en" : "zhCN"),
});
</script>

<template>
  <label class="i18n-switch relative flex-center cursor-pointer select-none gap-2 rounded-full bg-#0F84CD px-5px py-2px text-white has-[input[type=checkbox]:checked]:bg-#CE4242">
    <input v-model="value" type="checkbox" class="hidden">
    <span class="mr-1 w-18px flex-center" :class="!value && 'invisible'">中</span>
    <span class="w-18px flex-center" :class="value && 'invisible'">EN</span>
  </label>
</template>

<style scoped lang="scss">
.i18n-switch {
  &:after {
    content: "";
    @apply absolute wh-18px rounded-full bg-white transition-all duration-300;
    left: 5px;
  }
  &:has(input[type="checkbox"]:checked) {
    &:after {
      left: calc(100% - 23px);
    }
  }
}
</style>
