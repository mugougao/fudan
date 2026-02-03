<script setup lang="ts">
import type { EChartsOption } from "echarts";
import chunk from "lodash/chunk";
import { useEChartRender } from "@/hooks";
import { convertNumber, createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "CampusEnergyConsumptionChain", inheritAttrs: false });

const { type = "1", data = [] } = defineProps<{
  data: { name: string; value1: number; value2: number }[];
  type: "1" | "2"; // 1: 购电，2：用电
}>();

const typeText = computed(() => type === "1" ? "购电量" : "用电量");

const option = computed(() => {
  const category: string[] = [];
  const values: number[] = [];
  const values2: number[] = [];
  data.forEach(({ name, value1, value2 }) => {
    category.push(name);
    values.push(value1);
    values2.push(value2);
  });
  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: val => `${val}kWh` },
    grid: [
      { top: 35, left: 15, bottom: 30, width: 115 },
      { top: 35, right: 15, bottom: 30, width: 115 },
    ],
    legend: [
      {
        show: true,
        icon: "none",
        left: 0,
        top: 5,
        data: [`上上月${typeText.value}`],
        formatter: name => `{text|${name}}`,
        textStyle: {
          rich: {
            text: {
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              backgroundColor: createEChartsLinearGradient(["#F7C99800", "#F7C99899", "#F7C99800"], [0, 0, 1, 0]),
              width: 110,
              align: "center",
              padding: [5, 0],
            },
          },
        },
      },
      {
        show: true,
        icon: "none",
        right: 10,
        top: 5,
        data: [`上月${typeText.value}`],
        formatter: name => `{text|${name}}`,
        textStyle: {
          rich: {
            text: {
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              backgroundColor: createEChartsLinearGradient(["#CC1A1A00", "#CC1A1A99", "#CC1A1A00"], [0, 0, 1, 0]),
              width: 110,
              align: "center",
              padding: [5, 0],
            },
          },
        },
      },
    ],
    xAxis: [
      { gridIndex: 0, type: "value", splitNumber: 2, boundaryGap: true, splitLine: { show: false }, axisLabel: { interval: "auto", formatter: value => convertNumber(value) }, inverse: true },
      {
        gridIndex: 1,
        type: "value",
        splitNumber: 2,
        boundaryGap: true,
        splitLine: { show: false },
        axisLabel: { interval: "auto", formatter: value => convertNumber(value) },
      },
    ],
    yAxis: [
      { gridIndex: 0, type: "category", position: "right", data: category, axisLine: { show: false }, axisLabel: { show: false } },
      {
        gridIndex: 1,
        type: "category",
        position: "left",
        data: category,
        axisLine: { show: false },
        axisLabel: {
          formatter: value => value.length > 2 ? `${chunk(value.split(""), 3).map(item => item.join("")).join("\n")}` : value,
          align: "center",
          margin: 27,
          fontSize: 12,
          color: "#fff",
          fontFamily: "AlimamaShuHeiTi-Bold",
        },
        name: `(kWh)`,
        nameLocation: "start",
        nameTextStyle: { color: "#9E9E9E", fontSize: 10, padding: [-10, 0, 10, -65] },
      },
    ],
    series: [
      {
        gridIndex: 0,
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: `上上月${typeText.value}`,
        type: "bar",
        data: values,
        barWidth: 8,
        showBackground: true,
        backgroundStyle: { color: "rgba(225, 225, 225, 0.10)" },
        itemStyle: {
          color: createEChartsLinearGradient(["#EABC8Bcc", "#EABC8B26"], [0, 0, 1, 0]),
          borderColor: "#FFD6AA",
        },
        label: {
          show: true,
          formatter: "{box|}",
          position: "left",
          padding: [0, -7, 0, 0],
          rich: {
            box: {
              backgroundColor: "#FFD5D5",
              width: 2,
              height: 12,
            },
          },
        },
        z: 2,
      },
      {
        gridIndex: 0,
        xAxisIndex: 0,
        yAxisIndex: 0,
        type: "bar",
        data: values.map(() => 0),
        barWidth: 8,
        barGap: "-100%",
        tooltip: { show: false },
        label: {
          show: true,
          formatter: "{box|}",
          position: "left",
          offset: [10, 0],
          rich: {
            box: {
              borderWidth: 1,
              borderColor: "#636363",
              borderType: "dashed",
              width: 125,
              height: 18,
            },
          },
        },
        z: 1,
      },
      {
        gridIndex: 1,
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: `上月${typeText.value}`,
        type: "bar",
        data: values2,
        barWidth: 8,
        showBackground: true,
        backgroundStyle: { color: "rgba(225, 225, 225, 0.10)" },
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"], [1, 0, 0, 0]),
          borderColor: "#CE7A7A",
        },
        label: {
          show: true,
          formatter: "{box|}",
          position: "right",
          padding: [0, 0, 0, -7],
          rich: {
            box: {
              backgroundColor: "#FFD5D5",
              width: 2,
              height: 12,
            },
          },
        },
        z: 2,
      },
      {
        gridIndex: 1,
        xAxisIndex: 1,
        yAxisIndex: 1,
        type: "bar",
        data: values2.map(() => 0),
        barWidth: 8,
        barGap: "-100%",
        tooltip: { show: false },
        label: {
          show: true,
          formatter: "{box|}",
          position: "right",
          offset: [-10, 0],
          rich: {
            box: {
              borderWidth: 1,
              borderColor: "#636363",
              borderType: "dashed",
              width: 125,
              height: 18,
            },
          },
        },
        z: 1,
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);
</script>

<template>
  <div class="campus-energy-consumption-chain" :class="$attrs.class">
    <div ref="chart" class="h-full" />
  </div>
</template>

<style scoped>

</style>
