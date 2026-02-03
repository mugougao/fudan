<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import { sleep } from "@/utils";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer.ts";
import buildingOccupancyRangeLayer from "@/utils/WdpMap/smartTeaching/BuildingOccupancyRangeLayer.ts";
import floorExtractionCustomLayer from "@/utils/WdpMap/smartTeaching/FloorExtractionCustomLayer.ts";
import schoolBuildPoiLayer from "@/utils/WdpMap/smartTeaching/SchoolBuildPoiLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";
import CampusOverview from "@/views/smartTeaching/CampusOverview/index.vue";
import ClassroomDetail from "@/views/smartTeaching/ClassroomDetail/index.vue";
import ClassroomSituation from "@/views/smartTeaching/ClassroomSituation/index.vue";
import BuildDetailPopup from "@/views/smartTeaching/components/BuildDetailPopup/index.vue";
import TeachingBuilding from "@/views/smartTeaching/TeachingBuilding/index.vue";
import TeachingBuildingPopup from "@/views/smartTeaching/TeachingBuildingPopup/index.vue";

//
// 校区ID
const campusId = useRouteQuery<string>("campusId", CampusId.HanDan) as unknown as Ref<string>;
// 当前楼栋
const buildId = useRouteQuery<string>("buildId", "") as unknown as Ref<string>;
// 当前楼层
const floorId = useRouteQuery<string>("floorId", "") as unknown as Ref<string>;
// 楼层房间
const roomId = useRouteQuery<string>("roomId", "") as unknown as Ref<string>;

// 取消当前楼宇炸开id
const activeBuildId = ref("");

watch(buildId, (value) => {
  !value && campusRangeLayer.showAll();
});

const rightShow = ref(false);
const leftShow = ref(true);
const classroom = ref(true);
const teaching = ref(false);
const classDetail = ref(false);
const trailer = ref(false);
const usageRate = ref(false);

// 当前地图是否加载完成
const cloudMapIsMounted = ref(false);

const realEstateTableVisible = ref(false);

function floor() {
  rightShow.value = true;
  leftShow.value = false;
  classroom.value = false;
  teaching.value = true;
  classDetail.value = false;
}

function goback() {
  rightShow.value = false;
  teaching.value = false;
  leftShow.value = true;
  classroom.value = true;
  classDetail.value = false;
  buildId.value = "";
  floorId.value = "";
  roomId.value = "";
  floorExtractionCustomLayer.restore();
  // 取消 拆楼
  // schoolBuildLayer.clearSplitBuild();
  // 显示poi
  schoolBuildPoiLayer.showAll();
  // 聚焦楼栋
  schoolBuildPoiLayer.focusAll();
  // 取消楼宇炸开
  // cloudMap?.SuperAPI("DoBuildingRaise", { BuildID: activeBuildId.value, Raise: "0" });
}

function storey() {
  rightShow.value = true;
  leftShow.value = false;
  classroom.value = false;
  teaching.value = true;
  classDetail.value = true;
}

// 地图教室点击
async function handleElementClick(data: any) {
  const { buildId, roomId: _roomId, gis } = data.args || {};
  // 隐藏所有POI
  // await schoolBuildLayer.hideAllPoi();
  roomId.value = _roomId;
  // if (buildId && _roomId) {
  // const result = await schoolBuildLayer.focusFloorRoom(buildId, _roomId);
  // if (!result) {
  // const [x, y, z] = gis;
  // schoolBuildLayer.SetCameraInfo(`${x},${y}`, 20, z, { pitch: 85 });
  // }
  // }
  // 进入楼层
  storey();
}

const campusStore = useCampusStore();
watch(
  () => campusStore.activeCampusId,
  async (val) => {
    if (val === CampusId.Overview) return;
    campusId.value = val;
    goback();
    await schoolBuildPoiLayer.removeAll();
    await schoolBuildPoiLayer.render(campusId.value);
  },
);

