<script setup lang="ts">
import to from "await-to-js";
import get from "lodash/get";
import { fetchOverviewCount } from "@/api/campusAccess/stadium";
import { numberToThousands } from "@/utils";

defineOptions({ name: "StadiumDataActualCount" });

const { state } = useAsyncState(async () => {
  const [err, res] = await to(fetchOverviewCount());
  if (err) return {};
  return res?.resultData || {};
}, {}, { immediate: true, resetOnExecute: false });
</script>

<template>
  <div class="stadium-data-actual-count h-[70px] flex shrink-0 gap-1 children:flex-1">
    <UiCountItemBox
      icon="i-svg-icon-calendar" icon-text="今日" name="今日预约场次" :value="numberToThousands(get(state, 'jr', 0))" unit="次"
      value-vertical />
    <UiCountItemBox
      icon="i-svg-icon-calendar" icon-text="年度" name="年度预约场次" :value="numberToThousands(get(state, 'jn', 0))" unit="次"
      value-vertical />
  </div>
</template>

<style scoped>

</style>
