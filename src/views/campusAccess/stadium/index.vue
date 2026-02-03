<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import GymnasiumSplitBuild from "@/utils/WdpMap/campusAccess/stadium/GymnasiumSplitBuild.ts";
import sportsVenuePoiLayer from "@/utils/WdpMap/campusAccess/stadium/SportsVenuePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import FloorController from "@/views/campusAccess/stadium/components/FloorController/index.vue";
import StadiumDataActual from "@/views/campusAccess/stadium/components/StadiumDataActual/index.vue";
import StadiumDataOverview from "@/views/campusAccess/stadium/components/StadiumDataOverview/index.vue";

const campusStore = useCampusStore();
//
const publishname = useRouteQuery("publishname", "") as unknown as Ref<string>;
// 进入场馆
const venuesVisible = ref(false);

onMounted(() => {
  wdpMap.addLayer(sportsVenuePoiLayer, GymnasiumSplitBuild);
  wdpMap.onCreated(async () => {
    campusStore.setActiveCampusId(CampusId.JiangWan);
    await sportsVenuePoiLayer.render();
    sportsVenuePoiLayer.onClick(() => {
      venuesVisible.value = true;
    });
    campusPoiLayer.hideAll();
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(sportsVenuePoiLayer, GymnasiumSplitBuild);
  campusPoiLayer.showAll();
});
</script>

<!-- 生活服务体育馆视角 -->
<template>
  <!-- 体育馆 -->
  <UiViewPanel
    :show-return="venuesVisible"
    :show-tools="venuesVisible"
    @custom-return="() => {
      publishname = '';
      venuesVisible = false;
    }"
    @show-build-poi-change="(val) => val ? sportsVenuePoiLayer.showAll() : sportsVenuePoiLayer.hideAll()">
    <template v-if="venuesVisible" #left>
      <!--   场馆实际使用数据   -->
      <StadiumDataActual />
    </template>
    <template v-if="venuesVisible" #right>
      <!--   游泳馆数据概览   -->
      <StadiumDataOverview />
    </template>
    <template v-if="venuesVisible" #default="{ showDataPanel }">
      <FloorController v-show="showDataPanel" />
    </template>
  </UiViewPanel>
</template>

<style scoped>

</style>
