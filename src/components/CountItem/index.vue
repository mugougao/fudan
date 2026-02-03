<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "CountItem", inheritAttrs: false });

const { title, value, unit } = defineProps<{
  icon: string;
  title: string;
  value: string | number;
  unit: string;
  labelClassName?: string;
  valueClassName?: string;
  unitClassName?: string;
}>();
</script>

<template>
  <div class="count-item flex items-center whitespace-nowrap">
    <span class="count-item-icon-wrapper relative mr-2 block size-[48px] border border-white rounded-full">
      <svg width="48px" height="48px" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="50%" cy="50%" r="19" fill="none"
          stroke="#CBF2FF" stroke-width="1.5"
          stroke-dasharray="105 15" stroke-linecap="round" stroke-dashoffset="95" />
        <circle
          cx="75%" cy="80%" r="2" fill="#CBF2FF" />
      </svg>
      <span class="absolute left-1/2 top-0 text-[28px] text-[#C9ECFF] -translate-x-1/2">
        <i :class="icon" />
      </span>
    </span>
    <span class="count-item-content flex flex-col leading-none space-y-1.5">
      <GradientText :deg="180" :colors="['#C8D7E4', '#FFFFFF']">
        <span :class="cn('text-[18px] font-text-medium', labelClassName)">{{ title }}</span>
      </GradientText>
      <GradientText :deg="180" :colors="['#C8D7E4', '#FFFFFF']">
        <span class="flex items-baseline justify-between">
          <span :class="cn('text-[22px] font-number flex-auto text-center', valueClassName)">{{ value }}</span>
          <span :class="cn('ml-1 text-[14px]', unitClassName)">{{ unit }}</span>
        </span>
      </GradientText>
    </span>
  </div>
</template>;
