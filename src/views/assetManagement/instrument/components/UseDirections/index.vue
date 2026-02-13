<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { numberToThousands } from "@/utils";

defineOptions({ name: "UseDirections" });

const { data } = defineProps<IProps>();
export interface IProps {
  data: { name: string;value: number }[];
}

const color = ["#A158C9", "#82B660", "#85FFB2", "#3DBBFF", "#3A7993", "#fbc531"];

const colors = ["#F37373", "#7FC7A7", "#F7C998", "#778BF1", "#69B6E2", "#FFFFFF", "#425796", "#BF5AF2", "#5150B7"];
const option = computed(() => {
  const sortedData = data;
  const total = data.reduce((prev, cur) => prev + cur.value, 0);
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
        text: `{text|${numberToThousands(total)}}{unit|个}`,
        left: "75",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 22,
              fontFamily: "D-DIN",
              color: "#fff",
              height: 60,
              padding: [25, 5, 15, 5],
            },
            unit: {
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              color: "rgba(255,255,255,0.6)",
              padding: [10, 0, 0, 0],
            },
          },
        },
      },
      {
        text: `{text|设备总数}`,
        left: "75",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              padding: [65, 5, 15, 5],
            },
          },
        },
      },
    ],
    tooltip: { trigger: "item", valueFormatter: (value: number) => `${value} 个` },
    legend: {
      type: data.length > 6 ? "scroll" : "plain",
      top: "center",
      left: "55%",
      padding: [40, 0, 0, 0],
      orient: "vertical",
      itemWidth: 4,
      itemHeight: 4,
      itemGap: 12,

      // width: 200,
      data: sortedData.map((item, index) => {
        return {
          name: item.name,
          textStyle: {

          },
        };
      }),
    },
    series: [
      {
        type: "pie",
        radius: [55, 59],
        center: [80, "50%"],
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
        center: [80, "50%"],
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
  <div class="row-span-7 flex flex-col">
    <UiSubTitle title-path="largeInstruments.mainUseDirection" class="shrink-0" />
    <div class="chart-box relative mt-2 flex-auto overflow-hidden">
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            v-for="(item, index) in color" :id="`UseDirections_${index}`" :key="item"
            x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" :stop-color="item" />
          </linearGradient>
        </defs>
      </svg>
      <i class="i-svg-icon-raw-chart absolute left-[63px] top-[60px] text-3xl" />
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/pie-bg-2.png") no-repeat 10px center / 140px 140px;
}
</style>
