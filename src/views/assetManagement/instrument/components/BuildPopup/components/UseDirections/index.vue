<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { round } from "lodash";
import { largestRemainderMethod, numberToThousands } from "@/utils";

defineOptions({ name: "UseDirections" });

const { data } = defineProps<IProps>();
export interface IProps {
  data: { name: string;value: number }[];
}

const color = ["#A158C9", "#82B660", "#85FFB2", "#3DBBFF", "#3A7993"];

const total = computed(() => round((data || []).reduce((pre, cur) => pre + cur.value, 0), 2));

const options = computed(() => {
  const percentList = largestRemainderMethod(data, 1);

  return {
    color,
    title: [
      {
        text: `{text|总设备数}`,
        left: "76",
        top: "83",
        textStyle: {
          rich: {
            text: {
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "AlibabaPuHuiTi-3-medium",
              align: "center",
              padding: [0, 0, 0, 0],
            },
          },
        },
      },
      {
        text: `{text|(个)}`,
        left: "76",
        top: "65",
        textStyle: {
          rich: {
            text: {
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              align: "center",
              padding: [0, 0, 0, 0],
            },
          },
        },
      },
      {
        text: `{text|${numberToThousands(total.value)}}`,
        left: "76",
        top: "40",
        textStyle: {
          rich: {
            text: {
              fontSize: 22,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "D-DIN",
              align: "center",
              padding: [0, 0, 0, 0],
            },
          },
        },
      },
    ],
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      top: "40%",
      left: 180,
      itemGap: 10,
      formatter: (name) => {
        const percent = percentList.find(item => item.name === name)?.percent || 0;
        return `{name|${name}} {percent|${percent}%}`;
      },
      data: (data || []).map((item, index) => {
        const _color = color[index % color.length];
        return {
          name: item.name,
          textStyle: {
            rich: {
              name: { width: 80, color: "#fff", fontSize: 12, padding: [0, 0, 2, 0] },
              percent: { width: 60, color: `url(#UseDirections_${_color})`, fontSize: 12, align: "right" },
            },
          },
        };
      }),
    },
    series: [
      {
        name: "数量",
        type: "pie",
        radius: [48, 50],
        center: [82, "50%"],
        avoidLabelOverlap: false,
        padAngle: 3,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { disabled: true },
      },
      {
        name: "数量",
        type: "pie",
        radius: [40, 50],
        center: [82, "50%"],
        avoidLabelOverlap: false,
        padAngle: 3,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { disabled: true },
        itemStyle: { opacity: 0.2 },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="chart-box mt-2 h-150px">
    <svg width="0" height="0">
      <defs>
        <linearGradient
          v-for="item in color" :id="`UseDirections_${item}`" :key="item"
          x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" :stop-color="item" />
        </linearGradient>
      </defs>
    </svg>
    <EmptyWrapper :is-empty="!data?.length">
      <RenderEchart :option="options" />
    </EmptyWrapper>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/pie-bg-3.png") no-repeat 10px center / 145px 130px;
}
</style>
