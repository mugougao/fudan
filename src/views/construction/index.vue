<script setup lang="ts">
import wdpMap from "@/utils/WdpMap/wdpMap.ts";
import BaseInfoList from "./components/BaseInfoList/index.vue";
import ImplementInfo from "./components/ImplementInfo/index.vue";
import ProjectScheduleList from "./components/ProjectScheduleList/index.vue";
import RenderImage from "./components/RenderImage/index.vue";
import ScaleInfoList from "./components/ScaleInfoList/index.vue";

wdpMap.onCreated(() => {
  wdpMap.app?.CameraControl.FlyTo({
    targetPosition: [121.50184669354806, 31.338841062116895, 216.24838343828844],
    rotation: { pitch: -30, yaw: -90 },
    distance: 200,
    flyTime: 1,
  });
});
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title-path="construction.index.basicInformation" class="row-span-19" content-class-name="space-y-1">
        <BaseInfoList />
        <ScaleInfoList />
        <RenderImage />
      </UiBoxPanel>
      <UiBoxPanel title-path="construction.index.implementUnit" class="row-span-5">
        <ImplementInfo />
      </UiBoxPanel>
    </template>

    <template #right>
      <UiBoxPanel title-path="construction.index.projectProgress" class="row-span-24" content-class-name="py-3">
        <ProjectScheduleList />
      </UiBoxPanel>
    </template>
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
