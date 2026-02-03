<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";
import { useDataSlice } from "@/hooks";
import { createEChartsBarBackground, createEChartsLinearGradient, numberToThousands } from "@/utils";

defineOptions({ name: "Bar", inheritAttrs: false });

const { data, legend, unit, mergeOption, color = "red", size = 7 } = defineProps<{
  data: { name: string; value: number }[];
  legend: string;
  unit: string;
  mergeOption?: (option: EChartsOption) => EChartsOption;
  color?: "red" | "yellow" | "blue" | "purple";
  size?: number;
}>();

const { displayData, sliderProps } = useDataSlice(() => data, size, true);

const colorOptionMap = {
  red: {
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"]),
          borderColor: "#CE7A7A",
        },
        label: { rich: { val: { color: "url(#BarRed)" }, box: { backgroundColor: "#FFD5D5" } } },
      },
    ],
  },
  yellow: {
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#EABC8Bcc", "#EABC8B26"]),
          borderColor: "#FFD6AA",
        },
        label: { rich: { val: { color: "url(#BarYellow)" }, box: { backgroundColor: "#FFEBD5" } } },
      },
    ],
  },
  blue: {
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#69B6E2cc", "#69B6E226"]),
          borderColor: "#ACE1FF",
        },
        label: { rich: { val: { color: "url(#BarBlue)" }, box: { backgroundColor: "#D2EFFF" } } },
      },
    ],
  },
  purple: {
    series: [
      {},
      {
        itemStyle: {
          color: createEChartsLinearGradient(["#778BF1cc", "#778BF126"]),
          borderColor: "#B6C2FF",
        },
        label: { rich: { val: { color: "url(#BarPurple)" }, box: { backgroundColor: "#D8DEFF" } } },
      },
    ],
  },
};

const option = computed(() => {
  const category = displayData.value.map(item => item.name);
  const values = displayData.value.map(item => item.value);

  const result = {
    grid: { left: 10, right: 10, bottom: 5, top: 30, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${value} ${unit}` },
    xAxis: { type: "category", data: category, axisLine: { show: true } },
    yAxis: { type: "value", name: `单位:${unit}`, nameTextStyle: { padding: [0, 20, 0, 0] } },
    series: [
      {
        type: "custom",
        itemStyle: { color: "#000a1733" },
        renderItem: createEChartsBarBackground(0.6),
        data: values.map(() => 0),
        tooltip: { show: false },
      },
      {
        name: legend,
        data: values,
        type: "bar",
        z: "2",
        barWidth: 12,
        showBackground: false,
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"]),
          borderColor: "#CE7A7A",
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
              color: "url(#barLabelPrimary)",
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
          <linearGradient id="BarRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFAFAF;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="BarYellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFEBD5;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="BarBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D2EFFF;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="BarPurple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D8DEFF;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
      <RenderEchart :option="resultOption" renderer="svg" :is-empty="!data.length" />
    </div>
    <div v-if="data?.length && data.length > 8" class="shrink-0">
      <CustomSlider v-bind="sliderProps" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
