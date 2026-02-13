<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useBuildingData } from "@/composables/lifeServices/useBuildingData.ts";
import useWatchCampusIdForSwitchPages from "@/composables/lifeServices/useWatchCampusId.ts";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import dormitoryAreaOneBuildLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaOneBuildLayer.ts";
import dormitoryRoomStatusRangeLayer from "@/utils/WdpMap/lifeServices/DormitoryRoomStatusRangeLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import DormitoryAreaNav from "../components/DormitoryAreaNav/index.vue";
import DormitoryInfo from "./components/DormitoryInfo/index.vue";
import EnergyConsumptionInfo from "./components/EnergyConsumptionInfo/index.vue";
import EquipmentRepairNew from "./components/EquipmentRepairNew/index.vue";
import FocusOnStudentInfoNew from "./components/FocusOnStudentInfoNew/index.vue";
import PersonInfo from "./components/PersonInfo/index.vue";
import RealEstateTablePopup from "./components/RealEstateTablePopup/index.vue";
import RoomLegend from "./components/RoomLegend/index.vue";

const router = useRouter();
const route = useRoute();

useWatchCampusIdForSwitchPages();

// 校区 ID
const campusId = useRouteQuery("campusId", CampusId.HanDan) as unknown as Ref<string>;
// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;
// 楼栋 ID
const buildId = useRouteQuery("buildId") as unknown as Ref<string>;

const personInfoRef = useTemplateRef<InstanceType<typeof PersonInfo>>("personInfoRef");
const energyConsumptionInfoRef = useTemplateRef<InstanceType<typeof EnergyConsumptionInfo>>("energyConsumptionInfoRef");

onMounted(() => {
  console.log("🏢 [楼宇详情页] 步骤3 - 页面初始化:", {
    校区ID: campusId.value,
    宿舍区ID: dormitoryAreaId.value,
    楼栋ID: buildId.value,
    完整路由参数: route.query,
    地图状态: wdpMap.status,
    当前图层列表: wdpMap.layerList.map(l => ({ id: l.layerId, mounted: l.mounted })),
  });

  console.log("🏢 [楼宇详情页] 添加图层前...");
  wdpMap.addLayer(dormitoryAreaOneBuildLayer, dormitoryRoomStatusRangeLayer);
  console.log("🏢 [楼宇详情页] 添加图层后:", {
    当前图层列表: wdpMap.layerList.map(l => ({ id: l.layerId, mounted: l.mounted })),
  });

  console.log("🏢 [楼宇详情页] 注册onCreated回调...");
  wdpMap.onCreated(async () => {
    console.log("✅ [楼宇详情页] onCreated回调被触发!");
    console.log("🏢 [楼宇详情页] 步骤4 - 开始渲染楼栋:", {
      楼栋ID: buildId.value,
    });

    // 渲染楼栋 poi 标签
    await dormitoryAreaOneBuildLayer.render(buildId.value);

    console.log("🏢 [楼宇详情页] 步骤5 - 楼栋渲染完成");

    wdpMap.on("elementClick", (...args) => {
      console.log("🚀 [地图元素点击] 房间点击事件:", args);
    });
  });
  console.log("🏢 [楼宇详情页] onCreated回调注册完成");
});

onBeforeRouteLeave((to, form, next) => {
  if (to.path === "/lifeServices/campusPark") {
    // 返回校区 移除房间图层
    wdpMap.removeLayer(dormitoryAreaOneBuildLayer, dormitoryRoomStatusRangeLayer);
  }
  next();
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(dormitoryAreaOneBuildLayer, dormitoryRoomStatusRangeLayer);
});

function handleCustomReturn() {
  dormitoryAreaOneBuildLayer.clearSplitBuild();
  wdpMap.removeLayer(dormitoryAreaOneBuildLayer, dormitoryRoomStatusRangeLayer);
  const routeQuery = { ...route.query };
  delete routeQuery.buildId;
  router.replace({ path: "/lifeServices/campusPark", query: routeQuery });
}

const realEstateTableVisible = ref(false);

// 面板数据
const { dormitoryInfo, personnelInfo, focusStudentInfo, energyConsumptionInfo: energyConsumptionInfoData } = useBuildingData();

// 监控楼宇详情页数据变化
watch([dormitoryInfo, personnelInfo, focusStudentInfo, energyConsumptionInfoData], () => {
  console.log("🏢 [楼宇详情页] 面板数据更新:", {
    宿舍信息: dormitoryInfo.value,
    人员信息: personnelInfo.value,
    重点关注学生: focusStudentInfo.value,
    能耗信息: energyConsumptionInfoData.value,
  });
}, { immediate: true, deep: true });

onBeforeRouteLeave(() => {
  realEstateTableVisible.value = false;
});

const [roomLegendShow, setRoomLegendShow] = useState(false);
</script>

<!-- 楼宇视角 -->
<template>
  <UiViewPanel
    show-return
    @custom-return="handleCustomReturn"
    @show-build-poi-change="(val) => val ? dormitoryAreaOneBuildLayer.showAll() : dormitoryAreaOneBuildLayer.hideAll()">
    <!-- <template #header>
      <DormitoryAreaNav />
    </template>  -->
    <DormitoryAreaNav />
    <template #left>
      <!--  宿舍信息  -->
      <DormitoryInfo
        v-model:real-estate-table-visible="realEstateTableVisible"
        :base-info="dormitoryInfo.baseInfo"
        :supervisors-list="dormitoryInfo.supervisorsList"
        :park-committee-list="dormitoryInfo.parkCommitteeList" />
      <!--  人员信息  -->
      <PersonInfo
        ref="personInfoRef" v-bind="personnelInfo"
        @occupancy-distribution-change="(val) => {
          setRoomLegendShow(val);
          val && energyConsumptionInfoRef?.closeTop5Room()
        }" />
    </template>

    <!--  楼盘表  -->
    <RealEstateTablePopup v-model:visible="realEstateTableVisible" />

    <template #right>
      <!-- 能耗信息 -->
      <EnergyConsumptionInfo
        ref="energyConsumptionInfoRef"
        :statistics="energyConsumptionInfoData.statistics"
        :list="energyConsumptionInfoData.list"
        @top5-room-open="() => {
          personInfoRef?.closeOccupancyDistributionOpen();
        }" />
      <!-- 设备报修 -->
      <!--      <EquipmentRepair /> -->
      <EquipmentRepairNew v-bind="focusStudentInfo" />
      <!--   重点关注学生信息   -->
      <!--      <FocusOnStudentInfo v-bind="focusStudentInfo" /> -->
      <FocusOnStudentInfoNew v-bind="focusStudentInfo" />
    </template>
    <!--  图例  -->
    <RoomLegend v-if="roomLegendShow" />
  </UiViewPanel>
</template>

<style scoped>

</style>
