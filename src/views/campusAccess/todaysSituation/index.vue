<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { numberToThousands } from "@/utils";

defineOptions({ name: "PersonnelDistribution" });

const { data } = defineProps<{
  data: { value: number; name: string }[];
}>();

const color = ["#F37373", "#F7C998", "#69B6E2", "#7FC7A7", "#778BF1", "#FFFFFF", "#FFFFFF99", "#FFFFFF66"];
const option = computed(() => {
  return {
    color,
    tooltip: { trigger: "item" },
    legend: {
      top: "center",
      right: 0,
      orient: "vertical",
      formatter: (name) => {
        const value = data.find(item => item.name === name)?.value ?? 0;
        return `{name|${name}}{percent|${numberToThousands(value)}人次}`;
      },
      data: data.map((item, index) => {
        const _color = color[index % color.length];
        return {
          name: item.name,
          textStyle: {
            rich: {
              name: {
                color: "#fff",
                fontSize: 12,
                fontFamily: "AlibabaPuHuiTi-3",
                width: 60,
              },
              percent: {
                color: `url(#PersonnelDistribution_${_color})`,
                fontSize: 14,
                fontFamily: "D-DIN",
              },
            },
          },
        };
      }),
    },
    series: [
      {
        name: "今日进校人次",
        type: "pie",
        radius: [62, 65],
        center: [87, "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { scale: false },
        z: 2,
      },
      {
        name: "今日进校人次",
        type: "pie",
        radius: [51, 65],
        center: [87, "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { scale: false },
        itemStyle: { opacity: 0.2 },
        z: 1,
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="chart relative wh-full">
    <svg width="0" height="0">
      <defs>
        <linearGradient
          v-for="item in color" :id="`PersonnelDistribution_${item}`" :key="item"
          x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="item" />
          <stop offset="100%" stop-color="#FFF" />
        </linearGradient>
      </defs>
    </svg>
    <i class="i-svg-icon-raw-user2 absolute left-[72px] top-1/2 text-[24px] -translate-y-1/2" />
    <RenderEchart :option="option" />
  </div>
</template>

<style scoped>
.chart {
  background: url("@/assets/images_new/pie-bg-4.png") no-repeat 10px center / 153px 153px;
}
</style>
