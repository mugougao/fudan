<script setup lang="ts">
import { cn, numberToCss } from "@/utils";

defineOptions({ name: "LegendPanel", inheritAttrs: false });
const { title = "图例", width = 180 } = defineProps<{
  title?: string;
  width?: string | number;
}>();
</script>

<template>
  <section
    :class="cn('legend-panel', $attrs.class ?? '')"
    :style="{ width: numberToCss(width) }">
    <header class="legend-panel-header flex items-center px-3 py-1.5 text-[14px] text-white font-text-medium">
      <slot name="title">
        <span> {{ title }}</span>
      </slot>
    </header>
    <main class="legend-panel-main p-1 text-[12px]">
      <slot />
    </main>
  </section>
</template>

<style scoped lang="scss">
.legend-panel {
  background:
    linear-gradient(to right, transparent, #fff, transparent) no-repeat left top / 100% 1px,
    linear-gradient(to right, transparent, #fff, transparent) no-repeat left bottom / 100% 1px,
    rgba(#000a17, 0.6);
  backdrop-filter: blur(6px);

  .legend-panel-main {
    background: linear-gradient(to right, transparent, #fff, transparent) no-repeat left top / 100% 1px;
  }
}
</style>
