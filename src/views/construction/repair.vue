<script setup lang="ts">
import { usePanelData } from "@/composables/construction/usePanelData.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";
import RepairDailyCount from "@/views/construction/components/RepairDailyCount/index.vue";
import RepairBarChart from "./components/RepairBarChart/index.vue";
import RepairOverview from "./components/RepairOverview/index.vue";
import RepairPieChart from "./components/RepairPieChart/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "construction.repair",
  campusRouteName: "construction.repairCampus",
});

const campusStore = useCampusStore();

wdpMap.onCreated(async () => {
  campusStore.setActiveCampusId(CampusId.Overview);
});

const { repairCount, repairingCount, campusRepairCount, statusCount } = usePanelData();
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title-path="construction.repair.campusOverview" class="row-span-4">
        <RepairOverview :data="[repairCount, repairingCount]" />
      </UiBoxPanel>
      <UiBoxPanel title-path="construction.repair.dailyRepair" class="row-span-19" content-class-name="grid grid-rows-12 grid-cols-1">
        <RepairDailyCount class="row-span-2" :data="[repairCount, repairingCount]" />
        <RepairBarChart class="row-span-4" :data="campusRepairCount" />
        <RepairPieChart class="row-span-6" :data="statusCount" />
      </UiBoxPanel>
    </template>

    <template #right>
      <UiBoxPanel title-path="construction.repair.scaleRepair" class="row-span-18" content-class-name="grid grid-rows-24 grid-cols-1">
        <RepairDailyCount class="row-span-3" :data="[repairCount, repairingCount]" />
        <RepairBarChart class="row-span-9" :data="campusRepairCount" />
        <RepairPieChart class="row-span-12" :data="statusCount" />
      </UiBoxPanel>
    </template>
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
