<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "EquipmentRepair" });

const data = Array.from({ length: 5 }).map((_, i) => {
  return {
    name: `房间${i + 1}`,
    value: i + 2,
  };
});

const option = computed(() => {
  const category = data.map(item => item.name);
  const value = data.map(item => item.value);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: ([{ value, marker, name }]) => `${name}<br><span class="wh-10px rounded-full inline-block bg-#5FBCFF mr-5px"></span> ${value}`,
    },
    grid: { top: 25, left: 60, right: 20, bottom: 20 },
    xAxis: {
      type: "value",
      position: "top",
      axisLabel: { fontSize: 18, fontFamily: "D-DIN", color: "#C1C2C7" },
      splitLine: { show: true, lineStyle: { color: "#363940" },
      },
    },
    yAxis: {
      type: "category",
      data: category,
      boundaryGap: false,
      axisLine: { show: false },
      axisLabel: { fontSize: 16 },
      splitLine: { show: true, lineStyle: { color: "#494A4B" } },
    },
    series: [
      {
        data: value,
        type: "bar",
        barWidth: 6,
        label: { show: true, position: "right", color: "#fff", fontSize: 18 },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "rgba(24, 134, 213, 0)" },
              { offset: 0.5, color: "#5FBCFF" },
              { offset: 0.8, color: "#FFFFFF" },
              { offset: 1, color: "#FFFFFF" },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  } as unknown as EChartsOption;
});

const chartEl = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartEl, option);
</script>

<template>
  <BoxPanel class="row-span-8" title="设备报修">
    <template #extra>
      <span class="flex items-center gap-2 leading-none">
        <span class="text-16px tracking-widest">
          总报修次数
        </span>
        <span class="text-28px text-#61BDFF font-number">10</span>
      </span>
    </template>
    <div ref="chart" class="wh-full" />
  </BoxPanel>
</template>

<style scoped>
</style>
