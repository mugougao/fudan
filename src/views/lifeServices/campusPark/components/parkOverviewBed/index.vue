<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender } from "@/hooks";

const props = defineProps<{
  value: number;
}>();

const option = computed(() => {
  return {
    legend: { orient: "vertical", x: "left", show: false },
    series: {
      name: "",
      type: "pie",
      center: ["50%", "50%"],
      radius: ["84%", "96%"],
      avoidLabelOverlap: true,
      hoverAnimation: false,
      label: { show: false },
      labelLine: { show: false },
      data: [
        {
          value: props.value,
          name: "",
          itemStyle: {
            normal: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: "#59C2A8" },
                  { offset: 0.3, color: "#21AC6D" },
                  { offset: 0.7, color: "#126643" },
                  { offset: 1, color: "#0A7E52" },
                ],
                global: false,
              },
            },
          },
        },
        {
          value: 100 - props.value,
          name: "",
          itemStyle: {
            color: "#142945",
          },
        },
      ],
    },
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);

const style = computed(() => {
  return {
    transform: `rotate(${360 / 100 * props.value - 90}deg) translateY(-50%)`,
  };
});
</script>

<template>
  <div class="relative h-180px w-full flex items-center justify-center">
    <div class="relative h-160px w-160px">
      <div ref="chart" class="wh-full" />
      <div class="swivel rotate absolute left-80px top-1/2 h-0 w-73px flex origin-left-center justify-end" :style="style">
        <div class="outRound flex-center translate-x-12px -translate-y-12px">
          <div class="inrRound" />
        </div>
      </div>

      <div class="absolute left-1/2 top-40px flex items-baseline text-14px text-white -translate-x-1/2">
        <GradientText class="text-30px font-bold font-number" :deg="0" :colors="{ 0: '#39B586', 100: '#FFFFFF' }">
          {{ props.value }}
        </GradientText>
        <span>%</span>
      </div>
      <span class="absolute left-1/2 top-85px whitespace-nowrap text-18px text-white font-text-bold -translate-x-1/2">
        {{ $t('dormitory.area.bedOccupancy') }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.outRound {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(9, 163, 177, 0.48);
  .inrRound {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ccfbff;
    border: 1.56px solid #09a3b1;
    box-shadow: 0 0 8px 0 #89e5ff;
  }
}
</style>
