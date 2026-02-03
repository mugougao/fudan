<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useI18n } from "vue-i18n";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "InstrumentDistribution" });

const { devicesNumber, amount } = defineProps<IProps>();
export interface IProps {
  devicesNumber: { name: string;value: number }[];
  amount: { name: string;value: number }[];
}

const { t } = useI18n();
const activeType = ref(0);
const radioOptions = computed(() => {
  return [
    { label: t("largeInstruments.device"), value: 0 },
    { label: t("largeInstruments.amount"), value: 1 },
  ];
});

const state = computed(() => {
  return activeType.value === 0 ? devicesNumber : amount;
});

const options = computed(() => {
  const category = state.value.map(item => item.name);
  const values = state.value.map(item => item.value);

  return {
    tooltip: { trigger: "axis" },
    grid: { bottom: 30, right: 20, left: 60, top: 30 },
    xAxis: { type: "category", data: category },
    yAxis: [
      { type: "value", name: activeType.value === 0 ? "单位/台" : "单位/元", nameTextStyle: { fontSize: 14, padding: [0, 40, 0, 0] } },
    ],
    series: [
      {
        name: "数量",
        data: values,
        type: "bar",
        yAxisIndex: 0,
        barWidth: 16,
        tooltip: { valueFormatter: (value: number) => activeType.value === 0 ? `${value} 台` : `${value} 元` },
        itemStyle: {
          color: "#EB95674D",
          borderWidth: 1,
          borderColor: "#EB9567",
        },
        label: {
          show: true,
          distance: 2,
          position: "top",
          formatter: "",
          width: 16,
          height: 4,
          backgroundColor: "#EB9567",
        },
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLDivElement>("chartRef");
useEChartRender(chartRef, options);
</script>

<template>
  <div class="row-span-8 flex flex-col pb-5">
    <UiSubTitle title-path="largeInstruments.largeScaleInstrumentDistribution" class="shrink-0">
      <template #extra>
        <SegmentedRadioGroup v-model="activeType" :options="radioOptions" />
      </template>
    </UiSubTitle>

    <div class="mt-2 flex-auto overflow-hidden">
      <UiChartBar :data="state" legend="数量" :unit="activeType === 0 ? '台' : '元'" />
    </div>
  </div>
</template>

<style scoped>

</style>
