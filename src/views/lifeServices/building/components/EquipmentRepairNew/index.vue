<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useEChartRender } from "@/hooks";
import { cn } from "@/utils";

defineOptions({ name: "FocusOnStudentInfo" });

const { lengthStay = [], personWarn = { count: 0, list: [] }, checkOutTime = [] } = defineProps<{
  lengthStay?: any[];
  personWarn?: { count: number; list: any[] };
  checkOutTime?: any[];
}>();

const tagList = [
  { name: "dormitory.build.lengthOfStay", value: 0, icon: "i-svg-reset-accommodation-duration" },
  // { name: "人员预警", value: 1, icon: "i-svg-reset-personnel-warning" },
  { name: "dormitory.build.checkOutTime", value: 2, icon: "i-svg-reset-key-students" },
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
</script>

<template>
  <UiBoxPanel
    class="row-span-8" title-path="dormitory.build.focusOnStudent"
    content-class-name="flex flex-col">
    <ul class="dormitory-area-nav mx-3 mb-2 flex gap-3">
      <li
        v-for="({ name, value }) in tagList" :key="value"
        :class="cn(
          'px-3 relative cursor-pointer whitespace-nowrap flex-1 text-center py-0.5',
          'border border-white/60',
          'bg-gradient-to-b bg-[#000A17]/60 from-white/10 via-white/30 to-transparent',
          'text-[16px] text-white/60 text-[14px]',
          checkedValue === value && 'text-white border-[#CC1A1A] from-[#DC2F2F]/25 via-[#DC2F2F]/75 via-90% bg-[#000A17]/40',
        )"
        @click="checkedValue = value">
        <span :class="cn('absolute left-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', checkedValue === value && 'bg-[#EABC8B]')" />
        <span :class="cn('absolute right-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', checkedValue === value && 'bg-[#EABC8B]')" />
        <span>{{ $t(name) }}</span>
      </li>
    </ul>
    <div class="flex-auto overflow-hidden">
      <UiChartBar :data="data" legend="学生数量" unit="人" />
    </div>
  </UiBoxPanel>
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
