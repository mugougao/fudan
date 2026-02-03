<script setup lang="ts">
import to from "await-to-js";
import { fetchSwimmingPoolUsageRate7Days } from "@/api/campusAccess/stadium";

const { state, execute } = useAsyncState<{ name: string; value: number }[]>(async () => {
  const [err, res] = await to(fetchSwimmingPoolUsageRate7Days());
  if (err) return [];
  return res?.resultData || [];
}, [], { immediate: true, resetOnExecute: false });
</script>

<template>
  <div class="h-full w-full">
    <UiChartBar :data="state" legend="人数" unit="人" />
  </div>
</template>

<style scoped>

</style>
