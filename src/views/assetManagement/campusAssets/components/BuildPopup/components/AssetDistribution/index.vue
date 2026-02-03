<script setup lang="ts">
import type { EChartsOption } from "echarts";
import round from "lodash/round";
import { useEChartRender } from "@/hooks";
import { largestRemainderMethod, numberToThousands } from "@/utils";

defineOptions({ name: "AssetDistribution" });

const { title, data, color, subTitle, name, unit } = defineProps<{
  title: string;
  data: { name: string; value: number }[];
  color: string[];
  subTitle: string;
  name: string;
  unit: string;
}>();

const total = computed(() => round((data || []).reduce((pre, cur) => pre + cur.value, 0), 2));

const options = computed(() => {
  const percentList = largestRemainderMethod(data, 1);

  return {
    color,
    title: [
      {
        text: `{text|${subTitle}}`,
        left: "92",
        top: "75",
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
        text: `{text|(${unit})}`,
        left: "92",
        top: "55",
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
        left: "92",
        top: "30",
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
      top: 130,
      left: "center",
      itemGap: 10,
      formatter: (name) => {
        const percent = percentList.find(item => item.name === name)?.percent || 0;
        return `{name|${name}}\n{percent|${percent}%}`;
      },
      data: (data || []).map((item, index) => {
        const _color = color[index % color.length];
        return {
          name: item.name,
          textStyle: {
            rich: {
              name: { color: "#fff", fontSize: 12, padding: [0, 0, 2, 0] },
              percent: { color: `url(#AssetDistribution_${_color})`, fontSize: 12 },
            },
          },
        };
      }),
    },
    series: [
      {
        z: 9,
        name,
        type: "pie",
        radius: [48, 50],
        center: ["50%", 65],
        avoidLabelOverlap: false,
        padAngle: 3,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { disabled: true },
      },
      {
        z: 9,
        name,
        type: "pie",
        radius: [40, 50],
        center: ["50%", 65],
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
  <div class="h-180px w-full flex flex-col">
    <div class="ml-5 shrink-0 border-l-2 border-[#D45F5F] from-[#FFC2C2] to-white bg-gradient-to-t bg-clip-text pl-2 text-[12px] text-transparent font-text-bold">
      {{ title }}
    </div>
    <div class="chart-box flex-auto overflow-auto">
      <svg width="0" height="0">
        <defs>
          <linearGradient
            v-for="item in color" :id="`AssetDistribution_${item}`" :key="item"
            x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" :stop-color="item" />
          </linearGradient>
        </defs>
      </svg>
      <RenderEchart :option="options" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/pie-bg-3.png") no-repeat center 0px / 145px 130px;
}
</style>
