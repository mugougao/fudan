<script setup lang="ts">
import { sleep } from "@/utils";
import researchRoomPoiLayer from "@/utils/WdpMap/assetManagement/research/ResearchRoomPoiLayer";
import floorExtractionCustomLayer from "@/utils/WdpMap/smartTeaching/FloorExtractionCustomLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";
import BasicSituation from "./components/BasicSituation/index.vue";
import GraphicMaterials from "./components/GraphicMaterials/index.vue";
import LabDesc from "./components/LabDesc/index.vue";
import UsageData from "./components/UsageData/index.vue";

const router = useRouter();

// 漫游
const laboratoryRoamOpen = ref(false);

wdpMap.addLayer(floorExtractionCustomLayer, researchRoomPoiLayer);
wdpMap.onCreated(async () => {
  researchRoomPoiLayer.onClick(async ({ id }) => {
    floorExtractionCustomLayer.restore();
    floorExtractionCustomLayer.focusRoom("141", "4", id);
    await sleep(2000);
    router.push({
      name: "assetManagement.researchDevice",
    });
  });
  await floorExtractionCustomLayer.disperse("141");
  await sleep(3000);
  await floorExtractionCustomLayer.extract("4");
  floorExtractionCustomLayer.focusFloor("141", 4);
  researchRoomPoiLayer.render();
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(floorExtractionCustomLayer, researchRoomPoiLayer);
});
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title="电镜中心概览" class="row-span-16" content-class-name="grid grid-rows-12 px-3">
        <template #titleSuffix>
          <UiSelectBtn v-model="laboratoryRoamOpen" class="mr-2">
            实验室漫游
          </UiSelectBtn>
        </template>
        <LabDesc class="row-span-5" />
        <GraphicMaterials class="row-span-7" />
      </UiBoxPanel>
    </template>
    <template #right>
      <UiBoxPanel title="使用数据" class="row-span-16" content-class-name="grid grid-rows-12 px-3">
        <template #extra>
          <a href="https://fdemc.fudan.edu.cn/" target="_blank" class="bg-[#7C4D4D]/40 px-1 text-[12px] text-white/60">
            平台预约
          </a>
        </template>
        <BasicSituation class="row-span-3" />
        <UsageData class="row-span-9" />
      </UiBoxPanel>
    </template>
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
