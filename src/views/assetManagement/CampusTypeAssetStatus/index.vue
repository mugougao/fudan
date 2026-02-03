<script setup lang="ts">
import type { EChartsOption } from "echarts";
import round from "lodash/round";
import { useEChartRender } from "@/hooks";
import { easyClone } from "@/utils";

// const color = ["#0A84FF", "#C9326B", "#425796", "#64D2FF", "#BF5AF2", "#AAB1BC", "#5150B7"];
const { data = [], color = ["#0A84FF", "#C9326B", "#425796", "#64D2FF", "#BF5AF2", "#AAB1BC", "#5150B7"] } = defineProps<{
  data?: Array<{ name: string; value: number }>;
  color?: string[];
}>();
const state = shallowRef([
  { value: 550, name: "在用" },
  { value: 635, name: "已注销" },
  { value: 580, name: "已报废" },
  { value: 484, name: "已退库" },
  { value: 444, name: "待报废" },
  { value: 384, name: "闲置" },
  { value: 284, name: "已盘亏" },
]);
// 资产类型分布
const option = computed(() => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  return {
    // color,
    // tooltip: {
    //   trigger: "item",
    // },
    // title: {
    //   text: `${total}`, // 饼图中间的标题
    //   subtext: "资产总数", // 饼图中间的副标题
    //   top: "25%",
    //   right: "0%",
    //   left: "50%",
    //   bottom: 0,
    //   textStyle: { // 标题样式
    //     color: "#fff",
    //     fontSize: 36,
    //     fontFamily: "D-DIN",
    //   },
    //   subtextStyle: { // 副标题样式
    //     color: "#FFFFFF",
    //     fontSize: 18,
    //   },
    // },
    // legend: {
    //   orient: "horizontal",
    //   show: true,
    //   padding: [0, 0, 0, 0],
    //   left: "center", // 设置水平位置居中
    //   top: "bottom", // 设置垂直位置在底部
    //   itemGap: 10,
    //   icon: "circle",
    //   formatter: (name) => {
    //     const value = data.find(item => item.name === name)?.value || 0;
    //     const percent = round((value / total) * 100, 2);
    //     return ` {name|${name}} {value|${value}} {unit|个} {percent|${percent}} {symbol|%}`;
    //   },
    //   data: data.map(({ name, value }, index) => {
    //     return {
    //       name,
    //       itemStyle: {
    //         color: color[index],
    //       },
    //     };
    //   }),
    //   textStyle: {
    //     rich: {
    //       name: {
    //         color: "#fff",
    //         fontSize: 14,
    //         fontWeight: 500,
    //       },
    //       value: {
    //         color: "#fff",
    //         fontSize: 20,
    //         fontWeight: 700,
    //       },
    //       unit: {
    //         color: "#fff",
    //         fontSize: 14,
    //         fontWeight: 500,
    //       },
    //       percent: {
    //         color: "#fff",
    //         fontSize: 20,
    //         fontFamily: "D-DIN",
    //         // padding: [0, 0, 0, 10],
    //       },
    //       symbol: {
    //         fontSize: 16,
    //         fontFamily: "D-DIN",
    //         color: "#fff",
    //         // padding: [0, 20, 0, 0],
    //       },
    //     },
    //   },
    // },
    // series: [
    //   {
    //     name: "",
    //     type: "pie",
    //     radius: ["34%", "38%"],
    //     center: ["50%", "30%"],
    //     avoidLabelOverlap: false,
    //     padAngle: 5,
    //     itemStyle: {
    //       borderRadius: 4,
    //     },
    //     label: {
    //       show: false,
    //       // position: "center",
    //     },
    //     labelLine: {
    //       show: false,
    //     },
    //     data: state.value,
    //   },
    //   {
    //     name: "",
    //     type: "pie",
    //     radius: ["40%", "42%"],
    //     center: ["50%", "30%"],
    //     avoidLabelOverlap: false,
    //     label: { show: false },
    //     labelLine: { show: false },
    //     data: [{ value: 1 }],
    //     itemStyle: { color: "rgba(255, 255, 255, 0.2)" },
    //     emphasis: { disabled: true },
    //     tooltip: { show: false },
    //     silent: true,
    //     barWidth: 4,
    //   },
    //   {
    //     name: "",
    //     type: "pie",
    //     radius: ["46%", "49%"],
    //     center: ["50%", "30%"],
    //     avoidLabelOverlap: false,
    //     padAngle: 5,
    //     itemStyle: {
    //       color: "#273747",
    //     },
    //     label: {
    //       show: false,
    //       // position: "center",
    //     },
    //     labelLine: {
    //       show: false,
    //     },
    //     data: state.value,
    //   },
    //   {
    //     name: "",
    //     type: "pie",
    //     radius: ["54%", "58%"],
    //     center: ["50%", "30%"],
    //     avoidLabelOverlap: false,
    //     padAngle: 5,
    //     itemStyle: {
    //       borderRadius: 4,
    //     },
    //     label: {
    //       show: false,
    //       // position: "center",
    //     },
    //     labelLine: {
    //       show: false,
    //     },
    //     data: state.value,
    //   },
    //   {
    //     name: "",
    //     type: "pie",
    //     radius: ["61%", "62%"],
    //     center: ["50%", "30%"],
    //     avoidLabelOverlap: false,
    //     label: { show: false },
    //     labelLine: { show: false },
    //     data: [{ value: 1 }],
    //     itemStyle: { color: "rgba(255, 255, 255, 0.2)" },
    //     emphasis: { disabled: true },
    //     tooltip: { show: false },
    //     silent: true,
    //     barWidth: 4,
    //   },
    // ],

    color,
    tooltip: {
      trigger: "item",
      formatter: ({ marker, name, value }) => `${name} :<br> ${marker}  ${value}人`,
    },
    title: {
      text: `${total}`, // 饼图中间的标题
      subtext: "资产总数", // 饼图中间的副标题
      top: "26%",
      right: "0%",
      left: "50%",
      bottom: 0,
      textStyle: { // 标题样式
        color: "#D1FDFF",
        fontSize: 28,
        fontFamily: "D-DIN",
      },
      subtextStyle: { // 副标题样式
        color: "#FFFFFF",
        fontSize: 16,
      },
    },
    legend: {
      orient: "horizontal",
      show: true,
      padding: [0, 0, 0, 0],
      left: "center", // 设置水平位置居中
      top: "bottom", // 设置垂直位置在底部
      itemGap: 10,
      icon: "circle",
      formatter: (name) => {
        const value = data.find(item => item.name === name)?.value || 0;
        const percent = round((value / total) * 100, 2);
        return ` {name|${name}} {value|${value}} {unit|个} {percent|${percent}} {symbol|%}`;
      },
      data: data.map(({ name, value }, index) => {
        return {
          name,
          itemStyle: {
            color: color[index],
          },
        };
      }),
      textStyle: {
        rich: {
          name: {
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
          },
          value: {
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
          },
          unit: {
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
          },
          percent: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "D-DIN",
            // padding: [0, 0, 0, 10],
          },
          symbol: {
            fontSize: 16,
            fontFamily: "D-DIN",
            color: "#fff",
            // padding: [0, 20, 0, 0],
          },
        },
      },
    },
    series: [
      {
        name: "main-out",
        type: "pie",
        radius: ["26%", "29%"],
        center: ["50%", "34%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        label: {
          show: false,
        },
        labelLine: { show: false },
        data,
        // emphasis: { scale: false, label: { show: true } },
      },
      {
        name: "main-middle",
        type: "pie",
        radius: ["37%", "49%"],
        center: ["50%", "34%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        label: { show: false },
        labelLine: { show: false },
        data: data.map((item, index) => ({ ...item, itemStyle: { color: `${color[index]}33` } })),
        emphasis: { scale: false },
      },
      {
        name: "main-in",
        type: "pie",
        radius: ["54%", "57%"],
        center: ["50%", "34%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        label: { show: false },
        labelLine: { show: false },
        data: data.map(item => ({ ...item, itemStyle: { color: "transparent" } })), //
        emphasis: { scale: false },
      },
      {
        name: "border-out",
        type: "pie",
        radius: ["60%", "62%"],
        center: ["50%", "34%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [{ value: 1 }],
        itemStyle: { color: "rgba(255, 255, 255, 0.1)" },
        emphasis: { disabled: true },
        tooltip: { show: false },
        silent: true,
        barWidth: 4,
      },
      {
        name: "border-in",
        type: "pie",
        radius: ["33%", "34%"],
        center: ["50%", "34%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [{ value: 1 }],
        itemStyle: { color: "rgba(255, 255, 255, 0.1)" },
        emphasis: { disabled: true },
        tooltip: { show: false },
        silent: true,
        barWidth: 4,
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
// useEChartRender(chartRef, option);
const { chartInstance } = useEChartRender(chartRef, option);

let highlightIndex = 0;
let isPause = false;
const { pause, resume } = useIntervalFn(() => {
  if (isPause) return;
  const name = data[highlightIndex].name;
  chartInstance.value?.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: highlightIndex, name });
  data.forEach((_, i) => {
    i !== highlightIndex && chartInstance.value?.dispatchAction({ type: "downplay", seriesIndex: 0, dataIndex: i });
  });
  highlightIndex = (highlightIndex + 1) % data.length;
}, 2000, { immediate: false });

function highlightMainInPie(name: string) {
  const index = data.findIndex(item => item.name === name);
  const prevOption = easyClone(option.value);
  const color = prevOption.color as string[];
  (prevOption.series as any[])[2].data.forEach((item: any, i: number) => item.itemStyle.color = index == i ? color[index] : "transparent");
  chartInstance.value?.setOption(prevOption);
}

function downplayMainInPie() {
  const prevOption = easyClone(option.value);
  (prevOption.series as any[])[2].data.forEach((item: any) => item.itemStyle.color = "transparent");
  chartInstance.value?.setOption(prevOption);
}

function chartMouseoverHandler(params: any) {
  const { seriesName, name } = params;
  if (seriesName === "main-out") highlightMainInPie(name);
}

function chartMouseoutHandler() {
  downplayMainInPie();
}

function chartHighlightHandler({ name }: any) {
  highlightMainInPie(name);
}

watchEffect((onCleanup) => {
  onCleanup(() => {
    chartInstance.value?.off("mouseover", chartMouseoverHandler);
    chartInstance.value?.off("mouseout", chartMouseoutHandler);
    chartInstance.value?.off("highlight", chartHighlightHandler);
    pause();
  });
  chartInstance.value?.on("mouseover", chartMouseoverHandler);
  chartInstance.value?.on("mouseout", chartMouseoutHandler);
  chartInstance.value?.on("highlight", chartHighlightHandler);
  resume();
});
useEventListener(chartRef, "mouseover", () => isPause = true);
useEventListener(chartRef, "mouseout", () => isPause = false);
</script>

<template>
  <div ref="chart" class="wh-full" />
</template>

<style scoped>

</style>
