<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { cn, convertNumber, createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "EnergyBuildingTop5", inheritAttrs: false });

const { type = "electricity", data = [] } = defineProps<{
  type: "electricity" | "water";
  data?: { name: string; value: number; value1: number }[];
}>();

const option = computed(() => {
  const unit = type === "electricity" ? "万Kwh" : "万m³";
  const name = type === "electricity" ? "用电" : "用水";
  return {
    grid: { left: 5, right: 15, bottom: 0, top: 30, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      top: 5,
      left: "30%",
      icon: "rect",
      itemGap: 20,
      itemStyle: {
        borderWidth: 0,
      },
      formatter: value => `${value}(${value === "金额" ? "万元" : unit})`,
      data: [
        { name: `${name}量`, itemStyle: { color: "#CC1A1A" } },
        { name: "金额", itemStyle: { color: "#EABC8B" } },
      ],
    },
    xAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: (value: number) => convertNumber(value ?? 0),
          fontSize: 12,
        },
      },
    ],
    yAxis: {
      type: "category",
      data: data.map(item => item.name),
      axisLabel: {
        fontSize: 12,
        formatter: (name: string) => name.length > 5 ? name.match(/.{1,5}/g)?.join("\n") : name,
      },
    },
    series: [
      {
        name: `${name}量`,
        data: data.map(item => item.value),
        type: "bar",
        barWidth: 10,
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"], [1, 0, 0, 0]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: ["100%", -1],
          formatter: `{box|}`,
          rich: { box: { backgroundColor: "#FFD5D5", width: 2, height: 12 } },
        },
        tooltip: {
          valueFormatter: (value: any) => `${value} ${unit}`,
        },
      },
      {
        name: "金额",
        data: data.map(item => item.value1),
        type: "bar",
        barWidth: 10,
        itemStyle: {
          color: createEChartsLinearGradient(["#FFCE9B", "#ffce9b66"], [1, 0, 0, 0]),
          borderColor: "#EABC8B",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: ["100%", -1],
          formatter: `{box|}`,
          rich: { box: { backgroundColor: "#FFE5CA", width: 2, height: 12 } },
        },
        tooltip: {
          valueFormatter: (value: any) => `${value} 万元`,
        },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="cn('energy-building-top5 flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.energy.energyStatisticsTop5" />
    <div class="flex-auto">
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
