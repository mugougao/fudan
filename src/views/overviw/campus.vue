<script setup lang="ts">
import { usePanelData } from "@/composables/overviw/usePanelData.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute.ts";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import CulturalAttractions from "@/views/campusStyle/CulturalAttractions/index.vue";
import HuangBuilding from "@/views/campusStyle/HuangBuilding/index.vue";
import CampusAssets from "./components/CampusAssets/index.vue";
import CampusGatepost from "./components/CampusGatepost/index.vue";
import CampusIntr from "./components/CampusIntr/index.vue";
import CampusRoamingRoutes from "./components/CampusRoamingRoutes/index.vue";

import EnergyConsumptionStatistics from "./components/EnergyConsumptionStatistics/index.vue";

const { campusId } = useWatchCampusIdPushRoute({
  overviewRouteName: "overviw.index",
  campusRouteName: "overviw.campus",
});

const [poiState,,restPoiState] = useState({ id: "", images: [] as string[], description: "" });
function onPoiClick({ id, images, description }: { id: string;images: string[];description: string }) {
  poiState.value = { id, images, description };
}

const { guardPost, assets, energy } = usePanelData();
</script>

<template>
  <UiViewPanel :show-return="!!poiState.id" @custom-return="() => restPoiState()">
    <template #left>
      <UiBoxPanel title="校区总览" class="row-span-24" content-class-name="grid grid-rows-24 px-3 children:overflow-hidden">
        <CampusIntr :class="campusId === CampusId.HanDan ? 'row-span-21' : 'row-span-24'" />
        <CampusRoamingRoutes
          v-if="campusId === CampusId.HanDan"
          class="row-span-3"
          @poi-selected="onPoiClick"
          @poi-unselected="() => restPoiState()" />
      </UiBoxPanel>
    </template>
    <template #right>
      <TransitionFadeInRight mode="out-in">
        <UiBoxPanel
          v-if="!poiState.id"
          title="今日校园" class="row-span-24" content-class-name="grid grid-rows-24 px-3 children:overflow-hidden">
          <CampusGatepost class="row-span-10" :count="guardPost.count" :traffic="guardPost.traffic" />
          <CampusAssets class="row-span-4" :data="assets" />
          <EnergyConsumptionStatistics class="row-span-9" :water="energy.water" :electricity="energy.electricity" />
        </UiBoxPanel>
        <div v-if="poiState.id" :key="poiState.id" class="grid grid-rows-24 gap-[15px] !row-span-full">
          <!--   校园文化宣传   -->
          <HuangBuilding :img="poiState.images" />
          <!--   校园文化景点   -->
          <CulturalAttractions :introduce="poiState.description" />
        </div>
      </TransitionFadeInRight>
    </template>
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
