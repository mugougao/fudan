<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { random } from "lodash";
import { useDataSlice, useEChartRender } from "@/hooks";

const propertyTableOpen = ref(false);

const data = ref(Array.from({ length: 12 }, (_, index) => {
  return {
    name: `${index + 1}月`,
    value: random(300, 500),
  };
}));
const { displayData, sliderProps } = useDataSlice(data, 8);

const option = computed(() => {
  const category: string[] = [];
  // 购电量
  const values: number[] = [];
  displayData.value.forEach(({ name, value }) => {
    category.push(name);
    values.push(value);
  });
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        data: category,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "",
        type: "line",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(255, 165, 102, 0.63)" },
              { offset: 1, color: " rgba(255, 157, 88, 0.02)" },
            ],
            global: false,
          },
        },
        data: values,
        symbol: "circle",
        symbolSize: 10,
        lineStyle: { color: "#FFA566" },
        itemStyle: {
          color: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: "#FF8A1D" },
              { offset: 0.5, color: "#FF8A1D" },
              { offset: 0.5, color: "transparent" },
              { offset: 1, color: "transparent" },
            ],
            global: false,
          },
          borderColor: "#FF8A1D",
          borderWidth: 1,
        },
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);
</script>

<template>
  <BoxPanel
    class="row-span-10"
    title="设备维修"
    content-class-name="grid grid-cols-1 grid-rows-24 overflow-hidden">
    <template #extra>
      <TabNavExtraItem v-model="propertyTableOpen" class="mx-2">
        报修次数最多的楼宇
      </TabNavExtraItem>
    </template>
    <div class="first row-span-4 mr-22px flex items-center justify-between">
      <div class="ml-26px flex">
        <div class="moon" />
        <div class="ml-22px mt-10px text-20px text-#E0F2FF">
          总报修次数
        </div>
      </div>
      <div class="ml-16px mr-12px flex items-baseline gap-2 text-18px text-white">
        <GradientText class="text-28px font-number" :deg="70" :colors="{ 0: '#ffffff', 100: '#FFFFFF' }">
          10
        </GradientText>
        <span>次</span>
      </div>
    </div>
    <div class="row-span-20">
      <div ref="chart" class="h-220px" />
      <CustomSlider v-bind="sliderProps" />
    </div>
  </BoxPanel>
</template>

<style scoped lang="scss">
.first {
  background: url("@/assets/images/lifeServices/campusPark/moonBg.png");
  background-size: 100% 100%;
  .moon {
    width: 50px;
    height: 50px;
    background: url("@/assets/images/lifeServices/campusPark/appliances.png");
    background-size: 100% 100%;
  }
}
</style>
