<script setup lang="ts">
import BuildDistribution, { type IProps as IBuildDistributionProps } from "../BuildDistribution/index.vue";
import TotalStatistics, { type IProps as ITotalStatisticsProps } from "../TotalStatistics/index.vue";
import UseDirections, { type IProps as IUseDirectionsProps } from "../UseDirections/index.vue";

defineOptions({ name: "RegionOverviewPanel" });

const {
  totalStatisticsData,
  useDirectionsData,
  buildDistributionData,
  // numberOfAnnualTargetsData,
} = defineProps<{
  totalStatisticsData: ITotalStatisticsProps["data"];
  useDirectionsData: IUseDirectionsProps["data"];
  buildDistributionData: IBuildDistributionProps["data"];
  // numberOfAnnualTargetsData: INumberOfAnnualTargetsProps ;
}>();
</script>

<template>
  <UiBoxPanel class="row-span-24" title="校区总览" content-class-name="grid grid-cols-1 grid-rows-24">
    <!--  总量统计  -->
    <TotalStatistics :data="totalStatisticsData" />
    <!--  使用方向  -->
    <UseDirections :data="useDirectionsData" />
    <!-- 楼宇分布 -->
    <BuildDistribution :data="buildDistributionData" />
    <!--  上一年度机时达标数  -->
    <!--    <NumberOfAnnualTargets
      :number-of-targets="numberOfAnnualTargetsData.numberOfTargets"
      :attainment-rate="numberOfAnnualTargetsData.attainmentRate" /> -->
  </UiBoxPanel>
</template>

<style scoped>

</style>
