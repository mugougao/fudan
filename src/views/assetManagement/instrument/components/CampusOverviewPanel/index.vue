<script setup lang="ts">
import campusWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/instrument/CampusWithCollegePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import EquipmentTerminalStatistics, { type IProps as IEquipmentTerminalStatisticsProps } from "../EquipmentTerminalStatistics/index.vue";
import InstrumentDistribution, { type IProps as IInstrumentDistributionProps } from "../InstrumentDistribution/index.vue";
import TotalStatistics, { type IProps as ITotalStatisticsProps } from "../TotalStatistics/index.vue";
import UseDirections, { type IProps as IUseDirectionsProps } from "../UseDirections/index.vue";

defineOptions({ name: "CampusOverviewPanel" });

const {
  totalStatisticsData,
  useDirectionsData,
  instrumentDistributionData,
  installedTerminal,
} = defineProps<{
  totalStatisticsData: ITotalStatisticsProps["data"];
  useDirectionsData: IUseDirectionsProps["data"];
  instrumentDistributionData: IInstrumentDistributionProps;
  installedTerminal: IEquipmentTerminalStatisticsProps["installedTerminal"];
}>();

// 上一年度机时达标数 撒点
async function handlePrevYearChange(params: { checked: boolean; campus: string }) {
  const { checked, campus } = params;
  await campusWithCollegePoiLayer.removeAll();
  if (!checked) {
    campusPoiLayer.showAll();
    return;
  }
  await campusPoiLayer.hideAll();
  await campusWithCollegePoiLayer.renderCampus(campus);
}
</script>

<template>
  <UiBoxPanel class="row-span-24" title-path="largeInstruments.campusOverview" content-class-name="grid grid-cols-1 grid-rows-24">
    <!--  总量统计  -->
    <TotalStatistics :data="totalStatisticsData" />
    <!--  使用方向  -->
    <UseDirections :data="useDirectionsData" />
    <!--  仪器分布   -->
    <InstrumentDistribution
      :devices-number="instrumentDistributionData.devicesNumber"
      :amount="instrumentDistributionData.amount" />
    <!--  设别终端统计  -->
    <EquipmentTerminalStatistics
      :installed-terminal="installedTerminal" />
  </UiBoxPanel>
</template>

<style scoped>

</style>
