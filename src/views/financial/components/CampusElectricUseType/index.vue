<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { cn, createEChartsRadialGradient, largestRemainderMethod, numberToThousands } from "@/utils";

defineOptions({ name: "CampusElectricUseType", inheritAttrs: false });

const data = [
  { name: "照明插座", value: 10 },
  { name: "空调", value: 20 },
  { name: "动力", value: 30 },
  { name: "特殊设备", value: 40 },
  { name: "电梯", value: 50 },
];
const colors = ["#5E5CE6", "#64D2FF", "#0A84FF", "#32D74B", "#D4DEEC"];
const option = computed(() => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const percents = largestRemainderMethod(data, 2);

  return {
    color: colors,
    tooltip: { trigger: "item" },
    title: {
      text: `${numberToThousands(total)}`,
      textStyle: { fontSize: 20, fontFamily: "D-DIN", color: "#fff" },
      subtext: `用电总数(Kwh)`,
      subtextStyle: { fontSize: 14, fontFamily: "AlibabaPuHuiTi-3-medium", color: "#C0C0C0" },
      left: "24%",
      top: "33%",
    },
    legend: {
      orient: "vertical",
      icon: "circle",
      top: "center",
      left: "50%",
      itemWidth: 16,
      itemHeight: 16,
      data: data.map(({ name }, index) => {
        const color = colors[index % colors.length];
        return {
          name,
          itemStyle: {
            color: createEChartsRadialGradient(
              [
                { color, offset: 0 },
                { color, offset: 0.4 },
                { color: "rgba(0,0,0,0)", offset: 0.4 },
                { color: "rgba(0,0,0,0)", offset: 1 },
              ],
              [0.5, 0.5, 0.5],
            ),
            borderColor: color,
            borderWidth: 1,
          },
          textStyle: {
            rich: {
              name: { color: "#fff", fontSize: 14, fontFamily: "AlibabaPuHuiTi-3-medium", width: 70 },
              percent: { color: `url(#CampusElectricUseType_${index})`, fontSize: 16, fontFamily: "D-DIN", width: 70, align: "right" },
            },
          },
        };
      }),
      formatter: (name: string) => {
        const percent = percents.find(item => item.name === name)?.percent || 0;
        return `{name|${name}} {percent|${percent}%}`;
      },

    },
    series: [
      {
        name: "用电类型",
        type: "pie",
        radius: ["75%", "80%"],
        center: ["25%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        padAngle: 2,
        data,
        z: 10,
      },
      {
        type: "pie",
        radius: ["70%", "85%"],
        center: ["25%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        tooltip: { show: false },
        data: [{ value: 1, itemStyle: { color: "rgba(0,0,0,0)", borderColor: "rgba(255,255,255,0.2)", borderWidth: 1 } }],
      },
      {
        type: "pie",
        radius: ["0%", "63%"],
        center: ["25%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        tooltip: { show: false },
        data: [{ value: 1, itemStyle: { color: "rgba(255,255,255,0.05)" } }],
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="cn('campus-electric-use-type flex flex-col', $attrs?.class || '')">
    <SecondTitle>用电类型分布</SecondTitle>
    <div class="flex-auto overflow-hidden">
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            v-for="(color, index) in colors"
            :id="`CampusElectricUseType_${index}`"
            :key="color" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" :stop-color="color" />
          </linearGradient>
        </defs>
      </svg>
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
