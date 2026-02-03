<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { cn, largestRemainderMethod, numberToThousands } from "@/utils";

defineOptions({ name: "InstrumentDistributionLarge" });
const { data } = defineProps<{
  data: { name: string; value: number }[];
}>();

const colors = ["#F37373", "#7FC7A7", "#F7C998", "#778BF1", "#69B6E2", "#FFFFFF", "#425796", "#BF5AF2", "#5150B7"];
const option = computed(() => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = data.reduce((prev, cur) => prev + cur.value, 0);
  const percents = largestRemainderMethod(sortedData, 3);

  const serieData = sortedData.map((item, index) => {
    return {
      ...item,
      itemStyle: {
        color: colors[index % colors.length],
      },
    };
  });
  //
  return {
    grid: { top: 0, left: 0, right: 0, bottom: 0 },
    title: [
      {
        text: `{text|${numberToThousands(total)}}`,
        left: "70",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 22,
              fontFamily: "D-DIN",
              color: "#fff",
              height: 60,
              padding: [15, 5, 5, 5],
            },
          },
        },
      },
      {
        text: `{text|设备总数}`,
        left: "70",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              padding: [55, 5, 5, 5],
            },
          },
        },
      },
    ],
    tooltip: { trigger: "item", valueFormatter: (value: number) => `${value} 个` },
    legend: {
      top: "center",
      left: "53%",
      padding: [40, 0, 0, 0],
      orient: "vertical",
      itemWidth: 4,
      itemHeight: 4,
      itemGap: 12,
      formatter: (name: string) => {
        const params = percents.find(item => item.name === name);
        return `{name|${name}} {percent|${params?.percent}%}`;
      },
      // width: 200,
      data: sortedData.map((item, index) => {
        return {
          name: item.name,
          textStyle: {
            rich: {
              name: { width: 70, color: "#fff", fontSize: 12, fontFamily: "AlibabaPuHuiTi-3-medium" },
              percent: { width: 50, color: `url(#InstrumentDistributionLarge_${index % colors.length})`, fontSize: 12, fontFamily: "D-DIN", align: "right" },
            },
          },
        };
      }),
    },
    series: [
      {
        type: "pie",
        radius: [55, 59],
        center: ["75", "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        data: serieData,
        z: 1,
      },
      {
        type: "pie",
        radius: [47, 59],
        center: ["75", "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        itemStyle: { opacity: 0.2 },
        data: serieData,
        z: 2,
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="cn('row-span-13 flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="assetMgr.largeInstrumentsDistribution" class="shrink-0" />
    <div class="chart-box relative mt-2 flex-auto overflow-hidden">
      <svg height="0">
        <linearGradient
          v-for="(item, index) in colors"
          :id="`InstrumentDistributionLarge_${index}`"
          :key="item"
          x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" :stop-color="item" />
        </linearGradient>
      </svg>
      <i class="i-svg-icon-raw-chart absolute left-[58px] top-[40px] text-3xl" />
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped>
.chart-box {
  background: url("@/assets/images_new/pie-bg-2.png") no-repeat 5px center / 140px 140px;
}
</style>
