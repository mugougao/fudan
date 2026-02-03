<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { merge } from "lodash";
import { fetchVenueUsageRate7Days } from "@/api/campusAccess/stadium";

const publishname = useRouteQuery("publishname", "") as unknown as Ref<string>;

const { state, execute } = useAsyncState<{ name: string; value: number }[]>(async () => {
  const [err, res] = await to(fetchVenueUsageRate7Days(publishname.value));
  if (err) return [];
  return res?.resultData || [];
}, [], { immediate: true, resetOnExecute: false });

watch(publishname, () => execute());

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
