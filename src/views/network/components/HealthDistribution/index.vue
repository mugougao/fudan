<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { cn, largestRemainderMethod } from "@/utils";

defineOptions({ name: "HealthDistribution", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value: number }[];
}>();

const colors = ["#F37373", "#F7C998", "#7FC7A7"];

const sortIndex = ["HIGH", "MEDIUM", "LOW"];

const dataFormatter = computed(() => {
  const result = largestRemainderMethod(data, 2);
  return result.sort(({ name: a }, { name: b }) => {
    return sortIndex.indexOf(b.toUpperCase()) - sortIndex.indexOf(a.toUpperCase());
  });
});

const option = computed(() => {
  return {
    grid: { left: 10, right: 60, bottom: -5, top: 5, containLabel: true },
    xAxis: {
      type: "value",
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: dataFormatter.value.map(({ name }) => name),
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        data: dataFormatter.value.map(({ percent }, index) => ({
          value: percent,
          itemStyle: {
            color: colors[index],
          },
        })),
        type: "pictorialBar",
        symbol: "path://M0,0L4,5L0,10L4,10L8,5L4,0L0,0Z",
        symbolRepeat: true,
        symbolSize: ["8", "10"],
        label: {
          show: true,
          formatter: ({ name }) => `{name|${name}}`,
          position: "left",
          distance: -50,
          rich: {
            name: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3",
              width: 50,
              padding: [0, 0, 27, 0],
            },
          },
        },
      },
      {
        data: dataFormatter.value.map(() => 100),
        type: "pictorialBar",
        symbol: "path://M0,0L4,5L0,10L4,10L8,5L4,0L0,0Z",
        symbolRepeat: true,
        symbolSize: ["8", "10"],
        itemStyle: { color: "#ffffff1a" },
        label: {
          show: true,
          position: "right",
          formatter: ({ dataIndex }) => {
            const percent = dataFormatter.value[dataIndex].percent;
            return `{percent|${percent}%}`;
          },
          rich: {
            percent: {
              color: "#fff",
              fontSize: 14,
              fontFamily: "D-DIN",
              width: 50,
              align: "right",
            },
          },
        },
      },
      {
        data: dataFormatter.value.map(({ percent }, index) => ({ value: 2, itemStyle: { color: colors[index] } })),
        type: "bar",
        barWidth: 10,
        itemStyle: {
          borderRadius: [1, 1, 1, 1],
        },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.healthDistribution" />
    <div class="chart flex-auto overflow-hidden">
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
