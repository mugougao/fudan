<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
// import to from "await-to-js";
import dayjs from "dayjs";
// import { fetchCampusGateInOutStatistics30Days, fetchCampusGateInOutStatisticsAVG } from "@/api/campusAccess/campusSchool";
import { numberToThousands } from "@/utils";

defineOptions({ name: "NumberOfSchoolAttendances" });

// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

// 模拟数据：门岗近30天进校人次
const mockGate30DaysData: Record<string, { name: string; value: number }[]> = {
  "校门1": [
    { name: "1-1", value: 125 },
    { name: "1-2", value: 132 },
    { name: "1-3", value: 118 },
    { name: "1-4", value: 142 },
    { name: "1-5", value: 135 },
    { name: "1-6", value: 128 },
    { name: "1-7", value: 152 },
    { name: "1-8", value: 145 },
    { name: "1-9", value: 138 },
    { name: "1-10", value: 162 },
    { name: "1-11", value: 155 },
    { name: "1-12", value: 148 },
    { name: "1-13", value: 135 },
    { name: "1-14", value: 142 },
    { name: "1-15", value: 158 },
    { name: "1-16", value: 165 },
    { name: "1-17", value: 152 },
    { name: "1-18", value: 145 },
    { name: "1-19", value: 138 },
    { name: "1-20", value: 125 },
    { name: "1-21", value: 132 },
    { name: "1-22", value: 148 },
    { name: "1-23", value: 155 },
    { name: "1-24", value: 162 },
    { name: "1-25", value: 158 },
    { name: "1-26", value: 145 },
    { name: "1-27", value: 138 },
    { name: "1-28", value: 152 },
    { name: "1-29", value: 165 },
    { name: "1-30", value: 158 }
  ],
  "校门2": [
    { name: "1-1", value: 98 },
    { name: "1-2", value: 105 },
    { name: "1-3", value: 92 },
    { name: "1-4", value: 112 },
    { name: "1-5", value: 108 },
    { name: "1-6", value: 102 },
    { name: "1-7", value: 118 },
    { name: "1-8", value: 112 },
    { name: "1-9", value: 105 },
    { name: "1-10", value: 125 },
    { name: "1-11", value: 118 },
    { name: "1-12", value: 112 },
    { name: "1-13", value: 102 },
    { name: "1-14", value: 108 },
    { name: "1-15", value: 118 },
    { name: "1-16", value: 125 },
    { name: "1-17", value: 118 },
    { name: "1-18", value: 112 },
    { name: "1-19", value: 105 },
    { name: "1-20", value: 98 },
    { name: "1-21", value: 105 },
    { name: "1-22", value: 112 },
    { name: "1-23", value: 118 },
    { name: "1-24", value: 125 },
    { name: "1-25", value: 118 },
    { name: "1-26", value: 112 },
    { name: "1-27", value: 105 },
    { name: "1-28", value: 118 },
    { name: "1-29", value: 125 },
    { name: "1-30", value: 118 }
  ],
  "校门3": [
    { name: "1-1", value: 78 },
    { name: "1-2", value: 85 },
    { name: "1-3", value: 72 },
    { name: "1-4", value: 92 },
    { name: "1-5", value: 88 },
    { name: "1-6", value: 82 },
    { name: "1-7", value: 98 },
    { name: "1-8", value: 92 },
    { name: "1-9", value: 85 },
    { name: "1-10", value: 102 },
    { name: "1-11", value: 95 },
    { name: "1-12", value: 88 },
    { name: "1-13", value: 82 },
    { name: "1-14", value: 85 },
    { name: "1-15", value: 95 },
    { name: "1-16", value: 102 },
    { name: "1-17", value: 95 },
    { name: "1-18", value: 88 },
    { name: "1-19", value: 85 },
    { name: "1-20", value: 78 },
    { name: "1-21", value: 85 },
    { name: "1-22", value: 88 },
    { name: "1-23", value: 95 },
    { name: "1-24", value: 102 },
    { name: "1-25", value: 95 },
    { name: "1-26", value: 88 },
    { name: "1-27", value: 85 },
    { name: "1-28", value: 95 },
    { name: "1-29", value: 102 },
    { name: "1-30", value: 95 }
  ],
  "校门4": [
    { name: "1-1", value: 65 },
    { name: "1-2", value: 72 },
    { name: "1-3", value: 58 },
    { name: "1-4", value: 78 },
    { name: "1-5", value: 75 },
    { name: "1-6", value: 68 },
    { name: "1-7", value: 82 },
    { name: "1-8", value: 78 },
    { name: "1-9", value: 72 },
    { name: "1-10", value: 88 },
    { name: "1-11", value: 82 },
    { name: "1-12", value: 75 },
    { name: "1-13", value: 68 },
    { name: "1-14", value: 72 },
    { name: "1-15", value: 82 },
    { name: "1-16", value: 88 },
    { name: "1-17", value: 82 },
    { name: "1-18", value: 75 },
    { name: "1-19", value: 72 },
    { name: "1-20", value: 65 },
    { name: "1-21", value: 72 },
    { name: "1-22", value: 75 },
    { name: "1-23", value: 82 },
    { name: "1-24", value: 88 },
    { name: "1-25", value: 82 },
    { name: "1-26", value: 75 },
    { name: "1-27", value: 72 },
    { name: "1-28", value: 82 },
    { name: "1-29", value: 88 },
    { name: "1-30", value: 82 }
  ]
};

// 模拟数据：门岗平均进校人次
const mockGateAvgData: Record<string, number> = {
  "校门1": 142,
  "校门2": 112,
  "校门3": 88,
  "校门4": 75
};

// 进校次数
const { state, execute } = useAsyncState(async () => {
  if (!schoolDoorId.value) return [];
  // 获取门岗数据，默认为校门1
  return mockGate30DaysData[schoolDoorId.value] || mockGate30DaysData["校门1"];
}, [], { immediate: true, resetOnExecute: false });

const { state: avgState, execute: avgExecute } = useAsyncState(async () => {
  if (!schoolDoorId.value) return 0;
  // 获取门岗平均数据，默认为校门1
  return mockGateAvgData[schoolDoorId.value] || mockGateAvgData["校门1"];
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
