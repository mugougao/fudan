<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender } from "@/hooks";
import { createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "ChainLineChart", inheritAttrs: false });

const { data = [], names = [] } = defineProps<{
  data?: Array<{ name: string; value1: number; value2: number }>;
  names: [string, string];
}>();

const options = computed(() => {
  const category: string[] = [];
  const values1: number[] = [];
  const values2: number[] = [];
  data.forEach(({ name, value1, value2 }) => {
    category.push(name);
    values1.push(value1);
    values2.push(value2);
  });

  return {
    color: ["#2FB3FF", "#71F0A2"],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      valueFormatter: val => `${val}人`,
    },
    grid: { left: 15, right: 20, bottom: 5, top: 40, containLabel: true },
    xAxis: { type: "category", data: category, boundaryGap: false, axisLabel: { interval: "auto" }, axisLine: { show: false } },
    yAxis: {
      type: "value",
      name: "单位/人",
      nameTextStyle: { fontSize: 14, fontFamily: "AlibabaPuHuiTi-3", padding: [0, 40, 0, 0] },
      splitLine: { show: true, lineStyle: { color: "rgba(130,144,157,0.5)", type: [2, 2] } },
    },
    series: [
      {
        name: names[0],
        data: values1,
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 3, shadowColor: "rgba(0,0,0,0.5)", shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 2 },
        areaStyle: {
          color: createEChartsLinearGradient(
            [
              { color: "#2FDAFF", offset: 0 },
              { color: "#2FDAFF", offset: 0.5 },
              { color: "transparent", offset: 1 },
            ],
            [0, 0, 0, 1],
          ),
        },
        z: 1,
      },
      {
        name: names[1],
        data: values2,
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 3, shadowColor: "rgba(0,0,0,0.5)", shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 2 },
        areaStyle: {
          color: createEChartsLinearGradient(
            [
              { color: "#63D395", offset: 0 },
              { color: "#63D395", offset: 0.5 },
              { color: "transparent", offset: 1 },
            ],
            [0, 0, 0, 1],
          ),
        },
        z: 0,
      },
    ],
  } as EChartsOption;
});

const chartRef = useTemplateRef<HTMLDivElement>("chartRef");
useEChartRender(chartRef, options);
</script>

<template>
  <div class="h-[180px]">
    <div ref="chartRef" class="h-full" />
  </div>
</template>

<style scoped lang="scss">

</style>
