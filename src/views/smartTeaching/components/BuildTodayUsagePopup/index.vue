<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "BuildTodayUsagePopup" });

const props = defineProps<{
  data: { name: string; value: number | string }[];
}>();

const visible = defineModel("visible", { type: Boolean, default: false });

// 进入当天使用率
const option2 = computed(() => {
  const category: string[] = [];
  const values: number[] = [];

  props.data.forEach(({ name, value }) => {
    category.push(name);
    values.push(value as number);
  });

  return {
    tooltip: { trigger: "axis", axisPointer: { type: "line" }, valueFormatter: (val: number) => `${val}%` },
    grid: { left: 10, right: 65, bottom: "3%", containLabel: true },
    xAxis: [{
      type: "category",
      boundaryGap: false,
      data: category.map(item => `第${item}节课`),
      name: "第x节课",
      nameTextStyle: { color: "#FFF", padding: [0, 0, 0, 0], fontSize: 12 },
      axisLabel: {
        formatter: (value, index) => `${category[index]}`,
      },
    }],
    yAxis: [{ type: "value", name: "%", nameTextStyle: { color: "#fff", padding: [0, 30, 0, 0] } }],
    series: [
      {
        name: "使用率",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 4,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#2FDAFF" },
                { offset: 1, color: "#BAE6FF" },
              ],
              global: false,
            },
          },
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(64, 175, 239, 0.4)" },
              { offset: 0.45, color: "rgba(64, 175, 239, 0.4) " },
              { offset: 1, color: "rgba(64, 175, 239, 0)" },
            ],
            global: false,
          },
        },
        emphasis: {
          focus: "series",
        },
        data: values,
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option2);
</script>

<template>
  <DragPopup
    v-model:visible="visible" title="当天使用率" :width="360" top="130px" left="840px"
    :auto-prev-popup="false">
    <EmptyWrapper :is-empty="!props.data?.length" height="200px">
      <div ref="chart" class="h-200px -mx-3" />
    </EmptyWrapper>
  </DragPopup>
</template>

<style scoped>

</style>
