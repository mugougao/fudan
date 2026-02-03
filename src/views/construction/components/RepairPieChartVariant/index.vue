<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { computed } from "vue";
import { largestRemainderMethod } from "@/utils";

defineOptions({ name: "RepairPieChartVariant", inheritAttrs: false });
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
      text: `{total|${total}}`,
      textStyle: {
        rich: {
          total: {
            fontSize: 24,
            fontFamily: "D-DIN",
            color: "#fff",
            padding: [-25, 0, 0, 0],
          },
        },
      },
      subtext: `{text|项目总数}`,
      subtextStyle: {
        rich: {
          text: {
            fontSize: 14,
            fontFamily: "AlibabaPuHuiTi-3-medium",
            color: "#fff",
            padding: [-45, 0, 0, 0],
          },
        },
      },
      left: 85,
      top: 115,
    },
    tooltip: {
      trigger: "item",
      valueFormatter: (value: number) => `${value} 个`,
    },
    legend: {
      orient: "vertical",
      top: "center",
      right: 0,
      formatter(name: string) {
        const params = percent.find(item => item.name === name) || { value: 0, percent: 0 };
        return `{name|${name}}  {value|${params.value}}个 {percent|${params.percent}%}`;
      },
      data: data.map(({ name }, index) => {
        const color = colors[index % colors.length];
        return {
          name,
          textStyle: {
            fontSize: 12,

            rich: {
              name: { fontSize: 14, color: "#fff", fontFamily: "AlibabaPuHuiTi-3-medium", width: 45 },
              value: { fontSize: 14, fontFamily: "D-DIN", color: "#fff" },
              percent: { fontSize: 14, fontFamily: "D-DIN", color: `url(#RepairPieChart_${color})`, padding: [0, 0, 0, 10] },
            },
          },
        };
      }),
    },
    series: [
      {
        type: "pie",
        radius: [65, 70],
        center: [92, "50%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        padAngle: 2,
        data,
        z: 2,
      },
      {
        type: "pie",
        radius: [56, 70],
        center: [92, "50%"],
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
    <i class="i-svg-icon-chart absolute left-[92px] top-[60px] text-3xl -translate-x-1/2" />
    <RenderEchart :set-option-before-clear="false" :option="option" />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("src/assets/images_new/pie-bg-2.png") no-repeat 10px center / 165px 165px;
}
</style>
