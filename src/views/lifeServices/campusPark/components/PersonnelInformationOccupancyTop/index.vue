<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { createEChartsLinearGradient, numberToThousands } from "@/utils";

defineOptions({ name: "PersonnelInformationOccupancyTop" });

const { data = [], type } = defineProps<{
  data: { name: string;value: number }[];
  type: "1" | "2";
}>();

const option = computed(() => {
  const dataSort = data.slice(0, 5).sort((a, b) => a.value - b.value);
  const serieData = dataSort.map(item => item.value);

  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${value}人` },
    grid: { left: 10, right: 10, bottom: 0, top: 10, containLabel: true },
    xAxis: { type: "value", axisLine: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    yAxis: {
      type: "category",
      data: dataSort.map(item => item.name),
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    series: [
      {
        z: 2,
        name: "人数",
        type: "bar",
        barWidth: 4,
        data: serieData,
        showBackground: true,
        backgroundStyle: { color: "rgba(225,225,225,0.1)" },
        itemStyle: {
          color: createEChartsLinearGradient(["#CC1A1A1A", "#CC1A1ACC"], [0, 0, 1, 0]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        label: {
          show: true,
          formatter: "{dot|}",
          position: "right",
          offset: [-6, 0],
          rich: {
            dot: {
              width: 6,
              height: 6,
              backgroundColor: "#fff",
              borderRadius: 3,
            },
          },
        },
      },
      {
        z: 1,
        type: "bar",
        barWidth: 4,
        data: serieData,
        barGap: "-100%",
        itemStyle: { color: "rgba(255,255,255,0)" },
        tooltip: { show: false },
        label: {
          show: true,
          formatter: ({ name, dataIndex }) => `{name|TOP${serieData.length - dataIndex} ${name}}`,
          position: "left",
          offset: [125, -12],
          rich: {
            name: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              width: 120,
            },
          },
        },
      },
      {
        z: 1,
        type: "bar",
        barWidth: 4,
        data: serieData,
        barGap: "-100%",
        itemStyle: { color: "rgba(255,255,255,0)" },
        tooltip: { show: false },
        label: {
          show: true,
          formatter: ({ value }) => `{name|${numberToThousands(value as number)}人}`,
          position: "left",
          offset: [290, -15],
          rich: {
            name: {
              color: "#fff",
              fontSize: 14,
              fontFamily: "D-DIN",
              width: 80,
              align: "right",
            },
          },
        },
      },
    ],
  } as EChartsOption;
});

const option2 = computed(() => {
  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${value}人` },
    grid: { left: 10, right: 20, bottom: 6, top: 20, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map(item => item.name),
    },
    yAxis: [{ type: "value" }],
    series: [
      {
        name: "人数",
        type: "bar",
        barWidth: 4,
        data: data.map(item => item.value),
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: createEChartsLinearGradient(["#CC1A1A1A", "#CC1A1ACC"], [0, 0, 1, 0]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        label: {
          show: true,
          width: 6,
          height: 6,
          borderRadius: 100,
          color: "rgba(0,0,0,0)",
          backgroundColor: "#F1F1EC",
          position: [-1, -6],
          shadowBlur: 6,
          shadowColor: "#33A7F0",
        },
      },
    ],
  } as EChartsOption;
});

const resultOption = computed(() => type === "1" ? option.value : option2.value);
</script>

<template>
  <div class="h-full w-full">
    <RenderEchart :option="resultOption" :set-option-before-clear="true" />
  </div>
</template>

<style scoped>

</style>
