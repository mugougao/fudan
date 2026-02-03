<script setup lang="ts">
import type { EChartsOption } from "echarts";
import round from "lodash/round";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "PersonInfoTypeChartPie" });

const { data = [], color = ["#64D2FF", "#0A84FF", "#D4DEEC", "#5E5CE6"] } = defineProps<{
  data?: Array<{ name: string; value: number }>;
  color?: string[];
}>();

const chartRef = useTemplateRef<HTMLElement>("chart");
const highlightIndex = ref<number>(0);
const option = computed(() => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const highlightItem = data[highlightIndex.value];
  const highlightName = highlightItem?.name;
  const highlightValue = highlightItem?.value || 0;
  const highlightPercent = total ? round((highlightValue / total) * 100, 2) : 0;
  return {
    color,
    title: [
      {
        text: `{value|${highlightPercent}}{unit|%}`,
        top: "34%",
        left: 60,
        textStyle: {
          rich: {
            value: {
              align: "center",
              fontSize: 24,
              color: "#fff",
              fontFamily: "D-DIN",
            },
            unit: {
              align: "center",
              fontSize: 16,
              color: "#fff",
              fontFamily: "D-DIN",
            },
          },
        },
      },
      {
        text: highlightName,
        top: "50%",
        left: 60,
        textStyle: {
          align: "center",
          fontSize: 12,
          color: "#fff",
          fontFamily: "AlibabaPuHuiTi-3-bold",
        },
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: ({ marker, name, value }) => `${name} :<br> ${marker}  ${value}人`,
    },
    legend: {
      top: "center",
      left: 130,
      orient: "vertical",
      icon: "rect",
      itemGap: 20,
      itemWidth: 6,
      itemHeight: 6,
      textStyle: {
        fontSize: 15,
        fontFamily: "AlibabaPuHuiTi-3-medium",
      },
      data: data.map((item, index) => ({ name: item.name, itemStyle: { color: color[index] } })),
    },
    series: [
      {
        name: "main-out",
        type: "pie",
        radius: ["60%", "65%"],
        center: [65, "50%"],
        avoidLabelOverlap: false,
        padAngle: data.length > 1 ? 5 : 0,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        data,
      },
      {
        name: "main-middle",
        type: "pie",
        radius: ["50%", "60%"],
        center: [65, "50%"],
        avoidLabelOverlap: false,
        padAngle: data.length > 1 ? 5 : 0,
        label: { show: false },
        labelLine: { show: false },
        data: data.map((item, index) => ({ ...item, itemStyle: { color: `${color[index]}33` } })),
        emphasis: { scale: false },
      },
      {
        name: "main-in",
        type: "pie",
        radius: ["45%", "43%"],
        center: [65, "50%"],
        avoidLabelOverlap: false,
        padAngle: data.length > 1 ? 5 : 0,
        label: { show: false },
        labelLine: { show: false },
        data: data.map((item, index) => ({ ...item, itemStyle: { color: index === highlightIndex.value ? color[index] : "transparent" } })),
        emphasis: { scale: false },
      },
      {
        name: "border-out",
        type: "pie",
        radius: ["69%", "69%"],
        center: [65, "50%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [{ value: 1 }],
        itemStyle: { borderWidth: 2, borderColor: "rgba(255,255,255,0.1)" },
        emphasis: { disabled: true },
        tooltip: { show: false },
      },
      {
        name: "border-in",
        type: "pie",
        radius: ["45%", "45%"],
        center: [65, "50%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [{ value: 1 }],
        itemStyle: { borderWidth: 2, borderColor: "rgba(255,255,255,0.1)" },
        emphasis: { disabled: true },
        tooltip: { show: false },
      },
    ],
  } as EChartsOption;
});
const { chartInstance } = useEChartRender(chartRef, option);
const openInterval = computed(() => data.length > 1);
const { pause, resume } = useIntervalFn(() => {
  highlightIndex.value = (highlightIndex.value + 1) % data.length;
}, 3000, { immediate: false });

watch(
  openInterval,
  () => {
    openInterval.value ? resume() : pause();
  },
  { immediate: true },
);

function chartMouseoverHandler(params: any) {
  if (!openInterval.value) return;
  const { seriesName, dataIndex } = params;
  pause();
  if (!["main-out", "main-middle", "main-in"].includes(seriesName)) return;
  highlightIndex.value = dataIndex as number;
}

function chartMouseoutHandler() {
  if (!openInterval.value) return;
  resume();
}

watchEffect((onCleanup) => {
  onCleanup(() => {
    chartInstance.value?.off("mouseover", chartMouseoverHandler);
    chartInstance.value?.off("mouseout", chartMouseoutHandler);
  });
  chartInstance.value?.on("mouseover", chartMouseoverHandler);
  chartInstance.value?.on("mouseout", chartMouseoutHandler);
});
</script>

<template>
  <div ref="chart" class="person-info-type-chart-pie" />
</template>

<style scoped>

</style>
