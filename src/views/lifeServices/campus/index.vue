<script setup lang="ts">
import type { Ref, WatchStopHandle } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useCampusData } from "@/composables/lifeServices/useCampusData.ts";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import dormitoryAreaPoiLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaPoiLayer.ts";
import dormitoryAreaRangeLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaRangeLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import DormitoryAreaNav from "../components/DormitoryAreaNav/index.vue";
import CampusEnergyConsumption from "./components/CampusEnergyConsumption/index.vue";
import CampusOverview from "./components/CampusOverview/index.vue";
import PersonnelDistribution from "./components/PersonnelDistribution/index.vue";
// import RepairInfo from "./components/RepairInfo/index.vue";
import RepairInfoNew from "./components/RepairInfoNew/index.vue";

const router = useRouter();
const route = useRoute();
const campusStore = useCampusStore();
const { activeCampusId } = storeToRefs(campusStore);
watch(
  activeCampusId,
  (val) => {
    router.replace(
      val !== CampusId.Overview
        ? { path: route.path, query: { ...route.query, campusId: val } }
        : { path: "/lifeServices" },
    );
  },
);

// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

// 点击 宿舍区 range poi
function dormitoryAreaClick({ id }) {
  dormitoryAreaId.value = id;
}

let stopDormitoryAreaIdWatch: WatchStopHandle;
onMounted(() => {
  wdpMap.addLayer(dormitoryAreaRangeLayer, dormitoryAreaPoiLayer);
  wdpMap.onCreated(async () => {
    stopDormitoryAreaIdWatch = watch(activeCampusId, async (val) => {
      if (!!val && val !== CampusId.Overview) {
        await dormitoryAreaRangeLayer.removeAll();
        await dormitoryAreaPoiLayer.removeAll();
        await dormitoryAreaRangeLayer.render(val);
        await dormitoryAreaPoiLayer.render(val);
        // await dormitoryAreaPoiLayer.focusAll();
        // await dormitoryAreaRangeLayer.focusAll();
      }
    }, { immediate: true });
    dormitoryAreaRangeLayer.onClick(dormitoryAreaClick);
    dormitoryAreaPoiLayer.onClick(dormitoryAreaClick);
  });
});

onBeforeUnmount(() => {
  stopDormitoryAreaIdWatch();
  wdpMap.removeLayer(dormitoryAreaRangeLayer, dormitoryAreaPoiLayer);
});

const { campusOverviewData, personnelDistributionData, campusEnergyUseData, campusEnergyPurchaseData } = useCampusData();
</script>

<!-- 生活服务校区视角 -->
<template>
  <UiViewPanel show-return @custom-return="$router.replace({ path: '/lifeServices' })">
    <!-- <template #header>
      <DormitoryAreaNav />
    </template> -->
    <DormitoryAreaNav />
    <template #left>
      <!--  校园概览  -->
      <CampusOverview v-bind="campusOverviewData" />
      <!--  人员分布  -->
      <PersonnelDistribution v-bind="personnelDistributionData" />
    </template>

    <template #right>
      <!-- 校园能耗 -->
      <CampusEnergyConsumption :energy-use-data="campusEnergyUseData" :energy-purchase-data="campusEnergyPurchaseData" />
      <!-- 修缮信息 -->
      <!-- <RepairInfo /> -->
      <RepairInfoNew />
    </template>
  </UiViewPanel>
</template>

<style scoped>

</style>
