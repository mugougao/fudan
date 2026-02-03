<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useCampusParkData } from "@/composables/lifeServices/useCampusParkData.ts";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import dormitoryAreaBuildRoomLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaBuildRoomLayer.ts";
import dormitoryBuildPoiLayer from "@/utils/WdpMap/lifeServices/DormitoryBuildPoiLayer.ts";
import occupancyRateDistributionLayer from "@/utils/WdpMap/lifeServices/OccupancyRateDistributionLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import DormitoryAreaNav from "../components/DormitoryAreaNav/index.vue";
// import Appliances from "./components/Appliances/index.vue";
import ApprovalData from "./components/ApprovalData/index.vue";
import ConsumeEnergyNew from "./components/ConsumeEnergyNew/index.vue";
// import ConsumeEnergy from "./components/ConsumeEnergy/index.vue";
import LegendBox from "./components/LegendBox/index.vue";
import ParkOverview from "./components/ParkOverview/index.vue";
import PersonnelInformation from "./components/PersonnelInformation/index.vue";
import UseElectricity from "./components/UseElectricity/index.vue";

const router = useRouter();
const route = useRoute();

const cloudMapIsRender = ref(false);

const campusStore = useCampusStore();
const { activeCampusId } = storeToRefs(campusStore);
// 校区 ID
const campusId = useRouteQuery("campusId", CampusId.HanDan) as unknown as Ref<string>;
// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

watch(activeCampusId, () => {
  router.replace({
    path: "/lifeServices/campus",
    query: {
      campusId: activeCampusId.value,
    },
  });
});

// 返回
function handleCustomReturn() {
  wdpMap.removeLayer(dormitoryAreaBuildRoomLayer);
  const routeQuery = { ...route.query };
  delete routeQuery.dormitoryAreaId;
  router.replace({ path: "/lifeServices/campus", query: routeQuery });
}

const openOccupancyDistribution = ref(false);

// ===============================地图==========start=========================
watch(dormitoryAreaId, async (id) => {
  await dormitoryBuildPoiLayer.removeAll();
  await dormitoryBuildPoiLayer.render(id);
});

onMounted(() => {
  wdpMap.addLayer(dormitoryBuildPoiLayer, occupancyRateDistributionLayer);
  wdpMap.onCreated(async () => {
    await dormitoryBuildPoiLayer.render(dormitoryAreaId.value);
    cloudMapIsRender.value = true;
    dormitoryBuildPoiLayer.onClick(async ({ id }) => {
      dormitoryBuildPoiLayer.flyTo(id, { distanceFactor: 200 });
      dormitoryBuildPoiLayer.hideOthers(id);
      router.push({
        path: "/lifeServices/building",
        query: {
          ...route.query,
          campusId: campusId.value,
          dormitoryAreaId: dormitoryAreaId.value,
          buildId: id,
        },
      });
    });
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(dormitoryBuildPoiLayer, occupancyRateDistributionLayer);
});
// ===============================地图==========end=========================

// ===============================面板数据==========start=========================
const {
  // 园区基本概况
  state,
  totalSupervisor,
  // 人员基本信息
  personnelInformationData: {
    total,
    educationData,
    sexData,
    departmentData,
    timeData,
  },
  // 审批数据
  approvalData,
  // 能耗情况
  energyInfo,
} = useCampusParkData();

// ===============================面板数据==========end=========================

function handleOnSearch(value: string) {
  return Array
    .from(dormitoryBuildPoiLayer.layerDataMap.values())
    .reduce((prev, { id, name }) => {
      if (!name.includes(value)) return prev;
      prev.push({ name, id });
      return prev;
    }, [] as { name: string; id: string }[]);
}
</script>

<template>
  <UiViewPanel
    show-return @custom-return="handleCustomReturn"
    @show-build-poi-change="(val) => val ? dormitoryBuildPoiLayer.showAll() : dormitoryBuildPoiLayer.hideAll()">
    <!-- <PoiSearch
      class="ml-auto mt-1.5" width="300px" :on-search="handleOnSearch"
      @select="({ id }) => dormitoryBuildPoiLayer.flyTo(id) " /> -->

    <!-- <template #header>
      <div class="pointer-events-none children:pointer-events-auto">
        <DormitoryAreaNav />
      </div>
    </template> -->

    <DormitoryAreaNav />

    <template #left>
      <!--  园区基本概况  -->
      <ParkOverview v-model:open-occupancy-distribution="openOccupancyDistribution" :data="state.gl" :total-supervisor="totalSupervisor" />
      <!--  人员基本信息  -->
      <PersonnelInformation :total="total" :education-data="educationData" :sex-data="sexData" :department-data="departmentData" :time-data="timeData" />
    </template>

    <!--  图例控制器    -->
    <!--    <LegendController v-model="legendFilter" /> -->
    <!--  图例  -->
    <LegendBox v-if="openOccupancyDistribution" />

    <template #right>
      <!-- 能耗情况 -->
      <!--      <ConsumeEnergy :energy-use-data="energyInfo.energyUseData" :energy-purchase-data="energyInfo.energyPurchaseData" /> -->
      <ConsumeEnergyNew :energy-purchase-data="energyInfo.energyPurchaseData" />
      <!-- 设备维修 -->
      <!--      <Appliances /> -->
      <UseElectricity :energy-use-data="energyInfo.energyUseData" />
      <!--   审批数据  -->
      <ApprovalData :countnum="approvalData?.countnum || 0" :checknum="approvalData?.checknum || 0" />
    </template>
  </UiViewPanel>
</template>

<style scoped>

</style>
