<script setup lang="ts">
import type { EChartsOption } from "echarts";

defineOptions({ name: "RepairBarChart", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value: number }[];
}>();

const option = computed(() => {
  return {
    grid: { left: "5%", right: "5%", bottom: "2%", top: "20%", containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: data.map(item => item.name),
    },
    yAxis: { type: "value", name: "单位/个", nameTextStyle: { padding: [0, 30, 0, 0] } },
    series: [
      {
        data: data.map(item => item.value),
        type: "bar",
        barWidth: 20,
        showBackground: true,
        backgroundStyle: { color: "#97979733" },
        itemStyle: {
          color: "#66C9FF4D",
          borderColor: "#66C9FF",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: "top",
          color: "#66C9FF",
          formatter: "{dot|}",
          rich: {
            dot: { width: 20, height: 4, backgroundColor: "#66C9FF" },
          },
        },
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div :class="$attrs.class ?? ''">
    <UiChartBar :data="data" legend="数量" unit="个" />
  </div>
</template>

<style scoped lang="scss">

</style>
