<script setup lang="ts">
import { storeToRefs } from "pinia";
import RoamingRoutePoiListPopup from "@/components/RoamingRoutePoiListPopup/index.vue";
import { getLandmarkFileData } from "@/data/landmarkFileData";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import { useCampusStore } from "@/stores/campus.ts";
import { useI18nStore } from "@/stores/i18n.ts";
import { createLoading } from "@/utils/createLoading.ts";
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
import RenderConfigPopup from "./components/RenderConfigPopup/index.vue";

const campusStore = useCampusStore();
const sceneLoaded = ref(false);

onMounted(async () => {
  wdpMap.addLayer(roamingRoutePoiLayer, roamingRoutePathLayer, roamingRouteTextLayer, roamingRoutePlay);
  // 尝试加载已保存的场景配置
  await loadSavedScene();
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(roamingRoutePoiLayer, roamingRoutePathLayer, roamingRouteTextLayer, roamingRoutePlay);
});

// 监听三维场景创建完成
function setupSceneCreatedListener() {
  wdpMap.onCreated(async (app) => {
    sceneLoaded.value = true;
    // 设置相机 默认角度（与Render组件中相同）
    await app.CameraControl.UpdateCamera({
      location: [121.50093817, 31.29741538, 229.26945739],
      rotation: { pitch: -30.7547, yaw: -107.260773 },
      locationLimit: [],
      pitchLimit: [-89, 0],
      yawLimit: [-180, 179.998993],
      viewDistanceLimit: [1, 10000],
      controlMode: "RTS",
      fieldOfView: 90,
    });
    // 默认 邯郸校区视角
    campusStore.setActiveCampusId(CampusId.HanDan);
    campusRangeLayer.focusByCampusId(CampusId.HanDan);
  });
}

const { isChinese } = storeToRefs(useI18nStore());

// 渲染配置弹窗
const showRenderConfigPopup = ref(false);
const renderConfig = reactive({
  sceneUrl: localStorage.getItem("campusStyle_sceneUrl") || "",
  sceneOrder: localStorage.getItem("campusStyle_sceneOrder") || "",
});

// 自动加载已保存的场景配置
async function loadSavedScene() {
  if (renderConfig.sceneUrl && renderConfig.sceneOrder) {
    // 设置场景创建监听器
    setupSceneCreatedListener();
    // 开始加载三维场景
    const loading = createLoading({ tip: "三维场景加载中，请等待...", size: "large" });
    try {
      await wdpMap.render("player", renderConfig.sceneUrl, renderConfig.sceneOrder);
      (window as any).__wdpMap__ = wdpMap;

      // 监听场景创建完成
      wdpMap.onCreated(() => {
        loading?.close();
      });

      wdpMap.onError(() => {
        loading?.close();
      });
    }
    catch (error) {
      loading?.close();
      console.error("三维场景加载失败:", error);
      // 如果加载失败，显示配置弹窗让用户重新配置
      showRenderConfigPopup.value = true;
    }
  }
  else {
    // 如果没有保存的配置，显示配置弹窗
    showRenderConfigPopup.value = true;
  }
}

function handleRenderConfigSubmit(config: { sceneUrl: string; sceneOrder: string }) {
  localStorage.setItem("campusStyle_sceneUrl", config.sceneUrl);
  localStorage.setItem("campusStyle_sceneOrder", config.sceneOrder);
  renderConfig.sceneUrl = config.sceneUrl;
  renderConfig.sceneOrder = config.sceneOrder;
  // 设置场景创建监听器
  setupSceneCreatedListener();
}

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
  console.log("[campusStyle] roamingRoutePoiClick called, id:", id, "activeTab:", activeTab.value);
  roamingRoutePlay.destroy();
  activePoiId.value = id;
  roamingRouteTextLayer.showAll();
  roamingRoutePoiLayer.hideAll();
  console.log("[campusStyle] Calling focusById, id:", id, "pathId:", activeTab.value);
  roamingRoutePoiLayer.focusById(id, activeTab.value);
  const res = getLandmarkFileData(id);
  const resultData = (res?.resultData as any) || {};
  console.log("[campusStyle] Landmark data retrieved:", { id, hasImages: resultData.fileList?.length, hasDescription: !!resultData.jj });
  poiDetails.value = {
    img: resultData.fileList ?? [],
    description: resultData.jj ?? "",
  };
}
roamingRoutePoiLayer.onClick(({ id, name }) => {
  activePoiName.value = name;
  roamingRoutePoiClick(id);
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
      v-model="activePoiId" v-model:name="activePoiName"
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
    <!--  渲染配置弹窗 -->
    <RenderConfigPopup
      v-model:visible="showRenderConfigPopup"
      :initial-config="renderConfig"
      @submit="handleRenderConfigSubmit" />
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
