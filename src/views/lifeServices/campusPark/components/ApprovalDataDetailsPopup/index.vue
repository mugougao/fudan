<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import dayjs from "dayjs";
import { merge } from "lodash";
import { getApprovalDetailCheckIn, getApprovalDetailPersonnelList, getApprovalDetailStatistics } from "@/api/lifeServices";
import BuildCount from "./components/BuildCount/index.vue";
import MarkersCounts from "./components/MarkersCounts/index.vue";
import SearchForm from "./components/SearchForm/index.vue";

defineOptions({ name: "ApprovalDataDetailsPopup", inheritAttrs: false });

const visible = defineModel<boolean>("visible", { default: false });

// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

const oldSubmitParams = shallowRef<{ startTime: string; endTime: string; buildId: string }>({ startTime: "", endTime: "", buildId: "" });
const personnelSituationType = ref("退宿");
const personnelSituationTabs = [
  { label: "退宿", value: "退宿" },
  { label: "入住", value: "入住" },
  { label: "调宿", value: "调宿" },
];

const { state, execute } = useAsyncState(
  async (params: { startTime: string; endTime: string; buildId?: string }) => {
    const { startTime, endTime, buildId } = params;
    const [
      [, statistics],
      [, buildData],
    ] = await Promise.all([
      to(getApprovalDetailStatistics(dormitoryAreaId.value, startTime, endTime, buildId)),
      to(getApprovalDetailPersonnelList(dormitoryAreaId.value, buildId)),
    ]);
    return {
      statistics: {
        dropOut: statistics?.resultData?.tszs ?? 0,
        occupancy: statistics?.resultData?.rzzs ?? 0,
        accommodation: statistics?.resultData?.tiaosuzs ?? 0,
      },
      buildList: buildData?.resultData || [],
    };
  },
  {
    statistics: { dropOut: 0, occupancy: 0, accommodation: 0 },
    buildList: [],
  },
  { immediate: false, resetOnExecute: false },
);

const { state: checkInRate, execute: getCheckInRate } = useAsyncState(async (params: { startTime: string; endTime: string; buildId?: string }) => {
  const { startTime, endTime, buildId } = params;
  const [err, res] = await to(getApprovalDetailCheckIn(dormitoryAreaId.value, startTime, endTime, personnelSituationType.value, buildId));
  if (err) return [];
  return res?.resultData || [];
}, [], { immediate: false, resetOnExecute: false });

function handlerSubmit(params: { startTime: string; endTime: string; buildId?: string }) {
  oldSubmitParams.value = params as any;
  execute(0, params);
  getCheckInRate(0, params);
}

watch(
  () => personnelSituationType.value,
  () => getCheckInRate(0, oldSubmitParams.value),
);

watch(
  () => dormitoryAreaId.value,
  () => {
    // execute(0, oldSubmitParams.value);
    getCheckInRate(0, oldSubmitParams.value);
  },
);

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      xAxis: {
        type: "category",
        boundaryGap: true,
        axisLabel: {
          interval: 0,
          formatter: value => dayjs(value).format("YYYY/MM/DD"),
          fontSize: 12,
          rotate: 20,
        },
      },
    },
  );
}
</script>

<template>
  <DragPopup v-model:visible="visible" title="审批详情" :width="870" :top="100" left="auto">
    <SearchForm @submit="handlerSubmit" />

    <div class="mt-2 space-y-5">
      <UiThirdTitle title="信息详情" />
      <MarkersCounts :data="state.statistics" />
      <BuildCount :data="state.buildList" />
      <div class="relative">
        <UiThirdTitle title="人员流动统计" />
        <div class="absolute right-0 top-0">
          <SegmentedRadioGroup v-model="personnelSituationType" :options="personnelSituationTabs" />
        </div>
      </div>
      <div v-if="visible" class="h-[200px]">
        <UiChartLine :data="checkInRate" unit="人" :merge-option="mergeOption" />
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
