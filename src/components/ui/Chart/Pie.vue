<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { nanoid } from "nanoid";
import { largestRemainderMethod } from "@/utils";

defineOptions({ name: "Pie", inheritAttrs: false });

const { data = [], title, seriesName, color = ["#F37373", "#F7C998", "#778BF1", "#FFFFFF"] } = defineProps<{
  data?: { name: string; value: number }[];
  title?: string;
  seriesName?: string;
  color?: string[];
}>();

const useId = nanoid();

const option = computed(() => {
  const total = data.reduce((prev, cur) => prev + cur.value, 0);
  const percents = largestRemainderMethod(data, 2);
  return {
    color,
    title: [
      {
        text: `{text|${total}}`,
        left: 72,
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 22,
              fontFamily: "D-DIN",
              color: "#fff",
              height: 60,
              padding: [5, 5, 25, 5],
            },
          },
        },
      },
      {
        text: `{text|${title}}`,
        left: 72,
        top: "middle",
        textStyle: {
          rich: {
            text: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              padding: [25, 5, 5, 5],
            },
          },
        },
      },
    ],
    tooltip: {
      trigger: "item",
      valueFormatter: (value: number) => `${value} 个`,
    },
    legend: {
      top: "center",
      left: 160,
      orient: "vertical",
      itemGap: 10,
      itemWidth: 4,
      itemHeight: 4,
      formatter: (name) => {
        const params = percents.find(item => item.name === name);
        return `{name|${name}} {percent|${params?.percent}%}`;
      },
      data: data.map((item, index, arr) => {
        const i = index % arr.length;

        return {
          name: item.name,
          textStyle: {
            rich: {
              name: {
                color: `#fff`,
                fontSize: 12,
                fontFamily: "AlibabaPuHuiTi-3-medium",
                width: 55,
              },
              percent: {
                color: `url(#ChartPie_${useId}_${color[i]})`,
                fontSize: 14,
                fontFamily: "D-DIN",
                width: 50,
                align: "right",
              },
            },
          },
        };
      }),
    },
    series: [
      {
        name: seriesName,
        type: "pie",
        radius: ["44", "47"],
        center: ["76", "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        data,
      },
      {
        name: seriesName,
        type: "pie",
        radius: ["38", "47"],
        center: ["77", "50%"],
        avoidLabelOverlap: false,
        itemStyle: { opacity: 0.1 },
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        data,
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="h-full w-full">
    <EmptyWrapper :is-empty="!data.length">
      <div class="chart-box h-full w-full">
        <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              v-for="item in color" :id="`ChartPie_${useId}_${item}`" :key="item"
              x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" :stop-color="item" />
            </linearGradient>
          </defs>
        </svg>
        <RenderEchart :option="option" renderer="svg" />
      </div>
    </EmptyWrapper>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/pie-bg.png") no-repeat 15px center / 123px 128px;
}
</style>
