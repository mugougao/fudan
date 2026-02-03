<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useInstrumentCampus, useInstrumentOverview } from "@/composables/assetManagement/instrument_etl.ts";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import { useCampusStore } from "@/stores/campus.ts";
import campusAssetsBuildPoiLayer from "@/utils/WdpMap/assetManagement/campusAssets/campusAssetsBuildPoiLayer.ts";
import campusWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/instrument/CampusWithCollegePoiLayer.ts";
import facultiesLargeInstrumentsPoiLayer from "@/utils/WdpMap/assetManagement/instrument/FacultiesLargeInstrumentsPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";
import BuildPopup from "./components/BuildPopup/index.vue";
import CampusInstrumentsListPanel from "./components/CampusInstrumentsListPanel/index.vue";
import CampusOverviewPanel from "./components/CampusOverviewPanel/index.vue";
import EquipmentBigScreen from "./components/EquipmentBigScreen/index.vue";
import InfoInquiryPanel from "./components/InfoInquiryPanel/index.vue";
import RegionOverviewPanel from "./components/RegionOverviewPanel/index.vue";

const campusStore = useCampusStore();
const { activeCampusId } = storeToRefs(campusStore);
const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
watch(activeCampusId, val => campusId.value = val);
const [buildPopupProps, setBuildPopupProps] = useState({ visible: false, buildId: "", buildName: "" });
// 楼栋POI点击事件
function handleBuildPoiClick({ id, name }: any) {
  setBuildPopupProps({ visible: true, buildId: id, buildName: name });
}
// 弹窗关闭回调
let buildPopupCloseCallback = () => {};
onMounted(() => {
  wdpMap.addLayer(campusWithCollegePoiLayer, campusAssetsBuildPoiLayer, facultiesLargeInstrumentsPoiLayer);
  wdpMap.onCreated(async () => {
    if (campusId.value && campusId.value !== CampusId.Overview) {
      campusRangeLayer.focusByCampusId(campusId.value);
    }
    else if (!campusId.value || campusId.value === CampusId.Overview) {
      campusStore.setActiveCampusId(CampusId.Overview);
      campusId.value = CampusId.Overview;
      campusRangeLayer.focusByCampusId(CampusId.Overview);
    }

    campusWithCollegePoiLayer.onClick(handleBuildPoiClick);
    campusAssetsBuildPoiLayer.onClick(handleBuildPoiClick);
    facultiesLargeInstrumentsPoiLayer.onClick(handleBuildPoiClick);

    // 点击点位分布poi聚焦
    campusWithCollegePoiLayer.onClick(({ id }) => {
      campusWithCollegePoiLayer.flyTo(id);
      campusWithCollegePoiLayer.hideOthers(id);
      buildPopupCloseCallback = () => {
        campusWithCollegePoiLayer.showAll();
        campusWithCollegePoiLayer.focusAll();
      };
    });
    // 点击楼宇点位分布poi聚焦
    campusAssetsBuildPoiLayer.onClick(({ id }) => {
      campusAssetsBuildPoiLayer.flyTo(id);
      campusAssetsBuildPoiLayer.hideOthers(id);
      buildPopupCloseCallback = () => {
        campusAssetsBuildPoiLayer.showAll();
        campusAssetsBuildPoiLayer.focusAll();
      };
    });
    // 点击院系大型仪器poi聚焦
    facultiesLargeInstrumentsPoiLayer.onClick(({ id }) => {
      facultiesLargeInstrumentsPoiLayer.flyTo(id);
      facultiesLargeInstrumentsPoiLayer.hideOthers(id);
      buildPopupCloseCallback = () => {
        facultiesLargeInstrumentsPoiLayer.showAll();
        facultiesLargeInstrumentsPoiLayer.focusAll();
      };
    });
  });
});
onBeforeUnmount(() => {
  wdpMap.removeLayer(campusWithCollegePoiLayer, campusAssetsBuildPoiLayer, facultiesLargeInstrumentsPoiLayer);
});

const { state: stateOverview, facultiesQueryStats, executeFacultiesStats } = useInstrumentOverview();

const { state: stateCampus } = useInstrumentCampus();
</script>

<template>
  <UiViewPanel
    :show-return="campusId !== CampusId.Overview"
    @custom-return="() => {
      activeCampusId = CampusId.Overview
    }">
    <template #left>
      <!-- 校区总览 -->
      <CampusOverviewPanel
        v-if="campusId === CampusId.Overview"
        :total-statistics-data="stateOverview.totalStatisticsData"
        :use-directions-data="stateOverview.useDirectionsData"
        :instrument-distribution-data="stateOverview.instrumentDistributionData"
        :installed-terminal="stateOverview.installedTerminal" />
      <!-- 区域总览面板 -->
      <RegionOverviewPanel
        v-else
        :total-statistics-data="stateCampus.totalStatisticsData"
        :use-directions-data="stateCampus.useDirectionsData"
        :build-distribution-data="stateCampus.buildDistributionData" />
    </template>

    <template #right>
      <template v-if="campusId === CampusId.Overview">
        <EquipmentBigScreen />
        <!-- 院系大型仪器列表  -->
        <CampusInstrumentsListPanel
          :instruments-list-data="stateOverview.instrumentListData"
          :faculties-query-data="facultiesQueryStats"
          @faculties-query-search="(text) => executeFacultiesStats(text)" />
      </template>
      <!-- 信息查询 -->
      <InfoInquiryPanel v-else />
    </template>
  </UiViewPanel>

  <BuildPopup v-model:visible="buildPopupProps.visible" :title="buildPopupProps.buildName" :build-id="buildPopupProps.buildId" @close="buildPopupCloseCallback" />
</template>

<style scoped>

</style>
