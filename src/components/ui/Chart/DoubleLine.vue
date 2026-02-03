<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useDataSlice } from "@/hooks";

defineOptions({ name: "DoubleLine", inheritAttrs: false });

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
    grid: { left: 10, right: 5, bottom: 0, top: 40, containLabel: true },
    color: ["#D45F5F", "#FFFFFF"],
    tooltip: { trigger: "axis", axisPointer: { type: "line" } },
    xAxis: { type: "category", data: category },
    yAxis: { type: "value", name: unit, nameTextStyle: { align: "right", padding: [0, 5, 0, 0] } },
    legend: {
      top: 10,
      left: "35%",
      data: [
        { name: legend[0], itemStyle: { color: "#D45F5F", borderWidth: 0 } },
        { name: legend[1], itemStyle: { color: "#FFFFFF", borderWidth: 0 } },
      ],
    },
    series: [
      {
        name: legend[0],
        data: values,
        type: "line",
        lineStyle: { color: "#D45F5F" },
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "#FFB1B1",
          borderColor: "#d45f5f66",
          borderWidth: 4,
        },
      },
      {
        name: legend[1],
        data: values2,
        type: "line",
        lineStyle: { color: "#FFFFFF" },
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "#FFFFFF",
          borderColor: "#FFFFFF66",
          borderWidth: 4,
        },
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
