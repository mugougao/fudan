<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import useCampusPanelCountData from "@/composables/network/useCampusPanelCountData.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute";
import { sleep } from "@/utils";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer";
import equipmentBuildingPoiLayer from "@/utils/WdpMap/network/EquipmentBuildingPoiLayer.ts";
import equipmentPersonnelHeatMapLayer from "@/utils/WdpMap/network/EquipmentPersonnelHeatMapLayer.ts";
import networkDevicePoiLayer from "@/utils/WdpMap/network/NetworkDevicePoiLayer.ts";
import PersonnelBuildLayer from "@/utils/WdpMap/network/PersonnelBuildLayer.ts";
import floorExtractionCustomLayer from "@/utils/WdpMap/smartTeaching/FloorExtractionCustomLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import UserTerminalTrends from "@/views/network/components/UserTerminalTrends/index.vue";
import BuildingNetworkStatistics from "./components/BuildingNetworkStatistics/index.vue";
import DeviceNumberStats from "./components/DeviceNumberStats/index.vue";
import FloorSelect from "./components/FloorSelect/index.vue";
import HealthDistribution from "./components/HealthDistribution/index.vue";
import NetworkDevicePopup from "./components/NetworkDevicePopup/index.vue";
import PersonDistributedBuilding from "./components/PersonDistributedBuilding/index.vue";
import SideToolBar from "./components/SideToolBar/index.vue";
import SSIDDistribution from "./components/SSIDDistribution/index.vue";
import TopCountBar from "./components/TopCountBar/index.vue";
import WiApCount from "./components/WiApCount/index.vue";

const unScale = inject("unScale", 1);
const buildId = useRouteQuery("buildId") as unknown as Ref<string | undefined>;
const floorId = useRouteQuery("floorId") as unknown as Ref<string | undefined>;
const deviceId = ref("");
const showDevicePopup = ref(false);
const networkDevicePopupRef = useTemplateRef<InstanceType<typeof NetworkDevicePopup>>("networkDevicePopup");

const { campusId } = useWatchCampusIdPushRoute({
  overviewRouteName: "network.index",
  campusRouteName: "network.campus",
});

// FloorExtraction
const { x, y } = useMouse();
wdpMap.addLayer(floorExtractionCustomLayer, equipmentBuildingPoiLayer, networkDevicePoiLayer, equipmentPersonnelHeatMapLayer, PersonnelBuildLayer);
wdpMap.onCreated(async () => {
  setTimeout(async () => {
    campusPoiLayer.hideAll();
    await equipmentBuildingPoiLayer.render(campusId.value);
    // equipmentBuildingPoiLayer.focusAll();
    if (buildId.value) {
      await equipmentBuildingPoiLayer.flyTo(buildId.value);
      await equipmentBuildingPoiLayer.hideAll();
      // 炸开 楼栋
      await floorExtractionCustomLayer.disperse(buildId.value);
      if (floorId.value) {
        sleep(3000).then(() => {
          floorExtractionCustomLayer.extract(floorId.value!);
        });
        floorExtractionCustomLayer.focusFloor(buildId.value, Number(floorId.value));
        networkDevicePoiLayer.render(buildId.value!, floorId.value);
      }
    }
  }, 2000);

  equipmentBuildingPoiLayer.onClick(({ id }) => {
    // console.log("🚀 ~ sourceId:", sourceId);
    buildId.value = id;
    floorId.value = undefined;
    equipmentBuildingPoiLayer.flyTo(id, { distanceFactor: 300, rotation: { pitch: -30 } });
    equipmentBuildingPoiLayer.hideAll();
    // 炸开 楼栋
    floorExtractionCustomLayer.disperse(id);
  });

  networkDevicePoiLayer.onHover(
    ({ name }) => {
      const tip = document.getElementById("networkDevicePoiLayerTooltip");
      tip && tip?.remove?.();
      const span = document.createElement("span");
      span.className = "absolute text-white bg-black rounded-lg px-2 py-1";
      span.style.cssText += `z-index: 9999;left:${x.value}px;top:${y.value}px;transform: translate(-50%, 100%);`;
      span.innerHTML = name;
      span.setAttribute("id", "networkDevicePoiLayerTooltip");
      document.body.appendChild(span);
    },
    () => {
      document.getElementById("networkDevicePoiLayerTooltip")?.remove();
    },
  );

  networkDevicePoiLayer.onClick(({ id }) => {
    deviceId.value = id;
    showDevicePopup.value = true;
    networkDevicePopupRef.value?.setPosition(y.value * toValue(unScale) - 50, x.value * toValue(unScale) + 20);
  });
});

