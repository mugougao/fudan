<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";
import { useDataSlice } from "@/hooks";
import { convertNumber, createEChartsBarBackground, createEChartsLinearGradient, numberToThousands } from "@/utils";

defineOptions({ name: "BarWithLine", inheritAttrs: false });

const { data, legend, unit, mergeOption, color = "red" } = defineProps<{
  data: { name: string; value1: number; value2: number }[];
  legend: string[];
  unit: string[];
  mergeOption?: (option: EChartsOption) => EChartsOption;
  color?: "red" | "yellow" | "blue" | "purple";
}>();

const { displayData, sliderProps } = useDataSlice(() => data, 7, true);

const colorOptionMap = {
  red: {
    legend: {
      data: [
        { itemStyle: { color: "#CC1A1A", borderWidth: 0 } },
        { itemStyle: { color: "#FFFFFF", borderWidth: 0 } },
      ],
    },
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"]),
          borderColor: "#CE7A7A",
        },
        label: { rich: { val: { color: "url(#BarWithLineRed)" }, box: { backgroundColor: "#FFD5D5" } } },
      },
      { itemStyle: { color: "#FFFFFF", borderColor: "#FFFFFF66" } },
    ],
  },
  yellow: {
    legend: {
      data: [
        { itemStyle: { color: "#FFD6AA", borderWidth: 0 } },
        { itemStyle: { color: "#FFFFFF", borderWidth: 0 } },
      ],
    },
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#EABC8Bcc", "#EABC8B26"]),
          borderColor: "#FFD6AA",
        },
        label: { rich: { val: { color: "url(#BarWithLineYellow)" }, box: { backgroundColor: "#FFEBD5" } } },
      },
      {
        itemStyle: { color: "#FFFFFF", borderColor: "#FFFFFF66" },
      },
    ],
  },
  blue: {
    legend: {
      data: [
        { itemStyle: { color: "#ACE1FF", borderWidth: 0 } },
        { itemStyle: { color: "#FFFFFF", borderWidth: 0 } },
      ],
    },
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#69B6E2cc", "#69B6E226"]),
          borderColor: "#ACE1FF",
        },
        label: { rich: { val: { color: "url(#BarWithLineBlue)" }, box: { backgroundColor: "#D2EFFF" } } },
      },
      {
        itemStyle: { color: "#FFFFFF", borderColor: "#FFFFFF66" },
      },
    ],
  },
  purple: {
    legend: {
      data: [
        { itemStyle: { color: "#778BF1", borderWidth: 0 } },
        { itemStyle: { color: "#FFFFFF", borderWidth: 0 } },
      ],
    },
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#778BF1cc", "#778BF126"]),
          borderColor: "#B6C2FF",
        },
        label: { rich: { val: { color: "url(#BarWithLinePurple)" }, box: { backgroundColor: "#D8DEFF" } } },
      },
      {
        itemStyle: { color: "#FFFFFF", borderColor: "#FFFFFF66" },
      },
    ],
  },
};

const option = computed(() => {
  const result = {
    grid: { left: 10, right: 5, bottom: 0, top: 40, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      data: [
        { name: legend[0], itemStyle: { color: "#FFD6AA", borderWidth: 0 } },
        { name: legend[1], itemStyle: { color: "#FFFFFF", borderWidth: 0 } },
      ],
    },
    xAxis: { type: "category", data: displayData.value.map(item => item.name) },
    yAxis: [
      {
        type: "value",
        name: `单位:${unit[0]}`,
        scale: true,
        nameTextStyle: { padding: [0, 0, 0, 0], fontSize: 12, fontFamily: "AlibabaPuHuiTi-3" },
        axisLabel: { formatter: (value: number) => convertNumber(value) },
      },
      {
        type: "value",
        name: `单位:${unit[1]}`,
        scale: true,
        splitLine: { show: false },
        nameTextStyle: { padding: [0, 0, 0, 0], fontSize: 12, fontFamily: "AlibabaPuHuiTi-3" },
      },
    ],
    series: [
      {
        type: "custom",
        itemStyle: { color: "#000a1733" },
        renderItem: createEChartsBarBackground(0.6),
        data: displayData.value.map(() => 0),
        tooltip: { show: false },
      },
      {
        name: legend[0],
        type: "bar",
        tooltip: {
          valueFormatter: (value: number) => `${value} ${unit[0]}`,
        },
        yAxisIndex: 0,
        barWidth: 12,
        itemStyle: {
          color: createEChartsLinearGradient(["#EABC8Bcc", "#EABC8B26"]),
          borderColor: "#FFD6AA",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: [-2, -15],
          formatter: ({ value }) => {
            return `{val|${numberToThousands(value as string)}}\n{box|}`;
          },
          rich: {
            val: {
              fontSize: 12,
              color: "url(#BarWithLineWarn)",
              fontFamily: "D-DIN",
              align: "center",
              width: 20,
              padding: [0, 0, 3, 0],
            },
            box: {
              backgroundColor: "#FFD5D5",
              width: 16,
              height: 2,
            },
          },
        },
        data: displayData.value.map(item => item.value1),
      },
      {
        name: legend[1],
        type: "line",
        tooltip: {
          valueFormatter: (value: number) => `${value} ${unit[1]}`,
        },
        yAxisIndex: 1,
        lineStyle: { color: "#FFFFFF" },
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "#FFFFFF",
          borderColor: "#FFFFFF66",
          borderWidth: 4,
        },
        data: displayData.value.map(item => item.value2),
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
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="BarWithLineRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFAFAF;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="BarWithLineYellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFEBD5;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="BarWithLineBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D2EFFF;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="BarWithLinePurple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D8DEFF;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
      <RenderEchart :option="resultOption" renderer="svg" :is-empty="!data.length" :set-option-before-clear="false" />
    </div>
    <div v-if="data?.length && data.length > 8" class="shrink-0">
      <CustomSlider v-bind="sliderProps" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
