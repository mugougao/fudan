<script setup lang="ts">
import type { EChartsOption } from "echarts";
import to from "await-to-js";
import { merge } from "lodash";
import {
  fetchSwimmingPoolOverview,
  type IFetchSwimmingPoolOverviewResult,
} from "@/api/campusAccess/stadium";
import GradientText from "@/components/GradientText";
import { useDataSlice, useEChartRender } from "@/hooks";
import GymnasiumSplitBuild from "@/utils/WdpMap/campusAccess/stadium/GymnasiumSplitBuild.ts";
import StadiumDataOverviewPersonnelDistribution from "@/views/campusAccess/stadium/components/StadiumDataOverviewPersonnelDistribution/index.vue";
import StadiumDataOverviewStadium from "@/views/campusAccess/stadium/components/StadiumDataOverviewStadium/index.vue";

const { state } = useAsyncState<IFetchSwimmingPoolOverviewResult>(async () => {
  const [err, res] = await to(fetchSwimmingPoolOverview());
  if (err) return {} as IFetchSwimmingPoolOverviewResult;
  return res?.resultData || {} as IFetchSwimmingPoolOverviewResult;
}, {} as IFetchSwimmingPoolOverviewResult, { immediate: true, resetOnExecute: false });

// 游泳馆位置 checked
const natatoriumLocationChecked = ref(false);
watch(
  natatoriumLocationChecked,
  (val) => {
    val
      ? GymnasiumSplitBuild.splitRoom("江湾体育馆游泳馆")
      : GymnasiumSplitBuild.close();
  },
);
</script>

<template>
  <UiBoxPanel class="row-span-24" title-path="venueFacilities.natatoriumOverview" content-class-name="grid grid-cols-1 grid-rows-24">
    <template #titleSuffix>
      <UiSelectBtn v-model="natatoriumLocationChecked">
        {{ $t('venueFacilities.natatoriumLocation') }}
      </UiSelectBtn>
    </template>

    <div class="relative row-span-8 flex flex-col">
      <UiSubTitle title-path="venueFacilities.monthlyAttendance" class="shrink-0" />
      <UiCountItemStrip icon="i-svg-icon-users2" :name="$t('venueFacilities.monthTotal')" :value="state?.ryzs" unit="人" class="shrink-0" />
      <div class="flex-auto overflow-hidden">
        <UiChartLine :data="state?.xsyl || []" unit="人" :merge-option="(option:EChartsOption) => merge(option, { series: [{ name: '当日游泳馆人次' }] })" />
      </div>
    </div>
    <div class="row-span-8 flex flex-col">
      <UiSubTitle title-path="venueFacilities.personnelDistribution" class="shrink-0" />
      <div class="flex-auto overflow-hidden">
        <StadiumDataOverviewPersonnelDistribution :data="state?.rylxfb || []" />
      </div>
    </div>
    <div class="row-span-8 flex flex-col">
      <UiSubTitle title-path="venueFacilities.nearlySevenDaysToll" class="shrink-0" />
      <div class="flex-auto overflow-hidden">
        <StadiumDataOverviewStadium />
      </div>
    </div>
  </UiBoxPanel>
</template>

<style scoped>

</style>
