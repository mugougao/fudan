<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import dayjs from "dayjs";
import { fetchCampusGateInOutStatistics30Days, fetchCampusGateInOutStatisticsAVG } from "@/api/campusAccess/campusSchool";
import { numberToThousands } from "@/utils";

defineOptions({ name: "NumberOfSchoolAttendances" });

// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

// 进校次数
const { state, execute } = useAsyncState(async () => {
  if (!schoolDoorId.value) return [];
  const [err, res] = await to(fetchCampusGateInOutStatistics30Days(schoolDoorId.value));
  if (err) return [];
  return (res?.resultData || []).map(({ name, value }) => {
    return {
      name: dayjs(name).format("M-D"),
      value,
    };
  });
}, [], { immediate: true, resetOnExecute: false });

const { state: avgState, execute: avgExecute } = useAsyncState(async () => {
  if (!schoolDoorId.value) return 0;
  const [err, res] = await to(fetchCampusGateInOutStatisticsAVG(schoolDoorId.value));
  if (err) return 0;
  return res?.resultData || 0;
}, 0, { immediate: true, resetOnExecute: false });

watch(
  () => schoolDoorId.value,
  () => {
    avgExecute();
    execute();
  },
);
</script>

<template>
  <div class="row-span-10 flex flex-col pt-2">
    <UiSubTitle title-path="campusAccess.numberOfSchoolAttendances" class="shrink-0" />
    <UiCountItemStrip icon="i-svg-icon-raw-user3" :name="$t('campusAccess.average')" :value="numberToThousands(avgState)" unit="人次" />
    <div class="flex-auto overflow-hidden">
      <UiChartBar :data="state" legend="进校人次" unit="人" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
