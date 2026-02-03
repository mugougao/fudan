<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { ComputedRef } from "vue";
import { merge } from "lodash";

defineOptions({ name: "ConsumeEnergy" });

const {
  energyUseData = { count: 0, data: [] },
} = defineProps<{
  energyUseData?: {
    count: number;
    data: { name: string;value: number }[];
  };
}>();

const chartData = computed(() => (energyUseData?.data || []).map(({ name, value }) => ({ name: `${Number(name)}月`, value })));

const data = computed(() => energyUseData) as ComputedRef<{ count: number; data: { name: string;value: number }[] }>;

// 今日用电/今日购电
const countNumberFormat = computed<string>(() => {
  const _countNumber = (data.value?.count || 0).toString();
  if (_countNumber.length < 4) {
    const span = Array.from({ length: 4 - _countNumber.length }).fill(0).join("");
    return `${span}${_countNumber}`;
  }
  return _countNumber;
});

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      series: [
        { name: "月度用电" },
      ],
    },
  );
}
</script>

<template>
  <UiBoxPanel
    class="row-span-8"
    title-path="dormitory.area.electricityConsumption"
    content-class-name="flex flex-col">
    <div class="today mb-2 flex-center shrink-0 whitespace-nowrap">
      <span class="text-[14px] text-white">{{ $t('dormitory.area.yesterdayUsePower') }}:</span>
      <span
        v-for="(num, index) in countNumberFormat" :key="`${num}-${index}`"
        class="number-span ml-1 h-[32px] w-[24px] flex-center">
        <span class="from-[#F7C998] to-white bg-gradient-to-b bg-clip-text text-[28px] text-transparent font-number">{{ num }}</span>
      </span>
      <span class="ml-1 text-[12px] text-white/60">kWh</span>
    </div>

    <div class="flex-auto overflow-hidden">
      <UiChartLine :data="chartData" unit="kWh" :merge-option="mergeOption" color="yellow" />
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.today span.number-span {
  background: linear-gradient(0deg, rgba(#f7c998, 0.06) 0%, rgba(#f7c998, 0.6) 100%);
  border: 1px solid rgba(#c0dce7, 0.3);
}
</style>
