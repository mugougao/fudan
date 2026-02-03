<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useCampusAssets } from "@/composables/assetManagement/campusAssets.ts";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import { useCampusStore } from "@/stores/campus.ts";
import campusAssetsBuildPoiLayer from "@/utils/WdpMap/assetManagement/campusAssets/campusAssetsBuildPoiLayer.ts";
import campusAssetsTypeWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/campusAssets/CampusAssetsTypeWithCollegePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";
import BiBigScreen from "./components/BiBigScreen/index.vue";
import BuildPopup from "./components/BuildPopup/index.vue";
import CampusPanel from "./components/CampusPanel/index.vue";
import FacultyAssetQuery from "./components/FacultyAssetQuery/index.vue";
import OverviewPanel from "./components/OverviewPanel/index.vue";

const campusStore = useCampusStore();
const { activeCampusId } = storeToRefs(campusStore);
const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

const facultyAssetQueryRef = useTemplateRef<InstanceType<typeof FacultyAssetQuery>>("facultyAssetQueryRef");

// 楼栋弹窗 显示状态
const [buildPopupVisible, setBuildPopupVisible] = useState(false);
const [buildPopupId, setBuildPopupId] = useState("");
const [buildPopupTitle, setBuildPopupTitle] = useState("");
const [buildPopupFaculties, setbuildPopupFaculties] = useState("");

onMounted(() => {
  wdpMap.addLayer(campusAssetsTypeWithCollegePoiLayer, campusAssetsBuildPoiLayer);
  wdpMap.onCreated(async () => {
    if (campusId.value && campusId.value !== CampusId.Overview) {
      await campusAssetsBuildPoiLayer.render(campusId.value);
      // campusAssetsBuildPoiLayer.focusAll();
      await campusPoiLayer.hideAll();
      // campusRangeLayer.focusByCampusId(campusId.value);
      if (campusId.value === CampusId.HanDan) {
        wdpMap.app?.CameraControl.FlyTo({
          targetPosition: [121.50068888947698, 31.29651976753655, 412.94371073135414],
          rotation: { pitch: -30.000150680541992, yaw: -90.00018310546875 },
          distance: 200,
          flyTime: 1,
        });
      }
      else {
        campusAssetsBuildPoiLayer.focusAll();
      }
    }
    else if (!campusId.value || campusId.value === CampusId.Overview) {
      campusStore.setActiveCampusId(CampusId.Overview);
      campusRangeLayer.focusByCampusId(CampusId.Overview);
    }

    campusAssetsBuildPoiLayer.onClick(({ id, name }) => {
      setBuildPopupVisible(true);
      setBuildPopupId(id);
      setBuildPopupTitle(name);
      setbuildPopupFaculties("");
      campusAssetsBuildPoiLayer.flyTo(id, { distanceFactor: 200 });
      campusAssetsBuildPoiLayer.hideOthers(id);
    });

    campusAssetsTypeWithCollegePoiLayer.onClick(({ id, name }) => {
      setBuildPopupVisible(true);
      setBuildPopupId(id);
      setBuildPopupTitle(name);
      setbuildPopupFaculties(facultyAssetQueryRef.value?.searchText ?? "");
      campusAssetsTypeWithCollegePoiLayer.hideOthers(id);
      campusAssetsTypeWithCollegePoiLayer.flyTo(id, { distanceFactor: 200 });
    });
  });
});

whenever(
  () => !buildPopupVisible.value,
  () => {
    campusAssetsBuildPoiLayer.showAll();
    campusAssetsTypeWithCollegePoiLayer.showAll();
  },
);

onBeforeUnmount(() => {
  campusPoiLayer.showAll();
  wdpMap.removeLayer(campusAssetsTypeWithCollegePoiLayer, campusAssetsBuildPoiLayer);
});

watch(
  activeCampusId,
  (val) => {
    campusId.value = val;
  },
);

watch(campusId, async (val) => {
  if (val !== CampusId.Overview) {
    campusPoiLayer.hideAll();
    campusAssetsTypeWithCollegePoiLayer.removeAll();
    await campusAssetsBuildPoiLayer.render(val);
    if (val === CampusId.HanDan) {
      wdpMap.app?.CameraControl.FlyTo({
        targetPosition: [121.50068888947698, 31.29651976753655, 412.94371073135414],
        rotation: { pitch: -30.000150680541992, yaw: -90.00018310546875 },
        distance: 200,
        flyTime: 1,
      });
    }
    else {
      campusAssetsBuildPoiLayer.focusAll();
    }
  }
  else {
    campusPoiLayer.showAll();
    campusAssetsBuildPoiLayer.removeAll();
  }
});

const { overviewState, numberAssetsState, expireAssetsState, setExpireAssetsType, largeInstrumentState } = useCampusAssets();
const overviewStateData = computed(() => ({
  totalNumber: overviewState.value.totalNumber,
  totalAmount: overviewState.value.totalAmount,
  list: overviewState.value.typeList,
}));

function handleOnSearch(value: string) {
  return Array
    .from(campusAssetsBuildPoiLayer.layerDataMap.values())
    .reduce((prev, { name, id }) => {
      if (!name.includes(value)) return prev;
      prev.push({ name, id });
      return prev;
    }, [] as any[]);
}
</script>

<template>
  <UiViewPanel
    :show-return="campusId !== CampusId.Overview"
    @custom-return="() => {
      activeCampusId = CampusId.Overview
    }">
    <PoiSearch
      v-if="campusId !== CampusId.Overview"
      class="ml-auto mt-1.5" width="300px" :on-search="handleOnSearch"
      @select="({ id }) => {
        // campusAssetsBuildPoiLayer.focusCovering(id, 100)
      }" />
    <template #left>
      <!-- 概况面板 -->
      <OverviewPanel
        v-if="campusId === CampusId.Overview"
        :overview-state="overviewStateData"
        :number-assets-state="numberAssetsState"
        :expire-assets-state="expireAssetsState"
        :set-expire-assets-type="setExpireAssetsType"
        :large-instrument-state="largeInstrumentState" />
      <CampusPanel
        v-else
        :overview-state="overviewStateData"
        :expire-assets-state="expireAssetsState"
        :set-expire-assets-type="setExpireAssetsType"
        :large-instrument-state="largeInstrumentState" />
    </template>
    <template v-if="campusId === CampusId.Overview" #right>
      <!--   Bi资产管理大屏   -->
      <BiBigScreen />
      <!--   院系资产查询   -->
      <FacultyAssetQuery ref="facultyAssetQueryRef" />
    </template>
    <BuildPopup
      v-model:visible="buildPopupVisible" :build-id="buildPopupId" :title="buildPopupTitle" :faculties="buildPopupFaculties"
      @close="() => {
        (!campusId || campusId === CampusId.Overview)
          ? campusAssetsTypeWithCollegePoiLayer.focusAll()
          : campusAssetsBuildPoiLayer.focusAll()
      }" />
  </UiViewPanel>
</template>

<style scoped>

</style>
