<script setup lang="ts">
import { useOverviewCampus } from "@/composables/financial/useOverviewCampus";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer";
import baseFacilitiesBankPoiLayer from "@/utils/WdpMap/financial/BaseFacilitiesBankPoiLayer.ts";
import baseFacilitiesDeliveryMachinePoiLayer from "@/utils/WdpMap/financial/BaseFacilitiesDeliveryMachinePoiLayer.ts";
import baseFacilitiesSelfServicePrintersPoiLayer from "@/utils/WdpMap/financial/BaseFacilitiesSelfServicePrintersPoiLayer.ts";
import buildingPoiLayer from "@/utils/WdpMap/financial/BuildingPoiLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import CampusAsset from "./components/CampusAsset/index.vue";
import CampusBuildingPopup from "./components/CampusBuildingPopup/index.vue";
import CampusElectric from "./components/CampusElectric/index.vue";
import CampusPointMarker from "./components/CampusPointMarker/index.vue";
import CampusPointMarkerPopup from "./components/CampusPointMarkerPopup/index.vue";
import CampusProperty from "./components/CampusProperty/index.vue";
import CampusRepair from "./components/CampusRepair/index.vue";
import CampusWaterUse from "./components/CampusWaterUse/index.vue";
import FinancialCategoriesCount from "./components/FinancialCategoriesCount/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "financial.index",
  campusRouteName: "financial.campus",
});

const categories = ref<string | undefined>(undefined);
const categoriesComponents = {
  asset: CampusAsset,
  electric: CampusElectric,
  waterUse: CampusWaterUse,
  property: CampusProperty,
  repair: CampusRepair,
};

const { overviewState, categoriesComponentProps } = useOverviewCampus(categories);

// const showBi = ref(false);
const showBuildingPopup = ref(false);
const buildingId = ref<string | undefined>(undefined);
const buildingTitle = ref<string | undefined>(undefined);

const showCampusPointMarkerPopup = ref(false);
const campusPointMarkerPopupProps = ref({ id: "", title: "", type: "" });
const { x, y } = useMouse();
function baseFacilitiesPoiLayerClick({ name, id, data: { type } }) {
  campusPointMarkerPopupProps.value = { id, title: name, type };
  showCampusPointMarkerPopup.value = true;
}

function baseFacilitiesPoiLayerHover({ name }) {
  const tip = document.getElementById("baseFacilitiesPoiLayerTooltip");
  tip && tip?.remove?.();
  const span = document.createElement("span");
  span.className = "absolute text-white bg-black rounded-lg px-2 py-1";
  span.style.cssText += `z-index: 9999;left:${x.value}px;top:${y.value}px;transform: translate(-50%, 100%);`;
  span.innerHTML = name;
  span.setAttribute("id", "campusPointMarkerTooltip");
  document.body.appendChild(span);
}

function removeBaseFacilitiesPoiLayerHover() {
  document.getElementById("campusPointMarkerTooltip")?.remove();
}
let campusPointMarkerPopupClose = () => { };
wdpMap.addLayer(buildingPoiLayer, baseFacilitiesBankPoiLayer, baseFacilitiesSelfServicePrintersPoiLayer, baseFacilitiesDeliveryMachinePoiLayer);
wdpMap.onCreated(() => {
  buildingPoiLayer.onClick(({ id, name }) => {
    buildingId.value = id;
    buildingTitle.value = name;
    showBuildingPopup.value = true;
  });
  baseFacilitiesSelfServicePrintersPoiLayer.onClick((...args) => {
    const [{ id }] = args;
    baseFacilitiesSelfServicePrintersPoiLayer.flyTo(id);
    campusPointMarkerPopupClose = () => baseFacilitiesSelfServicePrintersPoiLayer.focusAll();
    baseFacilitiesPoiLayerClick(...args);
  });
  baseFacilitiesDeliveryMachinePoiLayer.onClick((...args) => {
    const [{ id }] = args;
    baseFacilitiesDeliveryMachinePoiLayer.flyTo(id);
    campusPointMarkerPopupClose = () => baseFacilitiesDeliveryMachinePoiLayer.focusAll();
    baseFacilitiesPoiLayerClick(...args);
  });
  baseFacilitiesBankPoiLayer.onHover(baseFacilitiesPoiLayerHover, removeBaseFacilitiesPoiLayerHover);
  baseFacilitiesDeliveryMachinePoiLayer.onHover(baseFacilitiesPoiLayerHover, removeBaseFacilitiesPoiLayerHover);
  baseFacilitiesSelfServicePrintersPoiLayer.onHover(baseFacilitiesPoiLayerHover, removeBaseFacilitiesPoiLayerHover);
});
onBeforeUnmount(() => {
  removeBaseFacilitiesPoiLayerHover();
  campusPoiLayer.showAll();
  wdpMap.removeLayer(buildingPoiLayer, baseFacilitiesBankPoiLayer, baseFacilitiesSelfServicePrintersPoiLayer, baseFacilitiesDeliveryMachinePoiLayer);
});
</script>

<template>
  <UiViewPanel :show-return="Boolean(categories)" @custom-return="categories = undefined">
    <template #left>
      <UiBoxPanel title-path="financial.index.overview" class="row-span-14">
        <FinancialCategoriesCount v-model="categories" :data="overviewState" />
      </UiBoxPanel>
      <!-- 点位标记 -->
      <CampusPointMarker />
    </template>
    <template v-if="categories" #right>
      <TransitionFadeInRight :appear="false" mode="out-in">
        <UiBoxPanel :key="categories" :title="$t('financial.index.campusOverview')" class="row-span-full">
          <component v-bind="categoriesComponentProps" :is="categoriesComponents[categories]" class="grid grid-cols-1 grid-rows-24 h-full px-1" />
        </UiBoxPanel>
      </TransitionFadeInRight>
    </template>

    <!-- <div class="absolute left-5 top-0">
    <LargeScreenPreview
      screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/4ed0aaba16cd43d485a2bdf10f7ad277/view?entryType=7"
      screen-title="BI报表" @close="() => showBi = false">
      <template #trigger>
        <ToolbarCheckboxItem v-model="showBi" icon="i-svg-network-bi" value="1" label="BI报表" />
      </template>
    </LargeScreenPreview>
    </div> -->
    <!--  BI弹窗  -->
    <!-- <CampusBIReportPopup v-model:visible="showBi" /> -->
    <!-- 楼栋详情弹窗 -->
    <CampusBuildingPopup :id="buildingId" v-model:visible="showBuildingPopup" :title="buildingTitle" />
    <!-- 点位标记弹窗 -->
    <CampusPointMarkerPopup v-model:visible="showCampusPointMarkerPopup" v-bind="campusPointMarkerPopupProps" @close="() => campusPointMarkerPopupClose()" />
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
