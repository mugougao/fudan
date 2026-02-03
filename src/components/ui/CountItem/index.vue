<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "CountItem", inheritAttrs: false });

const { icon, name, value, unit, type = "red", tipText, valueVertical = false } = defineProps<{
  icon?: string;
  name: string;
  value?: number | string;
  unit?: string;
  type?: "red" | "yellow" | "gray";
  tipText?: string;
  valueVertical?: boolean;
}>();
</script>

<template>
  <div
    class="count-item flex items-center" :class="cn(
      'count-item flex items-center',
      type,
      $attrs.class ?? 0,
    )">
    <span class="icon ml-1 block size-[60px]">
      <slot name="icon">
        <i class="ml-[26px] mt-[15px]" :class="icon" />
      </slot>
    </span>
    <span class="ml-2 flex flex-col">
      <span class="flex items-center">
        <span class="text-[14px] text-white/80">{{ name }}</span>
        <HelpTipIcon v-if="tipText" :tip="tipText" />
      </span>
      <span
        :class="cn(
          'text-[18px] text-white font-number',
          valueVertical && 'flex flex-col',
        )">
        <span class="empty-number">{{ value }}</span>
        <span v-if="unit" class="ml-0.5 text-[12px] text-white/80 font-text">{{ unit }}</span>
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.count-item {
  background-size: 131px 143px;
  background-repeat: no-repeat;
  background-position: -35px center;
  &.red {
    background-image: url("@/assets/images_new/icon-bg-main.png");
  }
  &.yellow {
    background-image: url("@/assets/images_new/icon-bg-warn.png");
  }
  &.gray {
    background-image: url("@/assets/images_new/icon-bg-info.png");
  }
}
</style>