onBeforeUnmount(() => {
  document.getElementById("networkDevicePoiLayerTooltip")?.remove();
  wdpMap.removeLayer(equipmentBuildingPoiLayer, floorExtractionCustomLayer, networkDevicePoiLayer, equipmentPersonnelHeatMapLayer, PersonnelBuildLayer);
  campusPoiLayer.showAll();
});

async function handleFloorClick(floorId: string) {
  floorExtractionCustomLayer.extract(floorId);
  floorExtractionCustomLayer.focusFloor(buildId.value!, Number(floorId));
  networkDevicePoiLayer.render(buildId.value!, floorId);
}
// 人员楼宇ID
const personnelBuildId = ref("");
const personnelBuildCount = ref<number[]>([]);
function handleBuildClick({ id, x, y, name, value = [] }: { id: string; x: string; y: string; name: string;value: number[] }) {
  personnelBuildId.value = id;
  personnelBuildCount.value = value;
  equipmentBuildingPoiLayer.hideAll();
  PersonnelBuildLayer.render(id, name, x, y);
}

const {
  topCountState,
  deviceCountState,
  healthCountState,
  ssidCountState,

  userOrTerminalStateType,
  userOrTerminalState,
  userDistributionTop5State,
} = useCampusPanelCountData();

function handleReturn() {
  if (personnelBuildId.value) {
    personnelBuildId.value = "";
    equipmentBuildingPoiLayer.showAll();
    campusRangeLayer.focusByCampusId(campusId.value);
    PersonnelBuildLayer.removeAll();
    return;
  }
  buildId.value = undefined;
  floorId.value = undefined;
  deviceId.value = "";
  // campusRangeLayer.focus(campusId.value);
  equipmentBuildingPoiLayer.showAll();
  equipmentBuildingPoiLayer.focusAll();
  floorExtractionCustomLayer.restore();
  networkDevicePoiLayer.removeAll();
}
</script>

<template>
  <UiViewPanel :show-return="Boolean(buildId) || Boolean(personnelBuildId)" @custom-return="handleReturn">
    <template #left>
      <template v-if="personnelBuildId">
        <BuildingNetworkStatistics :id="personnelBuildId" :count="personnelBuildCount" />
      </template>

      <UiBoxPanel v-else title-path="network.campusOverview" class="row-span-24" content-class-name="grid grid-cols-1 grid-rows-24 px-4 gap-2">
        <!-- 无线AP统计 -->
        <WiApCount class="row-span-5" :data="topCountState" />
        <!-- 设备数量统计 -->
        <DeviceNumberStats class="row-span-6" :title="$t('network.apNumberCount')" sub-title="AP数量" :data="deviceCountState" />
        <!-- 健康度分布 -->
        <HealthDistribution class="row-span-6 [&>.chart]:py-3" :data="healthCountState" />
        <!-- SSID信道分布 -->
        <SSIDDistribution class="row-span-7" :data="ssidCountState.data" :rate5g="ssidCountState.rate5G" />
      </UiBoxPanel>
    </template>
    <template #right>
      <UiBoxPanel title-path="network.campusUserStatistics" class="row-span-18" content-class-name="grid grid-cols-1 grid-rows-12 gap-2 px-4">
        <!-- 人员分布楼宇Top5 -->
        <PersonDistributedBuilding class="row-span-7" :data="userDistributionTop5State" @build-click="handleBuildClick" />
        <!-- 用户/终端变化趋势 -->
        <UserTerminalTrends v-model:time-type="userOrTerminalStateType" class="row-span-5" :data="userOrTerminalState" />
      </UiBoxPanel>
    </template>

    <TopCountBar class="absolute left-1/2 top-0 -translate-x-1/2" :data="topCountState" />
    <SideToolBar class="absolute bottom-0 left-5" is-campus @floor-click="handleFloorClick" />
    <FloorSelect v-if="buildId" class="absolute bottom-0 left-1/2 -translate-x-1/2" @floor-click="handleFloorClick" />
    <!-- 设备信息 弹窗 -->
    <NetworkDevicePopup :id="deviceId" ref="networkDevicePopup" v-model:visible="showDevicePopup" />
  </UiViewPanel>
</template>

<style scoped>

</style>
