<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { largestRemainderMethod } from "@/utils";

defineOptions({ name: "RepairPieChart", inheritAttrs: false });

const { data } = defineProps<{ data: { name: string; value: number }[] }>();

const colors = [
  "#F37373",
  "#F7C998",
  "#778BF1",
  "#64D2FF",
  "#BF5AF2",
  "#AAB1BC",
  "#5150B7",
];

const option = computed(() => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const percent = largestRemainderMethod(data, 2);

  return {
    color: colors,
    title: {
      text: `${total}`,
      textStyle: { fontSize: 24, fontFamily: "D-DIN", color: "#fff" },
      subtext: `项目总数`,
      subtextStyle: { fontSize: 14, fontFamily: "AlibabaPuHuiTi-3-medium", color: "#fff" },
      left: "48%",
      top: 90,
    },
    tooltip: {
      trigger: "item",
      valueFormatter: (value: number) => `${value} 个`,
    },
    legend: {
      top: "65%",
      left: "center",
      itemGap: 15,
      formatter(name: string) {
        const params = percent.find(item => item.name === name) || { value: 0, percent: 0 };
        return `{name|${name}}  {value|${params.value}}个 {percent|${params.percent}%}`;
      },
      data: data.map(({ name }, index) => {
        const color = colors[index % colors.length];
        return {
          name,
          textStyle: {
            fontFamily: "AlibabaPuHuiTi-3-medium",
            fontSize: 12,
            rich: {
              name: { fontSize: 12, color: "#fff", fontFamily: "AlibabaPuHuiTi-3-medium", width: 70 },
              value: { fontSize: 14, fontFamily: "D-DIN", color: "#fff" },
              percent: { color: `url(#RepairPieChart_${color})`, fontSize: 14, fontFamily: "D-DIN", width: 90, align: "right" },
            },
          },
        };
      }),
    },
    series: [
      {
        type: "pie",
        radius: [70, 73],
        center: ["50%", 105],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        padAngle: 2,
        data,
        z: 2,
      },
      {
        type: "pie",
        radius: [56, 73],
        center: ["50%", 105],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        padAngle: 2,
        data,
        itemStyle: {
          opacity: 0.2,
        },
        z: 2,
        emphasis: {
          scale: false,
        },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="chart-box relative" :class="$attrs.class ?? ''">
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          v-for="item in colors" :id="`RepairPieChart_${item}`" :key="item"
          x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" :stop-color="item" />
        </linearGradient>
      </defs>
    </svg>
    <i class="i-svg-icon-chart absolute left-1/2 top-[60px] text-3xl -translate-x-1/2" />
    <RenderEchart :set-option-before-clear="false" :option="option" />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("src/assets/images_new/pie-bg-2.png") no-repeat center 20px / 170px 170px;
}
</style>
