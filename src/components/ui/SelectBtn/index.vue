<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "SelectBtn", inheritAttrs: false });

const modelValue = defineModel("modelValue", { default: false });
</script>

<template>
  <button
    :class="cn(
      'select-btn ml-3 px-2 py-0.5 text-[12px] -skew-x-40',
      $attrs.class ?? '',
      modelValue && 'active',
    )"
    @click="modelValue = !modelValue">
    <span class="block skew-x-40">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
.select-btn {
  background:
    linear-gradient(to top, #ffe5e5, #ffe5e5) no-repeat left bottom / 100% 1px,
    linear-gradient(to top, #ffe5e5, rgba(#ffe5e5, 0)) no-repeat left top / 1px 100%,
    linear-gradient(to top, #ffe5e5, rgba(#ffe5e5, 0)) no-repeat right top / 1px 100%,
    linear-gradient(to top, #a55e5e, rgba(#a55e5e, 0)) no-repeat left top / 100% 100%;

  &.active {
    background:
      linear-gradient(to top, #cc1a1a, #cc1a1a) no-repeat left bottom / 100% 1px,
      linear-gradient(to top, #cc1a1a, rgba(#cc1a1a, 0)) no-repeat left top / 1px 100%,
      linear-gradient(to top, #cc1a1a, rgba(#cc1a1a, 0)) no-repeat right top / 1px 100%,
      linear-gradient(to top, rgba(#c62323, 0.5), rgba(#c62323, 0)) no-repeat left top / 100% 100%;
  }
}
</style>
