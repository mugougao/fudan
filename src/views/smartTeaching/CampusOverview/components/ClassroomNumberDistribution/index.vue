<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";

defineOptions({ name: "ClassroomNumberDistribution", inheritAttrs: false });

const { data } = defineProps<{
  data: { name: string; value: number }[];
}>();

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      xAxis: {
        axisLabel: {
          formatter: name => name.replace(/[ \t\n\r]+/g, "").replace(/(.{3})/g, "$1\n"),
        },
      },
    },
  );
}
</script>

<template>
  <div class="row-span-11 flex flex-col">
    <UiSubTitle title-path="smartsTeaching.classroomNumberDistribution" />
    <div class="flex-auto overflow-hidden pt-2">
      <UiChartBar
        :data="data" legend="数量" unit="间" color="red"
        :merge-option="mergeOption" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
