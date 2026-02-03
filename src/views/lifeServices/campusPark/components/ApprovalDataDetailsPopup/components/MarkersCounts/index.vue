<script setup lang="ts">
import { get } from "lodash";
import accommodationIcon from "@/assets/images/lifeServices/campusPark/accommodation.png";
import dropOutIcon from "@/assets/images/lifeServices/campusPark/dropOut.png";
import occupancyIcon from "@/assets/images/lifeServices/campusPark/occupancy.png";

defineOptions({ name: "MarkersCounts", inheritAttrs: false });

const { data } = defineProps<{
  data: {
    dropOut: number;
    occupancy: number;
    accommodation: number;
  };
}>();

const columns = [
  { title: "退宿人数", field: "dropOut", icon: dropOutIcon },
  { title: "新入住人数", field: "occupancy", icon: occupancyIcon },
  { title: "调宿人数", field: "accommodation", icon: accommodationIcon },
];
</script>

<template>
  <ul class="markers-counts flex items-center justify-evenly">
    <li v-for="(item) in columns" :key="item.field" class="flex items-center">
      <span class="ml-3 block size-[60px]">
        <i class="i-ri-user-fill ml-[26px] mt-[10px]" />
      </span>
      <span class="ml-2 flex flex-col">
        <span class="text-[14px] text-white/80">{{ item.title }}</span>
        <span class="text-[18px] text-white font-number">
          {{ get(data, item.field, 0) }}
          <span class="text-[12px] text-white/80 font-text">人</span>
        </span>
      </span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.markers-counts {
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat 33.33% center / 1px 30px,
    linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat 66.66% center / 1px 30px;
  & > li {
    background: url("@/assets/images_new/icon-bg-main.png") no-repeat -25px center / 131px 143px;
  }
}
</style>
