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
  // 目前只有 邯郸-北区- 119栋/45栋 有 三维户型 模式
  if (!threeDimensionalHouseType?.has3DMode(buildId.value)) {
    threeDHouseModel.value = false;
    window.$message.warning("当前楼栋三维户型模式暂未开放！！！");
    return;
  }
  threeDHouseModel.value = !threeDHouseModel.value;
  threeDHouseModel.value
    ? threeDimensionalHouseType.enter3DMode(buildId.value, roomInfo?.fjh)
    : threeDimensionalHouseType.exit3DMode();
}

// 切换 俯视/漫游
function switchVisualAngleModel() {
  visualAngleModel.value = visualAngleModel.value === "over" ? "roam" : "over";
  // 漫游
  visualAngleModel.value === "roam"
    ? threeDimensionalHouseType.enterRoam()
    : threeDimensionalHouseType.enterOver();
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
      <div class="fixed left-430px top-150px space-y-5">
        <div class="building" :class="threeDHouseModel ? 'active' : 'building'" @click="navListClick">
          <div>
            <div>
              {{ $t('dormitory.room.HouseType_3D') }}
            </div>
          </div>
        </div>
        <div v-show="threeDHouseModel" class="building active" @click="switchVisualAngleModel">
          <div>
            <div>
              <span :class="visualAngleModel === 'over' ? 'font-bold' : 'text-12px'">
                {{ $t('dormitory.room.over') }}
              </span>
              <span class="mx-0.5">/</span>
              <span :class="visualAngleModel === 'roam' ? 'font-bold' : 'text-12px' ">
                {{ $t('dormitory.room.roam') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
