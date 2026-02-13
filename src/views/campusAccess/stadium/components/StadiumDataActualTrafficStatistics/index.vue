<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
// import to from "await-to-js";
import { merge } from "lodash";
// import { fetchVenueUsageRate7Days } from "@/api/campusAccess/stadium";

const publishname = useRouteQuery("publishname", "") as unknown as Ref<string>;

// 硬编码近七天场馆预约数据
const state = ref<{ name: string; value: number }[]>([
  { name: "周一", value: 125 },
  { name: "周二", value: 98 },
  { name: "周三", value: 156 },
  { name: "周四", value: 112 },
  { name: "周五", value: 189 },
  { name: "周六", value: 234 },
  { name: "周日", value: 201 },
]);

// watch(publishname, () => execute());

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      series: [
        { name: "人流量" },
      ],
    },
  );
}
</script>

<template>
  <div class="wh-full">
    <UiChartLine :data="state" unit="人" :merge-option="mergeOption" />
  </div>
</template>

<style scoped>

</style>
