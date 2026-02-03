<script setup lang="ts">
import type { ECharts, EChartsOption } from "echarts";
import { useElementSize, useResizeObserver } from "@vueuse/core";
import * as echart from "echarts";
import { nextTick, onBeforeUnmount, onWatcherCleanup, shallowRef, watch } from "vue";
import { numberToCss, sleep } from "@/utils/index.ts";

defineOptions({ name: "RenderEchart", inheritAttrs: false });

const {
  width = "100%",
  height = "100%",
  option,
  theme = "default",
  isEmpty = false,
  delay = 0,
  setOptionBeforeClear = false,
  renderer = "svg",
} = defineProps<{
  width?: string | number;
  height?: string | number;
  option: EChartsOption;
  theme?: string;
  isEmpty?: boolean;
  delay?: number; // 延迟渲染
  // 是否在 setOption 前清空
  setOptionBeforeClear?: boolean;
  renderer?: "canvas" | "svg";
}>();

const emit = defineEmits<{
  mounted: [chart: ECharts];
  beforeDestroy: [chart: ECharts];
}>();

const attrs = useAttrs();

const getTransitionDuration = inject("TransitionDuration", () => 0);
const getTransitionIsEnd = inject("TransitionIsEnd", () => true);

const containerRef = useTemplateRef<HTMLElement>("container");
const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);
const chartEl = useTemplateRef<HTMLElement>("chart");
const chartInstance = shallowRef<ECharts | undefined>(undefined);

function createChart() {
  if (!chartEl.value || chartInstance.value) return;
  chartInstance.value = echart.init(chartEl.value, theme, { renderer });
  if (option) {
    chartInstance.value.setOption(option);
    emit("mounted", chartInstance.value);
  }
  else {
    console.error("option 为空");
  }
}

function destroyChart() {
  if (!chartInstance.value) return;
  chartInstance.value.clear();
  chartInstance.value.dispose();
  chartInstance.value = undefined;
}

watch(
  () => chartEl.value,
  async () => {
    onWatcherCleanup(destroyChart);
    await nextTick();
    if (getTransitionIsEnd()) {
      await sleep(200);
      return createChart();
    }
    const _transitionDuration = getTransitionDuration();
    const _delay = Math.max(_transitionDuration, delay);
    if (_delay) await sleep(_delay);
    createChart();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (!chartInstance.value) return;
  emit("beforeDestroy", chartInstance.value);
  destroyChart();
});

watch(
  () => theme,
  async () => {
    destroyChart();
    await nextTick();
    createChart();
  },
);

watch(
  () => option,
  () => {
    if (!chartInstance.value) return;
    setOptionBeforeClear && chartInstance.value.clear();
    chartInstance.value.setOption(option);
  },
  { deep: false },
);

useResizeObserver(containerRef, () => {
  chartInstance.value?.resize?.();
});

// 监听事件
const listener = computed<Record<string, ((...args: any[]) => void)>>(() => {
  return Object.entries(attrs).reduce((prev, [key, value]) => {
    if (!/^on[^a-z]/.test(key)) return prev;
    if (typeof value !== "function") return prev;
    let eventName = key;
    let callback = value;
    if (key.endsWith("Once")) {
      // onClickOnce ==> onClick
      eventName = key.replace("Once", "");
      callback = (...args: any): void => {
        value(...args);
        chartInstance.value?.off(eventName, callback);
      };
    }
    // onClick => click
    eventName = eventName.replace(/^on/, "").replace(/^[A-Z]/, match => match.toLowerCase());
    prev[eventName] = callback as ((...args: any[]) => void);
    return prev;
  }, {} as Record<string, (...args: any[]) => void>);
});
watchEffect((onCleanup) => {
  onCleanup(() => {
    if (!chartInstance.value) return;
    Object.entries(listener.value).forEach(([eventName, listener]) => {
      chartInstance.value?.off(eventName, listener);
    });
  });
  if (!chartInstance.value) return;
  Object.entries(listener.value).forEach(([eventName, listener]) => {
    chartInstance.value?.on(eventName, listener);
  });
});
</script>

<template>
  <div ref="container" class="render-echart" :class="$attrs.class" :style="{ width: numberToCss(width), height: numberToCss(height) }">
    <div v-if="isEmpty" class="h-full w-full flex items-center justify-center">
      <AEmpty description="暂无数据" />
    </div>
    <div v-else ref="chart" class="content-chart" :style="{ width: numberToCss(containerWidth), height: numberToCss(containerHeight) }" />
  </div>
</template>

<style lang="scss" scoped></style>
