<script setup lang="ts">
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "RepairOverview", inheritAttrs: false });

const state = {
  total: 123456,
  year: 123456,
  ing: 123456,
};
</script>

<template>
  <div :class="cn('repair-overview flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.electricityUseOverview" />
    <div class="chart-box flex flex-auto items-start justify-between px-2">
      <div class="mt-8 flex flex-col">
        <span class="mb-1 text-[12px] font-text-medium">日常修缮</span>
        <span>
          <span class="text-[16px] font-number">1234</span>
          <span class="ml-1 text-[12px] text-[#C6C6C6]">个</span>
        </span>
        <span>
          <span class="text-[16px] font-number">1234</span>
          <span class="ml-1 text-[12px] text-[#C6C6C6]">万元</span>
        </span>
      </div>
      <div class="repair-overview-total mt-5 size-[100px] flex flex-col shrink-0 items-center justify-center text-[12px]">
        <span class="text-[22px] font-number">{{ numberToThousands(state.total) }}</span>
        <span class="text-white/60">(万元)</span>
        <i class="i-ri-arrow-up-s-fill mt-[-5px]" />
        <span class="mt-[-5px]">{{ $t('financial.index.totalRepairAmount') }}</span>
      </div>
      <div class="mt-8 flex flex-col items-end">
        <span class="mb-1 text-[12px] font-text-medium">规模修缮</span>
        <span>
          <span class="text-[16px] font-number">1234</span>
          <span class="ml-1 text-[12px] text-[#C6C6C6]">个</span>
        </span>
        <span>
          <span class="text-[16px] font-number">1234</span>
          <span class="ml-1 text-[12px] text-[#C6C6C6]">万元</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.repair-overview {
  .chart-box {
    background: url("@/assets/images_new/count-bg2.png") no-repeat center;
    background-size: contain;
  }
}
</style>
