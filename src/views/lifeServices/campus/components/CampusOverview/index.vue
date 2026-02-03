<script setup lang="ts">
// import { sortChinese } from "@/utils";

defineOptions({ name: "CampusOverview" });

const props = withDefaults(
  defineProps<{
    buildCount: number;
    buildList: { name: string;value: number }[];
    roomCount: number;
    roomList: { name: string;value: number }[];
    bedCount: number;
    bedList: { name: string;value: number }[];
  }>(),
  {},
);

const countList = [
  { title: "dormitory.campus.dormitoryBuild", field: "buildCount", suffix: "栋", icon: "i-svg-icon-raw-build3" },
  { title: "dormitory.campus.roomNumber", field: "roomCount", suffix: "间", icon: "i-svg-icon-house" },
  { title: "dormitory.campus.bedNumber", field: "bedCount", suffix: "个", icon: "i-svg-icon-bed" },
];
</script>

<template>
  <UiBoxPanel
    class="row-span-17"
    title-path="dormitory.campus.campusOverview"
    content-class-name="campus-overview grid grid-cols-8 grid-rows-3 grid-flow-col gap-y-5">
    <div
      v-for="({ field, title, suffix, icon }) in countList" :key="field"
      class="count col-start-1 col-end-3 flex flex-col items-center leading-none">
      <div class="icon-box mt-5 size-[60px] flex flex-col items-center justify-center">
        <span class="mb-2 ml-3 text-xl">
          <i :class="icon" />
        </span>
        <span class="text-[12px] font-title">{{ $t(title) }}</span>
      </div>
      <div class="flex flex flex-col items-center justify-center">
        <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[22px] text-transparent font-number">{{ $_.get(props, field, 0) }}</span>
        <span class="text-[12px] text-white/80">({{ suffix }})</span>
      </div>
    </div>

    <div class="col-start-3 col-end-9">
      <UiChartBar :data="props.buildList" legend="宿舍楼宇" unit="栋" />
    </div>
    <div class="col-start-3 col-end-9">
      <UiChartBar :data="props.roomList" legend="房间数" unit="间" />
    </div>
    <div class="col-start-3 col-end-9">
      <UiChartBar :data="props.bedList" legend="床位数" unit="个" />
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
:deep(.campus-overview) {
  background:
    linear-gradient(to right, transparent, #fff, transparent) no-repeat center 66.66% / 80% 1px,
    linear-gradient(to right, transparent, #fff, transparent) no-repeat center 33.33% / 80% 1px;
}
.count {
  background: url("@/assets/images_new/icon-bg-main.png") no-repeat center -20px / 131px 143px;
}
</style>
