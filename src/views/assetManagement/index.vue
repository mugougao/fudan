<script setup lang="ts">
import BuildingDetail from "@/views/assetManagement/BuildingDetail/index.vue";
import CampusOverview from "@/views/assetManagement/CampusOverview/index.vue";
import CampusType from "@/views/assetManagement/CampusType/index.vue";

const rightShow = ref(false);
const leftShow = ref(true);
const general = ref(false);
const buildingShow = ref(false);

function goback() {
  rightShow.value = false;
  leftShow.value = true;
  general.value = false;
  buildingShow.value = false;
}

function campus() {
  rightShow.value = true;
  leftShow.value = false;
  general.value = true;
}

function building() {
  rightShow.value = true;
  leftShow.value = false;
  general.value = true;
  buildingShow.value = true;
}
</script>

<template>
  <ViewPanel :show-return="rightShow" @custom-return="goback">
    <AButton type="primary" size="large" @click="campus">
      进入邯郸校区
    </AButton>
    <AButton type="primary" size="large" @click="building">
      进入楼宇
    </AButton>
    <template #left>
      <!--   校区总览   -->
      <CampusOverview v-show="leftShow" />

      <!--  校区概览    -->
      <CampusType v-show="general" />
    </template>
    <template #right>
      <!--  楼宇详情 -->
      <BuildingDetail v-show="buildingShow" />
    </template>
  </ViewPanel>
</template>

<style scoped>

</style>
