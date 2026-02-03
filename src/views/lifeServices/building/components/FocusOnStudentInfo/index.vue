<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { IScrollTableBoardColumn } from "@/components/ScrollBoardTable/index.vue";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "FocusOnStudentInfo" });

const { lengthStay = [], personWarn = { count: 0, list: [] }, checkOutTime = [] } = defineProps<{
  lengthStay?: any[];
  personWarn?: { count: number; list: any[] };
  checkOutTime?: any[];
}>();

const tagList = [
  { name: "累计住宿时长", value: 0, icon: "i-svg-reset-accommodation-duration" },
  { name: "人员预警", value: 1, icon: "i-svg-reset-personnel-warning" },
  { name: "预计退宿时间", value: 2, icon: "i-svg-reset-key-students" },
];

const checkedValue = ref(0);

const data = computed(() => {
  if (checkedValue.value === 0) {
    return lengthStay;
  }
  else if (checkedValue.value === 1) {
    return [];
  }
  else {
    return checkOutTime;
  }
});

const option = computed(() => {
  const category = (data.value || []).map(item => item.name);
  const value = (data.value || []).map(item => item.value);
  return {
    grid: { top: 15, left: 40, right: 10, bottom: 25 },
    tooltip: { show: true, valueFormatter: (value: number) => `${value}人` },
    xAxis: { type: "category", data: category, axisLabel: { fontSize: 16, color: "#9E9E9E" } },
    yAxis: { type: "value", axisLabel: { fontSize: 16, color: "#9E9E9E" }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.5)" } } },
    series: [{
      type: "bar",
      data: value,
      barWidth: 16,
      label: {
        show: true,
        position: "top",
        distance: 0,
        formatter: () => "{box|}",
        rich: { box: { width: 20, height: 4, backgroundColor: "#D8D8D8", shadowBlur: 2, shadowColor: "#FFF" } },
      },
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0.2, color: "#D8D8D8" },
            { offset: 1, color: "rgba(216, 216, 216, 0) " },
          ],
          global: false,
        },
      },
    }],
  } as EChartsOption;
});

const chartEl = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartEl, option);

const personWarnColumns: IScrollTableBoardColumn[] = [
  { title: "序号", field: "index", width: 40, align: "center" },
  { title: "姓名", field: "xm", width: 80, align: "center" },
  { title: "房间号", field: "fjmc", width: 80, className: "!text-14px", ellipsis: true },
  { title: "院系", field: "yx", className: "!text-14px", ellipsis: true },
];
</script>

<template>
  <BoxPanel
    class="row-span-7" title="重点关注学生信息"
    content-class-name="flex flex-col">
    <ul class="tag-select flex items-center gap-2">
      <li v-for="({ name, value, icon }) in tagList" :key="icon" class="flex-1">
        <label class="relative h-36px w-full flex-center cursor-pointer gap-2 bg-black/40 text-16px" @click="checkedValue = value">
          <input class="hidden" type="radio" :checked="value === checkedValue">
          <i :class="icon" />
          <span>{{ name }}</span>
        </label>
      </li>
    </ul>
    <div v-if="checkedValue !== 1" class="flex-auto overflow-hidden">
      <EmptyWrapper :is-empty="!data?.length">
        <div ref="chart" class="h-full w-full" />
      </EmptyWrapper>
    </div>
    <div v-else class="flex flex-auto items-center overflow-hidden">
      <div class="min-w-100px flex flex-col flex-shrink-0 items-center justify-center text-16px font-title">
        <span class="empty-number text-36px">{{ personWarn.count || 0 }}</span>
        <span>预警总人数</span>
      </div>
      <LightLine color="#fff" height="80px" width="2px" type="vertical" class="mx-2" />
      <div class="h-full flex-auto pt-2">
        <ScrollBoardTableWrap
          row-key="xh"
          header-cell-class-name="text-14px text-#AFB9C3"
          row-class-name="after:hidden"
          :columns="personWarnColumns"
          :data="personWarn.list.map((item, index) => ({ index: index + 1, ...item }))" :size="3" />
      </div>
    </div>
  </BoxPanel>
</template>

<style scoped lang="scss">
.tag-select {
  label {
    &:after,
    &:before {
      content: "";
      @apply absolute left-0 right-0 w-full h-14px border-l border-r border-white;
    }
    &:after {
      @apply border-t top-0;
    }
    &:before {
      @apply border-b bottom-0;
    }
    &:has(input[type="radio"]:checked) {
      &:after,
      &:before {
        @apply border-#18FEFE/50;
      }
      span {
        @apply text-shadow-[0px_0px_10px_0px_rgba(24,254,254,0.5)];
      }
      i {
        color: #18fefe;
      }
    }
  }
}
</style>
