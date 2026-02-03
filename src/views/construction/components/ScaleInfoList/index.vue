<script setup lang="ts">
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "ScaleInfoList", inheritAttrs: false });
// suffix
const columns = [
  { label: "总建筑金额", field: "totalFloorArea", suffix: "万元" },
  { label: "总建筑面积", field: "floorArea", suffix: "m²" },
  { label: "地上建筑面积", field: "aboveGroundBuildingArea", suffix: "㎡" },
  { label: "地上", field: "ground", suffix: "层" },
  { label: "地下建筑面积", field: "undergroundConstructionArea", suffix: "㎡" },
  { label: "地下", field: "underground", suffix: "层" },
  { label: "建筑幢数", field: "numberOfBuildings", suffix: "幢" },
  { label: "裙房", field: "podium" },
];
const data = {
  totalFloorArea: "40000",
  floorArea: "50000",
  aboveGroundBuildingArea: "32000",
  ground: "9",
  undergroundConstructionArea: "18000",
  underground: "2",
  numberOfBuildings: "1",
  podium: "——",
};
</script>

<template>
  <div :class="cn('scale-info-list', $attrs.class ?? '')">
    <UiSubTitle title-path="construction.index.constructionScale" />
    <ul class="mx-1 mt-1 space-y-1">
      <li
        v-for="(item, index) in columns" :key="index"
        class="h-[28px] flex items-center children:flex-1 children:text-center">
        <div class="text-[14px] text-[#FFF3F3]">
          {{ item.label }}
        </div>
        <div class="text-[14px] text-white">
          <span>{{ numberToThousands(data[item.field] ?? 0) }}</span>
          <span v-if="item.suffix">{{ item.suffix }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.scale-info-list {
  li {
    background: url("src/assets/images_new/list-bg.png") no-repeat center;
    background-size: 100% 30px;
  }
}
</style>
