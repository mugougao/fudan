<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";
import { useDataSlice } from "@/hooks";
import { createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "LineChart", inheritAttrs: false });

const { data, unit, mergeOption, color = "red", size = 7 } = defineProps<{
  data: { name: string; value: number }[];
  unit: string;
  mergeOption?: (option: EChartsOption) => EChartsOption;
  color?: "red" | "yellow" | "blue" | "purple" | "green";
  size?: number;
}>();

const { displayData, sliderProps } = useDataSlice(() => data, size, true);

const colorOptionMap = {
  red: {
    color: ["#CC1A1A"],
    series: [
      {
        lineStyle: { color: "#CC1A1A" },
        areaStyle: {
          color: createEChartsLinearGradient([`#CC1A1A66`, "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  },
  yellow: {
    color: ["#EABC8B"],
    series: [
      {
        lineStyle: { color: "#EABC8B" },
        areaStyle: {
          color: createEChartsLinearGradient([`#EABC8B66`, "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  },
  blue: {
    color: ["#69B6E2"],
    series: [
      {
        lineStyle: { color: "#69B6E2" },
        areaStyle: {
          color: createEChartsLinearGradient([`#69B6E266`, "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  },
  purple: {
    color: ["#778BF1"],
    series: [
      {
        lineStyle: { color: "#778BF1" },
        areaStyle: {
          color: createEChartsLinearGradient([`#778BF166`, "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  },
  green: {
    color: ["#55FFDA"],
    series: [
      {
        lineStyle: { color: "#55FFDA" },
        areaStyle: {
          color: createEChartsLinearGradient([`#55FFDA66`, "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  },
};

const option = computed(() => {
  const result = {
    color: ["#CC1A1A"],
    grid: { left: 5, right: 15, bottom: 0, top: 30, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "line" }, valueFormatter: (value: number) => `${value} ${unit}` },
    xAxis: {
      type: "category",
      data: (displayData.value || []).map(item => item.name),
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
      name: `单位:${unit}`,
      nameTextStyle: { fontSize: 12, padding: [0, 0, 0, 20] },
    },
    series: [
      {
        data: (displayData.value || []).map(item => item.value),
        type: "line",
        symbol: "none",
        smooth: true,
        lineStyle: { width: 1, color: "#CC1A1A" },
        areaStyle: {
          color: createEChartsLinearGradient([`#CC1A1A66`, "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  } as EChartsOption;

  return merge(
    result,
    colorOptionMap[color] || colorOptionMap.red,
  );
});

const resultOption = computed(() => {
  if (mergeOption) return mergeOption(option.value);
  return option.value;
});
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-auto overflow-hidden">
      <RenderEchart :option="resultOption" renderer="svg" :is-empty="!data.length" />
    </div>
    <div v-if="data?.length && data.length > 8" class="shrink-0">
      <CustomSlider v-bind="sliderProps" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
