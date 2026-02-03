<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useDataSlice } from "@/hooks";
import { createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "SmoothDoubleLine", inheritAttrs: false });

const { data, legend, unit, mergeOption } = defineProps<{
  data: { name: string; value1: number; value2: number }[];
  legend: string[];
  unit: string;
  mergeOption?: (option: EChartsOption) => EChartsOption;
}>();

const { displayData, sliderProps } = useDataSlice(() => [...data].reverse(), 7, true);

const option = computed(() => {
  const category = displayData.value.map(item => item.name);
  const values = displayData.value.map(item => item.value1);
  const values2 = displayData.value.map(item => item.value2);

  return {
    color: ["#CC1A1A", "#FFFFFF"],
    grid: { left: 10, right: 15, bottom: 0, top: 40, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "line" }, valueFormatter: (value: number) => `${value} ${unit}` },
    xAxis: { type: "category", boundaryGap: false, data: category },
    yAxis: { type: "value", name: unit, nameTextStyle: { padding: [0, 5, 0, 0], align: "right" } },
    legend: { top: 10, left: "35%", data: legend },
    series: [
      {
        name: legend[0],
        data: values,
        type: "line",
        symbol: "none",
        smooth: true,
        lineStyle: {
          color: createEChartsLinearGradient(
            [
              { color: "#CC1A1A00", offset: 0 },
              { color: "#CC1A1A", offset: 0.1 },
              { color: "#CC1A1A", offset: 0.9 },
              { color: "#CC1A1A00", offset: 0 },
            ],
            [0, 0, 1, 0],
          ),
          width: 1,
        },
        areaStyle: { color: createEChartsLinearGradient(["#CC1A1A66", "rgba(0,0,0,0)"]) },
      },
      {
        name: legend[1],
        data: values2,
        type: "line",
        symbol: "none",
        smooth: true,
        lineStyle: {
          color: createEChartsLinearGradient(
            [
              { color: "#FFFFFF00", offset: 0 },
              { color: "#FFFFFF", offset: 0.1 },
              { color: "#FFFFFF", offset: 0.9 },
              { color: "#FFFFFF00", offset: 0 },
            ],
            [0, 0, 1, 0],
          ),
          width: 1,
        },
        areaStyle: { color: createEChartsLinearGradient(["#FFFFFF66", "rgba(0,0,0,0)"]) },
      },
    ],
  } as EChartsOption;
});

const resultOption = computed(() => {
  if (mergeOption) return mergeOption(option.value);
  return option.value;
});
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-auto overflow-hidden">
      <RenderEchart :option="resultOption" renderer="canvas" :is-empty="!data.length" />
    </div>
    <div v-if="data?.length && data.length > 8" class="shrink-0">
      <CustomSlider v-bind="sliderProps" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
