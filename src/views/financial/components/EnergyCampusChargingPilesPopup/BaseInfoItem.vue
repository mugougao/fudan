<script setup lang="ts">
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "BaseInfoItem", inheritAttrs: false });

const { label, value, unit, color } = defineProps<{
  label: string;
  value: number;
  unit: string;
  color: "red" | "gray";
}>();
</script>

<template>
  <div class="base-info-item" :class="cn('flex flex-1 justify-center py-4 -my-4', color)">
    <div class="base-info-item-icon relative h-[62px] w-[60px]">
      <span
        :class="cn(
          'size-[17px] rounded-full flex items-center justify-center text-[10px] font-text-bold',
          color === 'red' ? 'bg-white text-[#CC1A1A]' : 'bg-[#F37373] text-white',
        )">年</span>
      <i
        :class="cn(
          'absolute top-[15px] left-[15px] text-[18px]',
          color === 'red' ? 'i-svg-icon-raw-use' : 'i-svg-icon-raw-money-2',
        )" />
    </div>
    <div class="base-info-item-content">
      <span class="text-[14px] text-white/80">{{ label }}</span>
      <span class="flex items-baseline">
        <span class="text-[18px] font-number">
          {{ numberToThousands(value) }}
        </span>
        <span class="ml-0.5 text-[12px] text-white/80">{{ unit }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-info-item {
  background-position: -10px center;
  background-size: 131px 143px;
  background-repeat: no-repeat;
  &.red {
    background-image: url("@/assets/images_new/icon-bg-main.png");
  }

  &.gray {
    background-image: url("@/assets/images_new/icon-bg-info.png");
  }
}
</style>