onMounted(() => {
  campusStore.activeCampusId = CampusId.HanDan;
  wdpMap.addLayer(buildingOccupancyRangeLayer, schoolBuildPoiLayer, floorExtractionCustomLayer);
  wdpMap.onCreated(async () => {
    campusPoiLayer.hideAll();
    await schoolBuildPoiLayer.render(campusId.value);
    cloudMapIsMounted.value = true;
    // 楼栋POI 点击事件
    schoolBuildPoiLayer.onClick((data) => {
      // 清除上次选中 楼层
      floorId.value = "";
      buildId.value = data.id;

      // 点击poi楼宇id
      activeBuildId.value = data.id;

      // 打开楼栋详情 弹窗
      trailer.value = true;
      // 进入楼宇
      floor();
      // cloudMap.removeLayer(campusRangeLayer);
      // 隐藏其他POI
      schoolBuildPoiLayer.hideOthers(data.id);
      // 聚焦楼栋
      schoolBuildPoiLayer.flyTo(data.id, { distanceFactor: 300 });
      campusRangeLayer.hideAll();
      // 需要先炸开才能拆楼
      floorExtractionCustomLayer.disperse(buildId.value, "light");
    });
    // 教室点击
    // wdpMap.on("elementClick", handleElementClick);
    if (buildId.value) {
      floor();
      await schoolBuildPoiLayer.hideOthers(buildId.value);
      campusRangeLayer.hideAll();
      await schoolBuildPoiLayer.flyTo(buildId.value, { distanceFactor: 300 });
      const res = await floorExtractionCustomLayer.disperse(buildId.value, "light");
      await sleep(3000);
      if (floorId.value) {
        if (roomId.value) {
          storey();
          schoolBuildPoiLayer.hideAll();
          await floorExtractionCustomLayer.restore();
          // await schoolBuildLayer.focusFloorRoom(buildId.value, roomId.value);
          floorExtractionCustomLayer.focusRoom(buildId.value, floorId.value.toString(), roomId.value);
          return;
        }
        await floorExtractionCustomLayer.focusFloor(buildId.value, Number(floorId.value));
        await floorExtractionCustomLayer.extract(floorId.value);
      }
    }
  });
});

onBeforeUnmount(() => {
  // wdpMap.off("elementClick", handleElementClick);
  wdpMap.removeLayer(buildingOccupancyRangeLayer, schoolBuildPoiLayer, floorExtractionCustomLayer);

  // 切换页面时关闭拆楼特效
  if (activeBuildId.value) {
    floorExtractionCustomLayer.restore();
    // wdpMap?.SuperAPI("DoBuildingRaise", {
    //   BuildID: activeBuildId.value,
    //   Raise: "0",
    // }).catch((err) => {
    //   console.error("调用 API 失败:", err);
    // });
  }
});

const buildTodayUsagePopupData = ref<{ name: string;value: string | number }[]>([]);

async function handleFloorClick(_floorId: number) {
  classDetail.value = false;
  roomId.value = "";
  // await floorExtractionCustomLayer.disperse(buildId.value);
  await floorExtractionCustomLayer.extract(_floorId.toString());
  floorExtractionCustomLayer.focusFloor(buildId.value, _floorId);
}

function handleRoomClick(_floorId: number, _roomId: string) {
  // 进入楼层
  storey();
  // 隐藏所有POI
  schoolBuildPoiLayer.hideAll();
  // 关闭拆楼
  floorExtractionCustomLayer.restore();
  // 聚焦楼层房间
  // schoolBuildLayer.focusFloorRoom(buildId.value, _roomId);
  floorExtractionCustomLayer.focusRoom(buildId.value, _floorId.toString(), _roomId);
}

// 隐藏显示教学楼POI
function handleShowBuildPoiChange(value: boolean) {
  if (buildId.value) {
    value ? schoolBuildPoiLayer.show(buildId.value) : schoolBuildPoiLayer.hide(buildId.value);
    return;
  }
  value ? schoolBuildPoiLayer.showAll() : schoolBuildPoiLayer.hideAll();
}
</script>

<template>
  <UiViewPanel
    :show-return="rightShow"
    @custom-return="() => goback()"
    @show-build-poi-change="handleShowBuildPoiChange">
    <template #left>
      <!--   校园概览   -->
      <CampusOverview v-show="leftShow" />
      <!--  教学楼概览    -->
      <TeachingBuilding
        v-show="teaching" v-model:real-estate-table-visible="realEstateTableVisible"
        @floor-click="handleFloorClick" @room-click="handleRoomClick" />
      <!--  教学楼概览-教室繁忙度排行 -->
      <TeachingBuildingPopup v-model:visible="realEstateTableVisible" />
    </template>

    <template v-if="classroom || classDetail" #right>
      <!--   教室态势   -->
      <ClassroomSituation v-if="classroom" />
      <!--   教室详情   -->
      <ClassroomDetail v-if="classDetail" />
    </template>

    <!--  教学楼 详情弹窗   -->
    <BuildDetailPopup v-model:visible="trailer" @close="() => usageRate = false" />
  </UiViewPanel>
</template>
