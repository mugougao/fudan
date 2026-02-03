<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender } from "@/hooks";
import { createEChartsLinearGradient } from "@/utils";

const { data } = defineProps<{
  data: { name: string;value: { name: string;value: number }[] }[];
}>();

// 1A
const colors = [
  ["#CC1A1A", "#CE7A7A"],
  ["#EABC8B", "#FFD6AA"],
  ["#778BF1", "#B6C2FF"],
  ["#FFFFFF", "#FFFFFF"],

];

const option = computed(() => {
  const series = data.map(({ name, value }, index) => {
    const [bgColor, borderColor] = colors[index % colors.length];
    const isLast = index === data.length - 1;
    return {
      name,
      type: "bar",
      stack: "total",
      data: value,
      barWidth: 8,
      barCategoryGap: 14,
      itemStyle: { color: createEChartsLinearGradient([`${bgColor}b3`, `${bgColor}1a`]), borderColor, borderWidth: 1 },
      emphasis: { focus: "series" },
      label: isLast
        ? {
            show: true,
            position: "top",
            formatter: "{box|}",
            offset: [0, 5.5],
            rich: {
              box: {
                backgroundColor: "#FFFFFF",
                height: 2,
                width: 12,
              },
            },
          }
        : {
            show: true,
            position: "top",
            formatter: "{box|}",
            offset: [0, 5.5],
            rich: {
              box: {
                backgroundColor: "#FFFFFF",
                height: 1,
                width: 10,
              },
            },
          },
    };
  });
  const category = (data[0]?.value || []).map(({ name }) => name);

  return {
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: value => `${value}人次`,
    },
    legend: {
      show: true,
      data: data.map(({ name }, index) => {
        const [,color] = colors[index % colors.length];
        return {
          name,
          itemStyle: { color, borderWidth: 0 },
        };
      }),
      right: 0,
      top: 5,
      itemGap: 3,
      textStyle: { fontSize: 10, fontFamily: "AlibabaPuHuiTi-3" },
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: [{ type: "category", data: category }],
    yAxis: [{ type: "value", name: "单位/人次", nameTextStyle: { padding: [0, 30, 0, 0] } }],
    series,
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);
</script>

<template>
  <div class="wh-full">
    <RenderEchart :option="option" />
  </div>
</template>

<style scoped>

</style>
