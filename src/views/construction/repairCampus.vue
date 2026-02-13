<script setup lang="ts">
import { usePanelCampusData } from "@/composables/construction/usePanelData.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute";
import buildingPoiLayer from "@/utils/WdpMap/construction/BuildingPoiLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";
import RepairCampusList from "@/views/construction/components/RepairCampusList/index.vue";
import RepairDailyCount from "@/views/construction/components/RepairDailyCount/index.vue";
import RepairBuildPopup from "./components/RepairBuildPopup/index.vue";
import RepairCampusListVariant from "./components/RepairCampusListVariant/index.vue";
import RepairCampusWarningInfo from "./components/RepairCampusWarningInfo/index.vue";
import RepairOverview from "./components/RepairOverview/index.vue";
import RepairPieChartVariant from "./components/RepairPieChartVariant/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "construction.repair",
  campusRouteName: "construction.repairCampus",
});

const { repairCount, repairingCount, statusCount, repairList, scaleRepairList } = usePanelCampusData();

const showBuildPopup = ref(false);
const buildPopupid = ref<string>("");
const buildPopupTitle = ref("");
const buildPopupDefaultType = ref<"1" | "2">("1"); // 1: 日常修缮, 2: 规模修缮

onMounted(() => {
  wdpMap.addLayer(buildingPoiLayer);
  wdpMap.onCreated(() => {
    buildingPoiLayer.onClick(({ id, name }) => {
      buildPopupTitle.value = name;
      buildPopupid.value = id;
      showBuildPopup.value = true;
    });
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(buildingPoiLayer);
});

function handleRowClick(id: string, source: "daily" | "scale" = "daily") {
  buildingPoiLayer.render(id);
  // 根据来源设置默认面板类型
  buildPopupDefaultType.value = source === "scale" ? "2" : "1";
}
</script>

<template>
  <UiViewPanel show-return>
    <template #left>
      <UiBoxPanel title-path="construction.repair.campusOverview" class="row-span-5">
        <RepairOverview :data="[repairCount, repairingCount]" />
      </UiBoxPanel>
      <UiBoxPanel title-path="construction.repair.dailyRepair" class="row-span-19" content-class-name="grid grid-rows-24 grid-cols-1">
        <RepairDailyCount class="row-span-3" :data="[repairCount, repairingCount]" />
        <RepairPieChartVariant class="row-span-7" :data="statusCount" />
        <RepairCampusList class="row-span-11" :data="repairList" @row-click="(id) => handleRowClick(id, 'daily')" />
        <RepairCampusWarningInfo class="row-span-3" />
      </UiBoxPanel>
    </template>

    <template #right>
      <UiBoxPanel title-path="construction.repair.scaleRepair" class="row-span-18" content-class-name="grid grid-rows-24 grid-cols-1">
        <RepairDailyCount class="row-span-3" :data="[repairCount, repairingCount]" />
        <RepairPieChartVariant class="row-span-8" :data="statusCount" />
        <RepairCampusListVariant class="row-span-10" :data="scaleRepairList" @row-click="(id) => handleRowClick(id, 'scale')" />
        <RepairCampusWarningInfo class="row-span-3" />
      </UiBoxPanel>
    </template>
  </UiViewPanel>

  <RepairBuildPopup :id="buildPopupid" v-model:visible="showBuildPopup" :title="buildPopupTitle" :default-type="buildPopupDefaultType" />
</template>

<style scoped lang="scss">

</style>
