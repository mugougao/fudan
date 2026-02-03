<script setup lang="ts">
import type { EChartsOption } from "echarts";
import dayjs from "dayjs";
import { useDataSlice, useEChartRender } from "@/hooks";
import { createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "PersonnelSituationChart", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: Array<{ name: string; value: number }>;
}>();

const { displayData, sliderProps } = useDataSlice(computed(() => data || []), 14, true);

const options = computed(() => {
  const category: string[] = [];
  const values: number[] = [];
  displayData.value.forEach(({ name, value }) => {
    category.push(name);
    values.push(value);
  });

  return {
    color: ["#71F0A2"],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      valueFormatter: val => `${val}人`,
    },
    grid: { left: 35, right: 40, bottom: 5, top: 30, containLabel: true },
    xAxis: {
      type: "category",
      data: category,
      boundaryGap: true,
      axisLine: { show: false },
      axisLabel: {
        interval: 0,
        formatter: value => dayjs(value).format("YYYY/MM/DD"),
        fontSize: 12,
        rotate: 20,
      },
    },
    yAxis: {
      type: "value",
      name: "单位/人",
      nameTextStyle: { fontSize: 14, fontFamily: "AlibabaPuHuiTi-3", padding: [0, 40, 0, 0] },
      splitLine: { show: true, lineStyle: { color: "rgba(130,144,157,0.5)", type: [2, 2] } },
    },
    series: [
      {
        name: "人数",
        data: values,
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
  <CustomSlider v-if="data.length > 8" v-bind="sliderProps" />
</template>

<style scoped lang="scss">

</style>
