<script setup lang="ts">
import to from "await-to-js";
import { storeToRefs } from "pinia";
import { getLandmarkFile } from "@/api/campusStyle";
import RoamingRoutePoiListPopup from "@/components/RoamingRoutePoiListPopup/index.vue";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import { useCampusStore } from "@/stores/campus.ts";
import { useI18nStore } from "@/stores/i18n.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer.ts";
import roamingRoutePathLayer from "@/utils/WdpMap/campusStyle/RoamingRoutePathLayer.ts";
import roamingRoutePlay from "@/utils/WdpMap/campusStyle/RoamingRoutePlay.ts";
import roamingRoutePoiLayer from "@/utils/WdpMap/campusStyle/RoamingRoutePoiLayer.ts";
import roamingRouteTextLayer from "@/utils/WdpMap/campusStyle/RoamingRouteTextLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";
import CulturalAttractions from "@/views/campusStyle/CulturalAttractions/index.vue";
import HuangBuilding from "@/views/campusStyle/HuangBuilding/index.vue";
import NavigationMenu from "./components/NavigationMenu/index.vue";
import PublicityVideo from "./components/PublicityVideo/index.vue";

const campusStore = useCampusStore();
onMounted(async () => {
  wdpMap.addLayer(roamingRoutePoiLayer, roamingRoutePathLayer, roamingRouteTextLayer, roamingRoutePlay);
  wdpMap.onCreated(() => {
    // 默认 邯郸校区视角
    campusStore.setActiveCampusId(CampusId.HanDan);
    campusRangeLayer.focusByCampusId(CampusId.HanDan);
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(roamingRoutePoiLayer, roamingRoutePathLayer, roamingRouteTextLayer, roamingRoutePlay);
});

const { isChinese } = storeToRefs(useI18nStore());

// 宣传片弹窗
const showPublicityVideo = ref(false);
// 漫游路线POI弹窗
const showRoamingRoutePoiListPopup = ref(false);
const roamingRoutePoiListPopupData = ref<{ id: string; name: string }[]>([]);
// 选中的poi点
const activePoiId = ref("");
const activePoiName = ref("");
const poiDetails = ref({ img: "", description: "" });

const [activeTab,,resetActiveTab] = useState("");

watch(
  () => activeTab.value,
  async (val) => {
    await Promise.allSettled([
      roamingRoutePlay.destroy(),
      roamingRoutePoiLayer.removeAll(),
      roamingRoutePathLayer.removeAll(),
      roamingRouteTextLayer.removeAll(),
    ]);
    if (val === "0") {
      showPublicityVideo.value = true;
      campusPoiLayer.showAll();
      campusRangeLayer.focusByCampusId(CampusId.HanDan);
    }
    else {
      if (val === "") {
        campusPoiLayer.showAll();
        return;
      }
      campusPoiLayer.hideAll();
      await Promise.allSettled([
        roamingRoutePoiLayer.render(val as any),
        roamingRoutePathLayer.render(val as any),
        roamingRouteTextLayer.render(val as any),
      ]);
      roamingRoutePoiListPopupData.value = Array
        .from(roamingRoutePoiLayer.layerDataMap.values())
        .map(({ id, name }) => ({ id, name }));
      showRoamingRoutePoiListPopup.value = true;
    }
  },
);

async function roamingRoutePoiClick(id: string) {
  roamingRoutePlay.destroy();
  activePoiId.value = id;
  roamingRouteTextLayer.showAll();
  roamingRoutePoiLayer.hideAll();
  roamingRoutePoiLayer.focusById(id, activeTab.value);
  const [,res] = await to(getLandmarkFile(id));
  const { resultData = {} } = res || {};
  poiDetails.value = {
    img: resultData.fileList ?? [],
    description: resultData.jj ?? "",
  };
}
roamingRoutePoiLayer.onClick(({ id,name }) => {
  activePoiName.value = name;
  roamingRoutePoiClick(id)
});

function onCloseRoamingRoutePoiListPopup() {
  activePoiId.value = "";
  roamingRoutePlay.destroy();
  roamingRoutePathLayer.showAll();
  roamingRouteTextLayer.showAll();
  roamingRoutePoiLayer.showAll();
  roamingRoutePathLayer.fly();
}
//
</script>

<template>
  <!-- 瞰见复旦 整体视角 -->
  <UiViewPanel
    :left-grid="false"
    :show-return="Boolean(activePoiId)"
    @custom-return="() => activePoiId = ''"
    @show-build-poi-change="(value) => value ? roamingRoutePoiLayer.showAll() : roamingRoutePoiLayer.hideAll()">
    <template #left>
      <NavigationMenu v-model:active-tab="activeTab" />
    </template>

    <template v-if="Boolean(activePoiId)" #right>
      <!--   校园文化宣传   -->
      <HuangBuilding :img="poiDetails.img" />
      <!--   校园文化景点   -->
      <CulturalAttractions :introduce="poiDetails.description" :frist-word="activePoiName" />
    </template>

    <!--  宣传片 弹窗   -->
    <PublicityVideo v-model:visible="showPublicityVideo" @close="() => resetActiveTab()" />
    <!--  漫游路线POI 弹窗 -->
    <RoamingRoutePoiListPopup
      v-model="activePoiId"  v-model:name="activePoiName"
      v-model:visible="showRoamingRoutePoiListPopup" :data="roamingRoutePoiListPopupData"
      @play="() => {
        roamingRoutePlay.play(activeTab);
        roamingRoutePathLayer.hideAll();
        roamingRouteTextLayer.hideAll();
        roamingRoutePoiLayer.hideAll();
      }"
      @stop="() => roamingRoutePlay.pause()"
      @change="(id) => roamingRoutePoiClick(id)"
      @close="onCloseRoamingRoutePoiListPopup" />
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
