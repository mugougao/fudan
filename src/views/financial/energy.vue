<script setup lang="ts">
import { useI18n } from "vue-i18n";
import biImg from "@/assets/images/financial/energy-bi.jpg";
import useEnergyOverview from "@/composables/financial/useEnergyOverview.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute.ts";
import EnergyBuildingTop5 from "./components/EnergyBuildingTop5/index.vue";
import EnergyChargingPiles from "./components/EnergyChargingPiles/index.vue";
import EnergyDataOverview from "./components/EnergyDataOverview/index.vue";
import EnergyToolbar from "./components/EnergyToolbar/index.vue";
import EnergyYearUseCount from "./components/EnergyYearUseCount/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "financial.energy",
  campusRouteName: "financial.energyCampus",
});
const { t } = useI18n();

const energyTypeOptions = computed(() => {
  return [
    { label: t("financial.energy.energy"), value: "electricity" },
    { label: t("financial.energy.water"), value: "water" },
  ];
});

const { energyConsumptionState, chargingPileState, waterElectricityStateType, waterElectricityState } = useEnergyOverview();
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title-path="financial.energy.campusTotal" class="row-span-22" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
        <EnergyDataOverview class="row-span-13" :data="energyConsumptionState" />
        <EnergyChargingPiles class="row-span-11" :data="chargingPileState" />
      </UiBoxPanel>
    </template>
    <template #right>
      <UiBoxPanel title-path="financial.energy.campusOverview" class="row-span-17" content-class-name="flex flex-col px-3">
        <div class="mb-2 shrink-0 text-center">
          <UiSkewSegmented v-model="waterElectricityStateType" :options="energyTypeOptions" />
        </div>
        <div class="grid grid-cols-1 grid-rows-12 flex-auto gap-2">
          <EnergyYearUseCount class="row-span-5" :type="waterElectricityStateType" :data="waterElectricityState.year" />
          <EnergyBuildingTop5 class="row-span-7" :type="waterElectricityStateType" :data="waterElectricityState.top5" />
        </div>
      </UiBoxPanel>

      <UiBoxPanel title-path="financial.energy.campusChargingQueryMap" class="row-span-7">
        <div class="-mt-0.5">
          <LargeScreenPreview
            :preview-image-src="biImg"
            screen-url="https://workspace.easyv.cloud/shareScreen/eyJzY3JlZW5JZCI6Mjk1ODU5MX0=" screen-title="校园充电查询地图" />
        </div>
      </UiBoxPanel>
    </template>

    <EnergyToolbar />
  </UiViewPanel>
</template>

<style scoped lang="scss">
  .chart-box {
  background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat center / 1px calc(100% - 40px);
}
</style>
