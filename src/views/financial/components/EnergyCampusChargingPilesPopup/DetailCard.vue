<script setup lang="ts">
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "DetailCard", inheritAttrs: false });
const { label, value, unit, color } = defineProps<{
  label: string;
  value: number;
  unit: string;
  color: "red" | "yellow";
}>();
</script>

<template>
  <div :class="cn('detail-card w-[110px] flex flex-col', color)">
    <span
      :class="cn(
        'detail-card-label bg-gradient-to-b to-white bg-clip-text text-transparent',
        'text-[14px] font-text-medium border-l-2 pl-1.5',
        'leading-none',
        color === 'red' ? 'from-[#FFC2C2] border-[#D45F5F]' : 'from-[#F7C998] border-[#F7C998]',
      )">
      {{ label }}
    </span>
    <div class="ml-2 mt-2 h-[72px] w-[94px] flex flex-col items-center justify-center">
      <span class="detail-card-value text-[18px] leading-none font-number">{{ numberToThousands(value) }}</span>
      <span class="detail-card-unit text-[12px] text-white/60">({{ unit }})</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-card {
  background-size: 92px 74px;
  background-position: center bottom;
  background-repeat: no-repeat;
  &.red {
    background-image: url("@/assets/images_new/value-bg-red.png");
  }
  &.yellow {
    background-image: url("@/assets/images_new/value-bg-yellow.png");
  }
}
</style>
