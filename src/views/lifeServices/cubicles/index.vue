<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useCubiclesData } from "@/composables/lifeServices/useCubiclesData.ts";
import useWatchCampusIdForSwitchPages from "@/composables/lifeServices/useWatchCampusId.ts";
import dormitoryAreaBuildRoomLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaBuildRoomLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import DormitoryAreaNav from "@/views/lifeServices/components/DormitoryAreaNav/index.vue";
import EnergyCosts from "@/views/lifeServices/cubicles/components/EnergyCosts/index.vue";
import PersonnelInformation from "@/views/lifeServices/cubicles/components/PersonnelInformation/index.vue";
import RoomDetails from "@/views/lifeServices/cubicles/components/RoomDetails/index.vue";

const router = useRouter();
const route = useRoute();

// 楼栋 ID
const buildId = useRouteQuery("buildId") as unknown as Ref<string>;
//  房间ID
const roomId = useRouteQuery("roomId", "") as unknown as Ref<string>;

onMounted(() => {
  wdpMap.addLayer(dormitoryAreaBuildRoomLayer);
  wdpMap.onCreated(async () => {
    await dormitoryAreaBuildRoomLayer.render(buildId.value, roomId.value);
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(dormitoryAreaBuildRoomLayer);
});

useWatchCampusIdForSwitchPages();

function handleCustomReturn() {
  const routeQuery = { ...route.query };
  delete routeQuery.roomId;
  router.replace({ path: "/lifeServices/building", query: routeQuery });
}

const { roomInfoData, personnelInfo, energyInfo } = useCubiclesData();
</script>

<template>
  <UiViewPanel show-return @custom-return="handleCustomReturn">
    <!-- <template #header>
      <DormitoryAreaNav />
    </template> -->
    <DormitoryAreaNav />
    <template #left>
      <!--  房间详情  -->
      <RoomDetails :room-info="roomInfoData.roomInfo" :is-civilization-bedroom="roomInfoData.isCivilizationBedroom" />
      <!--  人员信息  -->
      <PersonnelInformation :list="personnelInfo" />
    </template>
    <template #right>
      <!--  能耗信息  -->
      <EnergyCosts
        :year-electricity="energyInfo.yearElectricity"
        :month-use-electricity="energyInfo.monthUseElectricity"
        :month-purchase-electricity="energyInfo.monthPurchaseElectricity" />
    </template>
  </UiViewPanel>
</template>

<style scoped>

</style>
