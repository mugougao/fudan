<script setup lang="ts">
import type { EChartsOption } from "echarts";
import dayjs from "dayjs";
import { useDataSlice } from "@/hooks";
import { createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "DetailChart", inheritAttrs: false });

const { data = [] } = defineProps<{
  data: { name: string; value1: number;value2: number }[];
}>();

const timeType = defineModel<"day" | "month">("timeType", { default: "day" });
const timeTypeOptions = [
  { label: "日", value: "day" },
  { label: "月", value: "month" },
];

const { displayData, sliderProps } = useDataSlice(() => data, 7, true);

const option = computed(() => {
  return {
    color: ["#32D74B"],
    grid: { left: "5%", right: "5%", bottom: "2%", top: "15%", containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "line" }, valueFormatter: (value: number) => `${value} 元` },
    xAxis: {
      type: "category",
      data: displayData.value.map(item => dayjs(item.name).format(timeType.value === "day" ? "M/D" : "M月")),
      // axisLabel: { formatter: (value: string) => dayjs(value).format(timeType.value === "day" ? "M/D" : "M月") },
    },
    yAxis: {
      type: "value",
      name: "单位/元",
      nameTextStyle: { padding: [0, 30, 0, 0] },
    },
    series: [
      {
        name: "金额",
        data: displayData.value.map(item => item.value2),
        type: "line",
        symbol: "none",
        smooth: true,
        lineStyle: { width: 2, color: "#32D74B" },
        areaStyle: {
          color: createEChartsLinearGradient(["#32D74B", "rgba(0,0,0,0)"], [0, 0, 0, 1]),
        },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="h-[240px] flex flex-col">
    <SegmentedRadioGroup v-model="timeType" :options="timeTypeOptions" class="relative z-9 justify-end" />
    <div class="flex-auto -mt-5">
      <RenderEchart :option="option" :is-empty="!data.length" />
    </div>
    <CustomSlider v-if="data?.length && data.length > 8" v-bind="sliderProps" class="-mt-2" />
  </div>
</template>

<style scoped lang="scss">

</style>
