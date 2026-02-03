<script setup lang="ts">
import useEnergyCampus from "@/composables/financial/useEnergyCampus.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute.ts";
import { CampusId } from "@/enums";
import { createLoading } from "@/utils/createLoading";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import buildingEnergyPoiLayer from "@/utils/WdpMap/financial/BuildingEnergyPoiLayer.ts";
import chargingPilesPoiLayer from "@/utils/WdpMap/financial/ChargingPilesPoiLayer.ts";
import waterElectricityHeatMap from "@/utils/WdpMap/financial/WaterElectricityHeatMap";
import wdpMap from "@/utils/WdpMap/wdpMap";
import EnergyToolbar from "@/views/financial/components/EnergyToolbar/index.vue";
import EnergyCampusBuildingPopup from "./components/EnergyCampusBuildingPopup/index.vue";
import EnergyCampusChargingPiles from "./components/EnergyCampusChargingPiles/index.vue";
import EnergyCampusChargingPilesLegend from "./components/EnergyCampusChargingPilesLegend/index.vue";
import EnergyCampusChargingPilesPopup from "./components/EnergyCampusChargingPilesPopup/index.vue";
import EnergyCampusMonitor from "./components/EnergyCampusMonitor/index.vue";
import EnergyCampusMonthDetails from "./components/EnergyCampusMonthDetails/index.vue";
import EnergyDataOverview from "./components/EnergyDataOverview/index.vue";

const { campusId } = useWatchCampusIdPushRoute({
  overviewRouteName: "financial.energy",
  campusRouteName: "financial.energyCampus",
});

const { energyConsumptionState, chargingPileState, energyMonitorState, energyMonitorTiemType } = useEnergyCampus();

// 充电桩点位 显示
const showChargingPilesPoi = ref(false);
const chargingPilesPoiCarType = ref<"electricBicycle" | "newEnergyVehicles">("electricBicycle");
// 充电桩 弹窗
const showEnergyCampusChargingPilesPopup = ref(false);
// 充电桩 弹窗 id
const energyCampusChargingPilesPopupId = ref<string | undefined>(undefined);
const energyCampusChargingPilesPopupTitle = ref<string>("");

// 楼栋用水用电弹窗
const showBuildingPopup = ref(false);
const buildingPopupTitle = ref<string>("");
const buildingPopupId = ref<string | undefined>(undefined);

watch(
  () => [showChargingPilesPoi.value, chargingPilesPoiCarType.value],
  async ([show, type]) => {
    chargingPilesPoiLayer.removeAll();
    campusPoiLayer.showAll();
    if (show) {
      const loading = createLoading({ tip: "点位加载中..." });
      try {
        campusPoiLayer.hideAll();
        await chargingPilesPoiLayer.render(campusId.value, type as "electricBicycle" | "newEnergyVehicles");
      }
      finally {
        loading?.close();
      }
    }
  },
);
watch(
  () => campusId.value,
  (val) => {
    if (val !== CampusId.Overview) {
      showChargingPilesPoi.value = false;
      showEnergyCampusChargingPilesPopup.value = false;
      showBuildingPopup.value = false;
      campusPoiLayer.showAll();
    }
  },
);

const { x, y } = useMouse();

function handleRowClick(id: string) {
  buildingEnergyPoiLayer.removeAll();
  buildingEnergyPoiLayer.render(id);
  campusPoiLayer.hideAll();
}

wdpMap.addLayer(chargingPilesPoiLayer, buildingEnergyPoiLayer, waterElectricityHeatMap);
wdpMap.onCreated(() => {
  chargingPilesPoiLayer.onClick(({ id, name }) => {
    chargingPilesPoiLayer.flyTo(id);
    chargingPilesPoiLayer.hideOthers(id);
    showEnergyCampusChargingPilesPopup.value = true;
    energyCampusChargingPilesPopupId.value = id;
    energyCampusChargingPilesPopupTitle.value = name;
    campusPoiLayer.hideAll();
  });

  chargingPilesPoiLayer.onHover(
    ({ name }) => {
      const tip = document.getElementById("chargingPilesPoiLayerTooltip");
      tip && tip.remove();
      const span = document.createElement("span");
      span.className = "absolute text-white bg-black rounded-lg px-2 py-1";
      span.style.cssText += `z-index: 9999;left:${x.value}px;top:${y.value}px;transform: translate(-50%, 100%);`;
      span.innerHTML = name;
      span.setAttribute("id", "chargingPilesPoiLayerTooltip");
      document.body.appendChild(span);
    },
    () => {
      document.getElementById("chargingPilesPoiLayerTooltip")?.remove();
    },
  );

  buildingEnergyPoiLayer.onClick(({ id, name }) => {
    buildingPopupId.value = id;
    buildingPopupTitle.value = name;
    showBuildingPopup.value = true;
  });
});

// 充电桩 弹窗 关闭
function onCloseEnergyCampusChargingPilesPopup() {
  chargingPilesPoiLayer.showAll();
  chargingPilesPoiLayer.focusAll();
  energyCampusChargingPilesPopupId.value = undefined;
  energyCampusChargingPilesPopupTitle.value = "";
  campusPoiLayer.showAll();
}

onBeforeUnmount(() => {
  document.getElementById("chargingPilesPoiLayerTooltip")?.remove();
  wdpMap.removeLayer(chargingPilesPoiLayer, buildingEnergyPoiLayer, waterElectricityHeatMap);
});
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title-path="financial.energy.campusTotal" class="row-span-24" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
        <!-- 能耗数据概览 -->
        <EnergyDataOverview class="row-span-12" :data="energyConsumptionState" />
        <!-- 充电桩 -->
        <EnergyCampusChargingPiles
          v-model:show-poi="showChargingPilesPoi"
          v-model:car-type="chargingPilesPoiCarType"
          class="row-span-12" :data="chargingPileState" />
      </UiBoxPanel>
    </template>
    <template #right>
      <!-- 能源监控 -->
      <EnergyCampusMonitor v-model:time-type="energyMonitorTiemType" :data="energyMonitorState" />
      <!-- 本月楼宇能耗明细 -->
      <EnergyCampusMonthDetails @row-click="handleRowClick" />
    </template>
    <EnergyToolbar is-campus />
    <!--  图例  -->
    <EnergyCampusChargingPilesLegend v-show="showChargingPilesPoi" :car-type="chargingPilesPoiCarType" />
    <!--  充电桩 弹窗  -->
    <EnergyCampusChargingPilesPopup
      :id="energyCampusChargingPilesPopupId" v-model:visible="showEnergyCampusChargingPilesPopup"
      :title="energyCampusChargingPilesPopupTitle" @close="onCloseEnergyCampusChargingPilesPopup" />
    <!--  楼栋用水用电弹窗  -->
    <EnergyCampusBuildingPopup
      :id="buildingPopupId" v-model:visible="showBuildingPopup" :title="buildingPopupTitle"
      @close="campusPoiLayer.showAll()" />
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
