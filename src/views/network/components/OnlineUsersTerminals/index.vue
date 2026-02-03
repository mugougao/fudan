<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { cn, createEChartsBarBackground, createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "OnlineUsersTerminals", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value1: number; value2: number }[];
}>();

const option = computed(() => {
  const category = data.map(item => item.name);
  const values = data.map(item => item.value1);
  const values2 = data.map(item => item.value2);

  return {
    grid: { left: 10, right: 5, bottom: 10, top: 40, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: { type: "category", data: category },
    yAxis: { type: "value", name: "单位/个", nameTextStyle: { padding: [0, 5, 0, 0], align: "right", verticalAlign: "middle" } },
    legend: {
      top: 10,
      left: "35%",
      data: [
        { name: "在线用户", itemStyle: { color: "#CC1A1A", borderWidth: 0 } },
        { name: "在线终端", itemStyle: { color: "#FFD6AA", borderWidth: 0 } },
      ],
      textStyle: { color: "#fff", fontSize: 12, fontFamily: "AlibabaPuHuiTi-3-medium" },
    },
    series: [
      {
        type: "custom",
        itemStyle: { color: "#000a1733" },
        renderItem: createEChartsBarBackground(0.6),
        data: values.map(() => 0),
        tooltip: { show: false },
      },
      {
        name: "在线用户",
        data: values,
        type: "bar",
        barWidth: 8,
        barGap: 0.5,
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: [-1, 0],
          formatter: `{box|}`,
          rich: { box: { backgroundColor: "#FFD5D5", width: 10, height: 2 } },
        },
        tooltip: { valueFormatter: (value: number) => `${value} 人` },
      },
      {
        name: "在线终端",
        data: values2,
        type: "bar",
        barWidth: 8,
        barGap: 0.5,
        itemStyle: {
          color: createEChartsLinearGradient(["#FFCE9B", "#ffce9b66"]),
          borderColor: "#EABC8B",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: [-1, 0],
          formatter: `{box|}`,
          rich: { box: { backgroundColor: "#FFE5CA", width: 10, height: 2 } },
        },
        tooltip: { valueFormatter: (value: number) => `${value} 个` },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.campusOnlineUserAndTerminalDistribution" />
    <div class="flex-auto overflow-hidden">
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
