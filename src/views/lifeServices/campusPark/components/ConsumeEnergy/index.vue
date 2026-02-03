<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { ComputedRef } from "vue";
import { useDataSlice, useEChartRender } from "@/hooks";

defineOptions({ name: "ConsumeEnergy" });

const {
  energyUseData = { count: 0, data: [] },
  energyPurchaseData = { count: 0, data: [] },
} = defineProps<{
  energyUseData?: {
    count: number;
    data: { name: string;value: number }[];
  };
  energyPurchaseData?: {
    count: number;
    data: { name: string;value: number }[];
  };
}>();

const tabValue = ref("1");
const tabOptions = [
  { label: "用电", value: "1" },
  { label: "购电", value: "2" },
];
const tabLabel = computed(() => {
  const label = tabOptions.find(item => item.value === tabValue.value)?.label;
  return `昨日${label}`;
  // return `${label === "购电" ? "昨日" : "今日"}${label}`;
});

// 图表series name
const seriesName = computed(() => {
  const label = tabOptions.find(item => item.value === tabValue.value)?.label;
  return `月度${label}`;
});

const data = computed(() => tabValue.value === "1" ? energyUseData : energyPurchaseData) as ComputedRef<{ count: number; data: { name: string;value: number }[] }>;

// const propertyTableOpen = ref(false);
// 今日用电/今日购电
const countNumberFormat = computed<string>(() => {
  const _countNumber = (data.value?.count || 0).toString();
  if (_countNumber.length < 4) {
    const span = Array.from({ length: 4 - _countNumber.length }).fill(0).join("");
    return `${span}${_countNumber}`;
  }
  return _countNumber;
});

const { displayData, sliderProps } = useDataSlice(computed(() => data.value?.data || []), 8);

const option = computed(() => {
  const category: string[] = [];
  const values: number[] = [];
  displayData.value.forEach(({ name, value }) => {
    category.push(name);
    values.push(value);
  });

  const style = tabValue.value === "1"
    ? {
        lineStyle: {
          width: 4,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0.2, color: "#2FDAFF" },
              { offset: 1, color: "#BAE6FF" },
            ],
            global: false,
          },
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(64, 175, 239, 0.4) " },
              { offset: 0.45, color: "rgba(64, 175, 239, 0.4) " },
              { offset: 1, color: "rgba(64, 175, 239, 0)" },
            ],
            global: false,
          },
        },
      }
    : {
        lineStyle: { width: 4, color: "#71F0A2" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(99, 211, 149, 0.29)" },
              { offset: 0.49, color: "rgba(99, 211, 149, 0.29)" },
              { offset: 1, color: "rgba(99, 211, 149, 0)" },
            ],
            global: false,
          },
        },
      };
  return {
    color: [tabValue.value ? "#2FDAFF" : "#71F0A2"],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      valueFormatter: (value: number) => `${value}${tabValue.value === "2" ? "元" : "kWh"}`,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: [{
      type: "category",
      boundaryGap: true,
      data: category,
      axisLabel: {
        formatter: (value: string) => `${value}月`,
      },
    }],
    yAxis: [{ type: "value" }],
    series: [
      {
        name: seriesName.value,
        type: "line",
        smooth: true,
        showSymbol: false,
        emphasis: { focus: "series" },
        data: values,
        ...style,
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
    title="能耗情况"
    content-class-name="grid grid-cols-1 grid-rows-24 overflow-hidden">
    <template #extra>
      <!--
      <TabNavExtraItem v-model="propertyTableOpen" class="mx-2">
        人均用电量Top5
      </TabNavExtraItem>
      -->
      <TabNavExtra v-model="tabValue" :options="tabOptions" />
    </template>

    <div class="row-span-3 whitespace-nowrap">
      <div class="today flex-center">
        <span class="text-22px -mt-10px">{{ tabLabel }}</span>
        <div class="count-number mx-2 mb-3 flex gap-1.5 text-22px font-number text-shadow-[0px_0px_7px_rgba(158,213,250,0.5)]">
          <span
            v-for="(num, index) in countNumberFormat" :key="`${num}-${index}`"
            class="h-36px w-28px flex-center">
            <GradientText :deg="180" :colors="{ 0: '#39F8B9', 100: '#99FFC2' }">
              {{ num }}
            </GradientText>
          </span>
        </div>
        <span class="text-20px text-#E0F2FF -mt-10px">
          {{ tabValue === "2" ? "元" : "kWh" }}
        </span>
      </div>
    </div>
    <div class="row-span-21">
      <EmptyWrapper :is-empty="!data.data?.length" height="220px">
        <div ref="chart" class="h-260px" />
        <CustomSlider v-if="data.data.length > 8" v-bind="sliderProps" />
      </EmptyWrapper>
    </div>
  </BoxPanel>
</template>

<style scoped lang="scss">
.count-number span {
  background: linear-gradient(180deg, #1b454d 0%, #315f6f 99%);
  border: 2px solid;
  border-image: linear-gradient(
      148deg,
      #158a8a -1%,
      rgba(161, 255, 254, 0.8698) 5%,
      rgba(32, 126, 119, 0) 49%,
      rgba(161, 255, 254, 0.8537) 91%,
      #0d785a 99%
    )
    1.46;
}
</style>
