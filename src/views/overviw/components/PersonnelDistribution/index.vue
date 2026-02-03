<script setup lang="tsx">
import type { EChartsOption } from "echarts";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "PersonnelDistribution", inheritAttrs: false });

const data = [
  { name: "本科生", value: 15420 },
  { name: "研究生", value: 36012 },
  { name: "学历留学生", value: 2011 },
];
const colors = ["#F37373", "#778BF1", "#FFFFFF"];
const option = computed(() => {
  const total = data.reduce((prev, cur) => prev + cur.value, 0);
  const serieData = data.map((item, index) => {
    return {
      ...item,
      itemStyle: {
        color: colors[index % colors.length],
      },
    };
  });
  //
  return {
    grid: { top: 0, left: 0, right: 0, bottom: 0 },
    title: [
      {
        text: `{text|${numberToThousands(total)}}`,
        left: "75",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 22,
              fontFamily: "D-DIN",
              color: "#fff",
              height: 60,
              padding: [15, 5, 15, 5],
            },
          },
        },
      },
      {
        text: `{text|人员总数}`,
        left: "75",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              padding: [55, 5, 15, 5],
            },
          },
        },
      },
    ],
    tooltip: { trigger: "item", valueFormatter: (value: number) => `${value}人` },
    legend: {
      top: "center",
      left: "55%",
      padding: [40, 0, 0, 0],
      orient: "vertical",
      itemWidth: 4,
      itemHeight: 4,
      itemGap: 12,
      formatter: (name: string) => {
        const value = data.find(item => item.name === name)?.value || 0;
        return `{name|${name}} {value|${value}人}`;
      },
      // width: 200,
      data: data.map((item, index) => {
        return {
          name: item.name,
          textStyle: {
            rich: {
              name: { width: 50, color: "#fff", fontSize: 12, fontFamily: "AlibabaPuHuiTi-3-medium" },
              value: { width: 50, color: `url(#PersonnelDistribution_${index % colors.length})`, fontSize: 12, fontFamily: "D-DIN", align: "right" },
            },
          },
        };
      }),
    },
    series: [
      {
        type: "pie",
        radius: [55, 59],
        center: [80, "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        data: serieData,
        z: 1,
      },
      {
        type: "pie",
        radius: [47, 59],
        center: [80, "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        itemStyle: { opacity: 0.2 },
        data: serieData,
        z: 2,
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="cn('personnel-distribution flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.peopleDistribution" class="shrink-0" />
    <div class="chart-box relative flex-auto overflow-hidden">
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            v-for="(color, index) in colors"
            :id="`PersonnelDistribution_${index}`"
            :key="color" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" :stop-color="color" />
          </linearGradient>
        </defs>
      </svg>
      <i class="i-svg-icon-raw-dr2 absolute left-[65px] top-[55px] text-2xl" />
      <RenderEchart :option="option" />
    </div>
    <div class="mb-5 flex shrink-0 items-center justify-evenly">
      <UiCountItem icon="i-svg-icon-test" :name="$t('overviw.teacher')" :value="numberToThousands(3647)" unit="人" />
      <LightLine type="vertical" width="1px" height="50px" color="#fff" />
      <UiCountItem icon="i-svg-icon-dr" :name="$t('overviw.acad')" :value="numberToThousands(59)" unit="人" type="yellow" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/pie-bg-2.png") no-repeat 10px center / 140px 140px;
}
</style>
