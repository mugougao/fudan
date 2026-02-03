<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { computed } from "vue";
import { useEChartRender } from "@/hooks";

defineOptions({ name: "EChartRender" });
const props = defineProps<{
  option: EChartsOption;
  theme?: string;
}>();
const chartRef = useTemplateRef<HTMLElement>("chartRef");
const option = computed(() => props.option);
const { chartInstance, setOption, resize } = useEChartRender(chartRef, option, props.theme);

defineExpose({ chartRef, chartInstance, setOption, resize });
</script>

<template>
  <div ref="chartRef" />
</template>

<style scoped></style>
