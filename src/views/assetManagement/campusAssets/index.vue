<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
// import { useCampusAssets } from "@/composables/assetManagement/campusAssets.ts";
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

// 硬编码数据 - 替换接口调用
// const { overviewState, numberAssetsState, expireAssetsState, setExpireAssetsType, largeInstrumentState } = useCampusAssets();

// 模拟数据：总览数据
const mockOverviewState = ref({
  totalNumber: 12.5, // 万个
  totalAmount: 3.2, // 亿元
  typeList: {
    "设备": [8.0, 2.0], // [数量（万个）, 金额（亿元）]
    "家具": [3.0, 0.5],
    "软件": [1.5, 0.7]
  } as Record<"设备" | "家具" | "软件", [number, number]>
});

// 模拟数据：资产数量分布（按校区）
const mockNumberAssetsState = ref([
  { name: "邯郸", value: 5.0, value2: 1.2 }, // 数量（万个）, 金额（亿元）
  { name: "江湾", value: 3.0, value2: 0.8 },
  { name: "枫林", value: 2.5, value2: 0.7 },
  { name: "张江", value: 2.0, value2: 0.5 }
]);

// 模拟数据：资产到期分布
const mockExpireAssetsState = ref([
  { name: "2025年", value1: 100, value2: 500 }, // 数量（个）, 金额（万元）
  { name: "2026年", value1: 150, value2: 750 },
  { name: "2027年", value1: 200, value2: 1000 },
  { name: "2028年", value1: 80, value2: 400 }
]);

// 模拟数据：大型仪器分布
const mockLargeInstrumentState = ref([
  { name: "光谱仪", value: 25 },
  { name: "显微镜", value: 40 },
  { name: "离心机", value: 35 },
  { name: "色谱仪", value: 20 },
  { name: "质谱仪", value: 15 }
]);

// 资产到期分布类型选择（0:设备, 1:家具）
const expireAssetsType = ref<0 | 1>(0);

// 模拟函数：设置资产到期类型
const mockSetExpireAssetsType = (type: 0 | 1) => {
  expireAssetsType.value = type;
  console.log('切换资产到期类型:', type);
};

// 资产类型选择（设备、家具、软件）
const selectedAssetType = ref<"设备" | "家具" | "软件">("设备");

// 根据资产类型切换的模拟数据
const mockDataByType = {
  // 设备类型数据
  "设备": {
    overview: {
      totalNumber: 8.0, // 万个
      totalAmount: 2.0, // 亿元
      typeList: {
        "设备": [8.0, 2.0], // [数量（万个）, 金额（亿元）]
        "家具": [1.5, 0.3],
        "软件": [0.8, 0.4]
      } as Record<"设备" | "家具" | "软件", [number, number]>
    },
    numberAssets: [
      { name: "邯郸", value: 3.5, value2: 0.9 }, // 数量（万个）, 金额（亿元）
      { name: "江湾", value: 2.0, value2: 0.5 },
      { name: "枫林", value: 1.5, value2: 0.4 },
      { name: "张江", value: 1.0, value2: 0.2 }
    ],
    expireAssets: [
      { name: "2025年", value1: 60, value2: 300 }, // 数量（个）, 金额（万元）
      { name: "2026年", value1: 80, value2: 400 },
      { name: "2027年", value1: 100, value2: 500 },
      { name: "2028年", value1: 40, value2: 200 }
    ],
    largeInstruments: [
      { name: "光谱仪", value: 25 },
      { name: "显微镜", value: 40 },
      { name: "离心机", value: 35 },
      { name: "色谱仪", value: 20 },
      { name: "质谱仪", value: 15 }
    ]
  },
  // 家具类型数据
  "家具": {
    overview: {
      totalNumber: 3.0, // 万个
      totalAmount: 0.5, // 亿元
      typeList: {
        "设备": [1.5, 0.4],
        "家具": [3.0, 0.5], // [数量（万个）, 金额（亿元）]
        "软件": [0.5, 0.1]
      } as Record<"设备" | "家具" | "软件", [number, number]>
    },
    numberAssets: [
      { name: "邯郸", value: 1.2, value2: 0.2 },
      { name: "江湾", value: 0.8, value2: 0.15 },
      { name: "枫林", value: 0.6, value2: 0.1 },
      { name: "张江", value: 0.4, value2: 0.05 }
    ],
    expireAssets: [
      { name: "2025年", value1: 30, value2: 150 },
      { name: "2026年", value1: 40, value2: 200 },
      { name: "2027年", value1: 50, value2: 250 },
      { name: "2028年", value1: 20, value2: 100 }
    ],
    largeInstruments: [
      { name: "办公椅", value: 120 },
      { name: "办公桌", value: 80 },
      { name: "文件柜", value: 60 },
      { name: "会议桌", value: 40 },
      { name: "书架", value: 50 }
    ]
  },
  // 软件类型数据
  "软件": {
    overview: {
      totalNumber: 1.5, // 万个
      totalAmount: 0.7, // 亿元
      typeList: {
        "设备": [0.8, 0.3],
        "家具": [0.5, 0.1],
        "软件": [1.5, 0.7] // [数量（万个）, 金额（亿元）]
      } as Record<"设备" | "家具" | "软件", [number, number]>
    },
    numberAssets: [
      { name: "邯郸", value: 0.6, value2: 0.3 },
      { name: "江湾", value: 0.4, value2: 0.2 },
      { name: "枫林", value: 0.3, value2: 0.15 },
      { name: "张江", value: 0.2, value2: 0.05 }
    ],
    expireAssets: [
      { name: "2025年", value1: 10, value2: 50 },
      { name: "2026年", value1: 15, value2: 75 },
      { name: "2027年", value1: 20, value2: 100 },
      { name: "2028年", value1: 8, value2: 40 }
    ],
    largeInstruments: [
      { name: "操作系统", value: 45 },
      { name: "数据库软件", value: 35 },
      { name: "办公软件", value: 80 },
      { name: "专业软件", value: 25 },
      { name: "开发工具", value: 30 }
    ]
  }
};

// 使用模拟数据
const overviewState = computed(() => mockDataByType[selectedAssetType.value].overview);
const numberAssetsState = computed(() => mockDataByType[selectedAssetType.value].numberAssets);

// 资产到期分布数据：根据expireAssetsType显示对应的数据
const expireAssetsState = computed(() => {
  // expireAssetsType: 0=设备, 1=家具
  const assetType = expireAssetsType.value === 0 ? "设备" : "家具";
  return mockDataByType[assetType].expireAssets;
});

const largeInstrumentState = computed(() => mockDataByType[selectedAssetType.value].largeInstruments);
const setExpireAssetsType = mockSetExpireAssetsType;

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
      <!-- 资产类型选择器 -->
      <div v-if="campusId === CampusId.Overview" class="asset-type-selector mb-4 flex items-center justify-center space-x-4">
        <div 
          v-for="type in ['设备', '家具', '软件']" 
          :key="type"
          class="px-4 py-2 rounded-lg cursor-pointer transition-all"
          :class="selectedAssetType === type 
            ? 'bg-[#CC1A1A] text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          @click="selectedAssetType = type as any">
          {{ type }}
        </div>
      </div>
      
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
