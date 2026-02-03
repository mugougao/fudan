<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useI18n } from "vue-i18n";
import { useEChartRender } from "@/hooks";
import { useI18nStore } from "@/stores/i18n.ts";

defineOptions({ name: "CourseTypeDistribution" });

const { lessonsData, classTimeData, classTimeTotal } = defineProps<{
  lessonsData: { name: string; value: number }[];
  classTimeData: { name: string; value: number }[];
  classTimeTotal: number;
}>();

const { t } = useI18n();
const { isChinese } = storeToRefs(useI18nStore());

const activeTab = ref(0);
const tabNav = [
  { label: "课时", value: 0 },
  { label: "课程", value: 1 },
];
const title = computed(() => tabNav.find(({ value }) => value === activeTab.value)?.label);

const unit = computed(() => activeTab.value === 0 ? "%" : "");
const data = computed(() => activeTab.value === 0 ? classTimeData : lessonsData);
const lessonsTotal = computed(() => lessonsData.reduce((prev, { value }) => prev + value, 0));
const total = computed(() => activeTab.value === 0 ? classTimeTotal : lessonsTotal.value);

const color = ["#0A84FF", "#8CDEFF", "#CBD8EB"];
const option = computed(() => {
  const titleText = tabNav.find(({ value }) => value === activeTab.value)?.label;
  return {
    title: {
      text: `${total.value}`,
      subtext: `${t(titleText!)}${toValue(isChinese) ? "总数" : "Total"}`,
      top: "36%",
      right: "50%",
      left: "27%",
      bottom: 0,
      textStyle: { color: "#fff", fontSize: 24 },
      subtextStyle: { color: "#D1D1D1", fontSize: 14 },
    },
    legend: {
      orient: "vertical",
      padding: [0, 0, 0, 0],
      top: "center",
      right: 20,
      itemGap: 30,
      itemWidth: 12,
      itemHeight: 12,
      height: 200,
      width: 100,
      formatter: (name) => {
        const value = data.value.find((item: any) => item.name === name)?.value || 0;
        return `{name|${name}}  {value|${value || 0}} {unit|${unit.value}}`;
      },
      data: data.value.map(({ name }, index: number) => ({
        name,
        itemStyle: { color: color[index] },
        textStyle: {
          rich: {
            name: { fontSize: 16, width: 50, fontWeight: 500, color: "#fff" },
            value: { fontSize: 20, fontFamily: "D-DIN", color: `url(#course-type-distribution-text-gradient-${index % color.length})` },
            unit: { fontSize: 16, color: "#fff" },
          },
        },
      })),
    },
    series: data.value.reduce((prev, { name, value }, index) => {
      const start = `${90 - 15 * index}%`;
      const end = `${95 - 15 * index}%`;
      return [
        {
          name,
          type: "pie",
          radius: [start, end],
          center: ["28%", "50%"],
          labelLine: { show: false },
          clockWise: false,
          data: [
            { value, itemStyle: { color: color[index] } },
            { value: 5, itemStyle: { color: "transparent" } },
          ],
        },
        {
          type: "pie",
          radius: [end, end],
          center: ["28%", "50%"],
          itemStyle: { borderWidth: 2, borderColor: "rgb( 29, 37, 41)" },
          labelLine: { show: false },
          data: [{ value: 1 }],
        },
        ...prev,
      ];
    }, [] as any[]) as any[],
  } as EChartsOption;
});
const chartEl = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartEl, option);
</script>

<template>
  <div class="row-span-5 flex flex-col">
    <UiSubTitle title-path="smartsTeaching.courseTypeDistribution" class="shrink-0">
      <template #extra>
        <UiSegmented v-model="activeTab" :options="tabNav" />
      </template>
    </UiSubTitle>
    <div class="flex-auto overflow-hidden">
      <UiChartPie :data="data" :title="`${title}总数`" :series-name="title" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-nav {
  li + li :before {
    content: "/";
    @apply inline-block mx-1;
  }
}
</style>
