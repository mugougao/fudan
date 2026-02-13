<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import type { IGetClassroomBusynessTop5Result } from "@/api/smartTeaching";
import { useRouteQuery } from "@vueuse/router";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "TeachingBuildingPopup" });

const visible = defineModel<boolean>("visible", { default: false });

// 当前楼栋
const buildId = useRouteQuery<string>("buildId", "") as unknown as Ref<string>;

const { execute, state } = useAsyncState<IGetClassroomBusynessTop5Result>(async () => {
  if (!buildId.value) return [];

  // 硬编码教室繁忙度排行数据
  const classroomBusynessData: Record<string, IGetClassroomBusynessTop5Result> = {
    141: [ // H6教学楼繁忙度排行
      { num: 95, js: "501" },
      { num: 90, js: "201" },
      { num: 88, js: "301" },
      { num: 85, js: "101" },
      { num: 82, js: "401" },
    ],
    140: [ // H5教学楼繁忙度排行
      { num: 92, js: "301" },
      { num: 88, js: "201" },
      { num: 85, js: "101" },
      { num: 80, js: "401" },
      { num: 75, js: "501" },
    ],
    144: [ // JB教学楼繁忙度排行
      { num: 90, js: "101" },
      { num: 85, js: "201" },
      { num: 82, js: "301" },
      { num: 78, js: "401" },
      { num: 72, js: "501" },
    ],
  };

  // 返回对应楼栋的数据，如果没有则返回默认数据
  return classroomBusynessData[buildId.value] || [
    { num: 85, js: "101" },
    { num: 80, js: "201" },
    { num: 75, js: "301" },
    { num: 70, js: "401" },
    { num: 65, js: "501" },
  ];

  // 注释掉原来的API调用
  // const [err, res] = await to(getClassroomBusynessTop5(buildId.value));
  // if (err) return [];
  // return res?.resultData || [];
}, [], { immediate: false, resetOnExecute: false });

watch(() => [visible.value, buildId.value], () => {
  if (!visible.value) return;
  if (buildId.value) execute();
}, { immediate: true });
watch(() => buildId.value, () => !buildId.value && (visible.value = false), { immediate: true });

// 教室繁忙度排行
// 根据排名返回颜色
function getColor(rank: any) {
  let color = "#6FF2A4";
  if (rank <= 0) color = "#6FF2A4"; // 前三名为红色
  else if (rank <= 1) color = "#4F7ED3"; // 第四到第七名为黄色
  else color = "#4F99D3"; // 第八到第十名为橘色
  return {
    type: "linear",
    x: 1,
    y: 0,
    x2: 0,
    y2: 0,
    colorStops: [
      { offset: 0, color },
      { offset: 1, color: "rgba(160, 220, 169, 0)" },
    ],
    global: false,
  };
}
const option1 = computed(() => {
  const yAxisDataLeft: string[] = [];
  const xAxisDataLeft: number[] = [];
  state.value.forEach((item, index: number) => {
    yAxisDataLeft.push(item.js);
    xAxisDataLeft.push(item.num);
  });

  return {
    grid: { left: 20, bottom: -10, right: 20, top: 0 },
    yAxis: [
      {
        inverse: true,
        data: yAxisDataLeft,
        axisLabel: {
          show: true,
          inside: true,
          formatter: (name: string, index: number) => {
            const top = `TOP${index + 1}`;
            const value = xAxisDataLeft[index];
            return `{round|} {top|${top}} {name|${name}} {percent|${value}%}`;
          },
          textStyle: {
            padding: [0, 0, 30, 0],
            rich: {
              round: { width: 8, height: 8, backgroundColor: "#FDDFB3", align: "left", padding: [0, 0, 0, 0], borderRadius: 4 },
              top: { width: 50, color: "#FFE6B3", fontSize: 16, align: "left", padding: [0, 0, 0, 5] },
              name: { width: 200, color: "#BED0DB", fontSize: 16, align: "left", padding: [0, 0, 0, 3] },
              percent: { width: 80, color: "#fff", fontSize: 16, align: "right", padding: [0, 0, 0, 5] },
            },
          },
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
      },
    ],
    xAxis: { max: 100, show: false },
    series: [
      {
        // 背景住
        type: "bar",
        barGap: "-100%",
        silent: true,
        barWidth: 4,
        data: [100, 100, 100, 100, 100],
        itemStyle: { color: "#252E37" },
      },
      {
        type: "bar",
        data: xAxisDataLeft.map((value, index) => ({ value, itemStyle: { color: getColor(index) } })),
        barWidth: 4,
      },
    ],
  } as EChartsOption;
});
const chart = useTemplateRef<HTMLElement>("building");
useEChartRender(chart, option1);
</script>

<template>
  <div class="teachingBuildingPopup">
    <DragPopup v-model:visible="visible" title="教室繁忙度排行" :width="460" top="130px" :left="380">
      <EmptyWrapper :is-empty="!state?.length" height="350px">
        <div ref="building" class="h-350px w-full" />
      </EmptyWrapper>
    </DragPopup>
  </div>
</template>

<style scoped>

</style>
