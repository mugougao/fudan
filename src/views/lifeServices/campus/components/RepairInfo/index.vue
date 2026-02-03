<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender, useState } from "@/hooks";

defineOptions({ name: "RepairInfo" });

function getOption(data: { label: string;value: number }[]) {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: ([{ value, name, marker }]: any[]) => {
        console.log("=>(index.ts:13) marker", marker);
        return `${name}：<br/><span class="wh-10px rounded-full mr-4px bg-#FFD35B inline-block"></span> ${value} 单`;
      },
    },
    grid: { top: 35, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: "value",
      nameTextStyle: { padding: [0, 30, 0, 0] },
      position: "top",
      splitLine: { show: true, lineStyle: { color: "#363940" } },
      axisLabel: { fontFamily: "D-DIN", fontSize: 18, color: "#C1C2C7" },
    },
    yAxis: {
      type: "category",
      data: data.map(item => item.label),
      axisLabel: { fontSize: 18, color: "#F1FBFD" },
      axisLine: { show: false },
      splitLine: { show: true, lineStyle: { color: "#494A4B" } },
    },
    series: [
      {
        type: "bar",
        data: data.map(item => item.value),
        barWidth: 4,
        label: { show: true, position: "right", color: "#fff", fontSize: 18 },
        itemStyle: { color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: "rgba(213, 188, 24, 0.3)" },
            { offset: 0.5, color: "#FFD35B" },
            { offset: 0.8, color: "#FFFFFF" },
            { offset: 1, color: "#FFFFFF" },
          ],
          global: false,
        } },
      },
    ],
  } as EChartsOption;
}

const option = computed(() => getOption(
  [
    { label: "本部", value: 7 },
    { label: "东区", value: 6 },
    { label: "北区", value: 5 },
    { label: "南区", value: 4 },
  ].reverse(),
));
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);

// ==================== 物业数据大屏 =====================
const [open, setOpen] = useState(false);
const fullscreenTargetRef = useTemplateRef<HTMLDivElement>("fullscreenTarget");
const { isFullscreen, toggle } = useFullscreen(fullscreenTargetRef);
// ==================== 物业数据大屏 =====================
</script>

<template>
  <BoxPanel
    class="row-span-9" title="修缮信息"
    content-class-name="flex flex-col">
    <template #extra>
      <TabNavExtraItem v-model="open" class="mr-2" @change="(val) => setOpen(val)">
        物业数据大屏
      </TabNavExtraItem>
    </template>
    <div class="count mx-auto h-56px w-235px flex items-baseline justify-end pt-1">
      <span class="text-16px">总维修单数</span>
      <GradientText class="ml-16px mr-7px text-24px font-number" :deg="0" :colors="{ 0: '#FFE798', 100: '#FFE95E' }">
        18
      </GradientText>
      <span class="mr-12px text-14px">单</span>
    </div>
    <div ref="chart" class="w-full flex-auto overflow-hidden" />

    <DragPopup v-model:visible="open" :width="1536" left="auto">
      <template #title>
        <div class="flex items-center justify-between">
          <span>物业数据大屏</span>
          <button type="button" class="flex-center rounded bg-transparent wh-36px hover:bg-white/10" @click="toggle">
            <i :class="[isFullscreen ? 'i-ri-fullscreen-exit-line' : 'i-ri-fullscreen-line']" />
          </button>
        </div>
      </template>
      <div ref="fullscreenTarget" class="h-864px bg-gray-900">
        <iframe src="https://workspace.easyv.cloud/shareScreen/eyJzY3JlZW5JZCI6MzAzMzUwOX0=" width="100%" height="100%" />
      </div>
    </DragPopup>
  </BoxPanel>
</template>

<style scoped lang="scss">
.count {
  background:
    url("@/assets/images/lifeServices/campus/RepairInfoIcon.png") no-repeat 18px center / 30px 30px,
    url("@/assets/images/lifeServices/campus/RepairInfoBg.png") no-repeat center / 100% 100%;
}
</style>
