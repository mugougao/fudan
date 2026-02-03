<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";

defineOptions({ name: "ConsumeEnergy" });

const {
  energyPurchaseData = { count: 0, data: [] },
} = defineProps<{
  energyPurchaseData?: {
    count: number;
    data: { name: string; value: number }[];
  };
}>();

// 今日用电/今日购电
const countNumberFormat = computed<string>(() => {
  const _countNumber = (energyPurchaseData?.count || 0).toString();
  if (_countNumber.length < 4) {
    const span = Array.from({ length: 4 - _countNumber.length }).fill(0).join("");
    return `${span}${_countNumber}`;
  }
  return _countNumber;
});

const chartData = computed(() => (energyPurchaseData?.data || []).map(({ name, value }) => ({ name: `${Number(name)}月`, value })));

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      series: [
        { name: "月度购电" },
      ],
    },
  );
}
</script>

<template>
  <UiBoxPanel
    class="row-span-8"
    title-path="dormitory.area.electricityPurchases"
    content-class-name="flex flex-col">
    <div class="today mb-2 flex-center shrink-0 whitespace-nowrap">
      <span class="text-[14px] text-white">{{ $t('dormitory.area.yesterdayBuyPower') }}:</span>
      <span
        v-for="(num, index) in countNumberFormat" :key="`${num}-${index}`"
        class="number-span ml-1 h-[32px] w-[24px] flex-center">
        <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[28px] text-transparent font-number">{{ num }}</span>
      </span>
      <span class="ml-1 text-[12px] text-white/60">kWh</span>
    </div>

    <div class="flex-auto overflow-hidden">
      <UiChartLine :data="chartData" unit="kWh" :merge-option="mergeOption" />
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.today span.number-span {
  background: linear-gradient(0deg, rgba(204, 26, 26, 0.06) 0%, rgba(204, 26, 26, 0.6) 100%);
  border: 1px solid rgba(192, 220, 231, 0.3);
}
</style>
