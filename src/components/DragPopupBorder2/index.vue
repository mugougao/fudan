<script setup lang="ts">
import type { ClassValue } from "clsx";
import { nanoid } from "nanoid";
import { cn, numberToCss } from "@/utils";

defineOptions({ name: "DragPopupBorder2", inheritAttrs: true });

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
  <section ref="container" :class="cn('drag-popup-border-2 relative', props.class)" :style="sizeStyle">
    <div
      class="pointer-events-none absolute inset-2px bg-[#000a17]/60 backdrop-blur" :style="{
        clipPath: `url(#${customClipId})`,
        width: numberToCss(width - 4),
        height: numberToCss(height - 4) }" />
    <svg
      class="absolute inset-2px"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1"
      :width="Math.max(width - 4, 1)" :height="Math.max(height - 4, 1)" :viewBox="`0 0 ${Math.max(width - 4, 1)} ${Math.max(height - 4, 1)}`">
      <defs>
        <clipPath :id="customClipId">
          <path
            :d="`M 0 0 L 0 ${height} L ${width - 4} ${height - 4} L ${width - 4} 12 L ${width - 4 - 12} 0 L 0 0 Z`" />
        </clipPath>
      </defs>
      <g>
        <path
          :d="`M 0 0 L 0 ${height} L ${width - 4} ${height - 4} L ${width - 4} 12 L ${width - 4 - 12} 0 L 0 0 Z`"
          fill-rule="evenodd" fill="#00000000" fill-opacity="1" stroke="#FFFFFF4d" stroke-width="2" />
      </g>
    </svg>
    <div :style="{ height: numberToCss(props.height || 'auto'), clipPath: `url(#${customClipId})` }">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.drag-popup-border-2 {
  // border: 1px red solid;
  background:
    linear-gradient(to right, #eabc8b, #eabc8b) no-repeat left top/14px 2px,
    linear-gradient(to right, #eabc8b, #eabc8b) no-repeat left top/2px 14px,
    linear-gradient(to right, #eabc8b, #eabc8b) no-repeat left bottom/14px 2px,
    linear-gradient(to right, #eabc8b, #eabc8b) no-repeat left bottom/2px 14px,
    linear-gradient(to right, #eabc8b, #eabc8b) no-repeat right bottom/14px 2px,
    linear-gradient(to right, #eabc8b, #eabc8b) no-repeat right bottom/2px 14px,
    linear-gradient(-135deg, #eabc8b, #eabc8b 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)) no-repeat calc(100% - 2px)
      3px/9px 9px,
    linear-gradient(to right, #cc1a1a, #cc1a1a) no-repeat left 20px/2px 14px;
}
</style>
