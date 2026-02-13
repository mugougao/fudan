<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type {
  // fetchSwimmingPoolOverview,
  IFetchSwimmingPoolOverviewResult,
} from "@/api/campusAccess/stadium";
// import to from "await-to-js";
import { merge } from "lodash";
import GymnasiumSplitBuild from "@/utils/WdpMap/campusAccess/stadium/GymnasiumSplitBuild.ts";
import StadiumDataOverviewPersonnelDistribution from "@/views/campusAccess/stadium/components/StadiumDataOverviewPersonnelDistribution/index.vue";
import StadiumDataOverviewStadium from "@/views/campusAccess/stadium/components/StadiumDataOverviewStadium/index.vue";

// 硬编码游泳馆概览数据
const state = ref<IFetchSwimmingPoolOverviewResult>({
  ryzs: 1560, // 月总人数
  xsyl: [
    { name: "周一", value: 210 },
    { name: "周二", value: 185 },
    { name: "周三", value: 256 },
    { name: "周四", value: 198 },
    { name: "周五", value: 312 },
    { name: "周六", value: 289 },
    { name: "周日", value: 265 },
  ], // 月使用率
  rylxfb: [
    { name: "学生", value: 45 },
    { name: "教职工", value: 28 },
    { name: "访客", value: 17 },
    { name: "其他", value: 10 },
  ], // 人员类型分布
});

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
