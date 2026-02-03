<script setup lang="ts">
import { usePanelData } from "@/composables/overviw/usePanelData.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute.ts";
import BaseInfo from "./components/BaseInfo/index.vue";
import BigScreenConnection from "./components/BigScreenConnection/index.vue";
import CampusAssets from "./components/CampusAssets/index.vue";
import CampusGatepost from "./components/CampusGatepost/index.vue";
import EnergyConsumptionStatistics from "./components/EnergyConsumptionStatistics/index.vue";
import PersonnelDistribution from "./components/PersonnelDistribution/index.vue";
import ProfessionalDistributive from "./components/ProfessionalDistributive/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "overviw.index",
  campusRouteName: "overviw.campus",
});

const { guardPost, assets, energy } = usePanelData();
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title-path="overviw.campusOverview" class="row-span-24" content-class-name="grid grid-rows-24 children:overflow-hidden">
        <BaseInfo class="row-span-8" />
        <PersonnelDistribution class="row-span-9" />
        <ProfessionalDistributive class="row-span-7" />
      </UiBoxPanel>
    </template>
    <template #right>
      <UiBoxPanel title-path="overviw.todayCampus" class="row-span-24" content-class-name="grid grid-cols-1 grid-rows-24 overflow-hidden children:overflow-hidden">
        <CampusGatepost class="row-span-9" :count="guardPost.count" :traffic="guardPost.traffic" />
        <CampusAssets class="row-span-4" :data="assets" />
        <EnergyConsumptionStatistics class="row-span-9" :water="energy.water" :electricity="energy.electricity" />
        <BigScreenConnection class="row-span-2" />
      </UiBoxPanel>
    </template>
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
