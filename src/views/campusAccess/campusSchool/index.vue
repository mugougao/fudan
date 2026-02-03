<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import campusGatesPoiLayer from "@/utils/WdpMap/campusAccess/campusSchool/CampusGatesPoiLayer.ts";
import crowdDistributionHeatMapLayer from "@/utils/WdpMap/campusAccess/campusSchool/CrowdDistributionHeatMapLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";
import CampusSchoolCampusEntrance from "@/views/campusAccess/campusSchoolCampusEntrance/index.vue";
import CampusSchoolCampusOverview from "@/views/campusAccess/campusSchoolCampusOverview/index.vue";
import CampusSchoolGateSentry from "@/views/campusAccess/campusSchoolGateSentry/index.vue";

// 校区id
const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

const campusStore = useCampusStore();
watch(() => campusStore.activeCampusId, val => campusId.value = val);

const rightShow = ref(false);
const door = ref(false);
const campusSchool = ref(true);
const entrance = ref(false);

// 点击 进入校区
function enterCampus() {
  door.value = true;
  campusSchool.value = false;
  entrance.value = true;
  rightShow.value = false;
}

// 返回按钮
function returnBtn() {
  if (schoolDoorId.value) {
    rightShow.value = false;
    campusSchool.value = false;
    entrance.value = true;
    campusGatesPoiLayer.showAll();
    campusGatesPoiLayer.focusAll();
    schoolDoorId.value = "";
  }
  else {
    campusStore.activeCampusId = CampusId.Overview;
    door.value = false;
    campusSchool.value = true;
    entrance.value = false;
    rightShow.value = false;
  }
}
wdpMap.addLayer(campusGatesPoiLayer, crowdDistributionHeatMapLayer);
onMounted(() => {
  // 切换校区视角，默认概览
  wdpMap.onCreated(async () => {
    // await cloudMap.addLayer(campusGatesPoiLayer, crowdDistributionHeatMapLayer);
    campusGatesPoiLayer.onClick(({ id, ...rest }) => {
      // console.log("🚀 ~ rest:", rest);
      // console.log("🚀 ~ data:", id);
      schoolDoorId.value = id;
      campusGatesPoiLayer.focus(id, { distanceFactor: 0.05 });
      campusGatesPoiLayer.hideOthers(id);
      rightShow.value = true;
    });
    campusStore.setActiveCampusId(campusId.value);
    if (campusId.value !== CampusId.Overview) {
      enterCampus();
      await campusGatesPoiLayer.render(campusId.value);
      campusPoiLayer.hideAll();
      if (schoolDoorId.value) {
        rightShow.value = true;
        await campusGatesPoiLayer.hideOthers(schoolDoorId.value);
        await campusGatesPoiLayer.focus(schoolDoorId.value, { distanceFactor: 0.05 });
      }
    }
    else {
      await campusGatesPoiLayer.removeAll();
      campusPoiLayer.showAll();
      returnBtn();
    }
    schoolDoorId.value ? campusRangeLayer.hideAll() : campusRangeLayer.showAll();
  });
});

onBeforeUnmount(() => {
  campusPoiLayer.showAll();
  campusRangeLayer.showAll();
  wdpMap.removeLayer(campusGatesPoiLayer, crowdDistributionHeatMapLayer);
});

watch(() => campusId.value, (val) => {
  if (val !== CampusId.Overview) {
    enterCampus();
    campusPoiLayer.hideAll();
    campusGatesPoiLayer.render(campusId.value);
  }
  else {
    campusGatesPoiLayer.removeAll();
    campusPoiLayer.showAll();
    // 刷新页面
    // window.location.href = "/campusAccess/campusSchool";
    returnBtn();
  }
});
watch(() => schoolDoorId.value, (value) => {
  if (!!value && !rightShow.value) {
    rightShow.value = true;
  }
  value ? campusRangeLayer.hideAll() : campusRangeLayer.showAll();
});
</script>

<template>
  <UiViewPanel
    :show-return="campusId !== CampusId.Overview || rightShow"
    @custom-return="returnBtn"
    @show-build-poi-change="(val) => val ? campusGatesPoiLayer.showAll() : campusGatesPoiLayer.hideAll()">
    <template #left>
      <!--  校园概览    -->
      <CampusSchoolCampusOverview v-show="campusSchool" />
      <!-- 校区出入口态势 -->
      <CampusSchoolCampusEntrance v-show="entrance" />
    </template>

    <template v-if="rightShow" #right>
      <!-- 门岗态势  -->
      <CampusSchoolGateSentry />
    </template>
  </UiViewPanel>
</template>

<style scoped>

</style>
