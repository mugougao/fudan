<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { get } from "lodash";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave } from "vue-router";
import { ThreeDimensionalHouseType } from "@/utils/WdpMap/lifeServices/ThreeDimensionalHouseType.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";

const { roomInfo = {}, isCivilizationBedroom = false } = defineProps<{
  roomInfo?: Record<string, any>;
  // 是否文明寝室
  isCivilizationBedroom?: boolean;
}>();

const { tm } = useI18n();

const buildId = useRouteQuery("buildId") as unknown as Ref<string>;

const columns = computed(() => {
  const titles = tm("dormitory.room.roomDetailsField");
  return [
    { title: titles[0], field: "ssmc", icon: "i-svg-icon-build4" },
    { title: titles[1], field: "lymc", icon: "i-svg-icon-build3" },
    { title: titles[2], field: "lcmc", icon: "i-svg-icon-layer" },
    { title: titles[3], field: "fjh", icon: "i-svg-icon-house-no" },
    { title: titles[4], field: "fjlb", icon: "i-svg-icon-bookmark" },
    { title: titles[5], field: "fjxb", icon: "i-svg-icon-sex" },
  ];
});

// 3D户型模式
const threeDHouseModel = ref(false);
// 漫游(roam)/俯视(over) 切换
const visualAngleModel = ref<"over" | "roam">("over");
let threeDimensionalHouseType: InstanceType<typeof ThreeDimensionalHouseType>;

onMounted(() => {
  wdpMap.onCreated((app) => {
    threeDimensionalHouseType = new ThreeDimensionalHouseType(app);
  });
});

function navListClick() {
  console.log("🏠 [房间详情] 点击三维户型按钮:", {
    当前状态: threeDHouseModel.value ? "已开启" : "未开启",
    楼栋ID: buildId.value,
    房间号: roomInfo?.fjh,
  });

  // 直接切换状态，不进行任何校验
  threeDHouseModel.value = !threeDHouseModel.value;
  
  console.log("🏠 [房间详情] 切换三维户型状态:", {
    新状态: threeDHouseModel.value ? "开启" : "关闭",
  });

  if (threeDHouseModel.value) {
    console.log("🎬 [房间详情] 直接进入三维户型模式（无校验）...");
    threeDimensionalHouseType.enter3DMode(buildId.value, roomInfo?.fjh);
  } else {
    console.log("🚪 [房间详情] 退出三维户型模式...");
    threeDimensionalHouseType.exit3DMode();
  }
}

// 切换 俯视/漫游
function switchVisualAngleModel() {
  const oldMode = visualAngleModel.value;
  visualAngleModel.value = visualAngleModel.value === "over" ? "roam" : "over";
  
  console.log("🔄 [房间详情] 切换视角模式:", {
    原模式: oldMode === "over" ? "俯视" : "漫游",
    新模式: visualAngleModel.value === "over" ? "俯视" : "漫游",
  });

  // 漫游
  if (visualAngleModel.value === "roam") {
    console.log("🚶 [房间详情] 进入漫游模式...");
    threeDimensionalHouseType.enterRoam();
  } else {
    console.log("👁️ [房间详情] 进入俯视模式...");
    threeDimensionalHouseType.enterOver();
  }
}

onBeforeUnmount(() => {
  threeDimensionalHouseType.exit3DMode(false);
  visualAngleModel.value = "over";
});

onBeforeRouteLeave(async () => {
  await threeDimensionalHouseType.exit3DMode(false);
  return true;
});
</script>

<template>
  <UiBoxPanel
    class="row-span-8"
    title-path="dormitory.room.roomDetails">
    <template #titleSuffix>
      <span class="ml-2 inline-flex items-center text-[12px] font-text-bold">
        <img src="@/assets/images/lifeServices/cubicles/setUp.png" alt="" class="mr-0.5 size-[20px]">
        {{ $t('dormitory.room.civilizedDormitory') }}
      </span>
    </template>

    <div class="area-list grid grid-cols-2 grid-rows-2 mt-3 flex-auto gap-x-1.5 gap-y-1.5 overflow-hidden pt-1">
      <UiCountItemBox
        v-for="({ title, icon, field }, index) in columns" :key="index"
        :name="title" :icon-text="title" :icon="icon" :value="get(roomInfo, field)">
        <template #name>
          <span class="inline-block pb-0.5 text-[12px]">{{ title }}</span>
        </template>
        <template #value="{ value }">
          <span class="text-[20px]">{{ value }}</span>
        </template>
      </UiCountItemBox>
    </div>

    <Teleport to="body">
      <div class="three-d-controls">
        <button
          type="button"
          class="control-btn"
          :class="{ active: threeDHouseModel }"
          @click="navListClick">
          <span class="btn-text">{{ $t('dormitory.room.HouseType_3D') }}</span>
        </button>
        <button
          v-show="threeDHouseModel"
          type="button"
          class="control-btn active"
          @click="switchVisualAngleModel">
          <span class="btn-text">
            <span :class="visualAngleModel === 'over' ? 'font-bold' : 'opacity-60'">
              {{ $t('dormitory.room.over') }}
            </span>
            <span class="mx-1">/</span>
            <span :class="visualAngleModel === 'roam' ? 'font-bold' : 'opacity-60'">
              {{ $t('dormitory.room.roam') }}
            </span>
          </span>
        </button>
      </div>
    </Teleport>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.three-d-controls {
  position: fixed;
  left: 18%;
  top: 12%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-btn {
  width: 120px;
  height: 40px;
  background: url("@/assets/images_new/btn-bg.png") no-repeat center / 100% 100%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  .btn-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  &:hover {
    background-image: url("@/assets/images_new/btn-bg-active.png");

    .btn-text {
      color: rgba(255, 255, 255, 1);
      font-weight: bold;
    }
  }

  &.active {
    background-image: url("@/assets/images_new/btn-bg-active.png");

    .btn-text {
      color: rgba(255, 255, 255, 1);
      font-weight: bold;
    }
  }
}
</style>
