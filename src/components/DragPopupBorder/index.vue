<script setup lang="ts">
import type { ClassValue } from "clsx";
import { nanoid } from "nanoid";
import { cn, numberToCss } from "@/utils";

defineOptions({ name: "DragPopupBorder", inheritAttrs: true });

const props = defineProps<{
  class?: ClassValue;
  width: number | string;
  height?: number | string;
}>();

const customClipId = nanoid();

const sizeStyle = computed(() => {
  const { width, height } = props;
  return { width: numberToCss(width), height: numberToCss(height || "auto") };
});

const containerEL = useTemplateRef<HTMLElement>("container");

const { width, height } = useElementSize(containerEL);
</script>

<template>
  <section ref="container" :class="cn('drag-popup-border relative', props.class)" :style="sizeStyle">
    <div
      class="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur" :style="{
        clipPath: `url(#${customClipId})`,
        boxShadow: 'inset 0 0 20px 5px rgba(255, 109, 124, 0.6)',
        width: numberToCss(width),
        height: numberToCss(height) }" />
    <svg
      class="absolute inset-0"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1"
      :width="Math.max(width, 1)" :height="Math.max(height, 1)" :viewBox="`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`">
      <defs>
        <clipPath :id="customClipId">
          <path
            :d="`M 0.5 11.5 L 0.5 ${height - 0.5} L ${width - 16} ${height - 0.5} L ${width - 0.5} ${height - 17} L ${width - 0.5} 11.5 L ${width - 16} 1 L ${width - 83.5} 1 L ${width - 93.5} 7 L ${width - 186.5} 7 L ${width - 195} 1 L 13.5 1 L 0.5 11.5 Z`" />
        </clipPath>
      </defs>
      <g>
        <path
          :d="`M ${width - 186.5} 6 L ${width - 195} 0 L 13 0 L 0 11 L 0 ${height} L ${width - 16} ${height} L ${width} ${height - 17} L ${width} 11 L ${width - 16} 0 L ${width - 84} 0 L ${width - 94} 6 L ${width - 186.5} 6 Z M ${width - 195} 1 L 13.5 1 L 1 11.5 L 1 ${height - 1} L ${width - 16.5} ${height - 1} L ${width - 1} ${height - 17.5} L ${width - 1} 11.5 L ${width - 16.5} 1 L ${width - 83.5} 1 L ${width - 93.5} 7 L ${width - 186.5} 7 L ${width - 195} 1 Z`"
          fill-rule="evenodd" fill="#FF8499" fill-opacity="1" />
      </g>
    </svg>
    <img src="@/assets/images/commons/decoration.png" alt="decoration" class="absolute right-86px top-0 h-5px w-105px">
    <div :style="{ height: numberToCss(props.height || 'auto'), clipPath: `url(#${customClipId})` }">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">

</style>
