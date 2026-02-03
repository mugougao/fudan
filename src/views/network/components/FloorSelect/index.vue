<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchBuildingFloor } from "@/api/network/campus.ts";

defineOptions({ name: "FloorSelect", inheritAttrs: false });

const emit = defineEmits<{
  floorClick: [floor: string];
}>();

const buildId = useRouteQuery("buildId") as unknown as Ref<string | undefined>;
const floorId = useRouteQuery("floorId") as unknown as Ref<string | undefined>;

const { state: floorList, execute: floorListExecute } = useAsyncState(
  async () => {
    if (!buildId.value) return [];
    const [,res] = await to(fetchBuildingFloor(buildId.value));
    return (res?.resultData || []).reverse();
  },
  [],
  { immediate: true, resetOnExecute: false },
);
watch(() => buildId.value, () => floorListExecute());
function handleFloorClick(floor: string) {
  floorId.value = floor;
  emit("floorClick", floor);
}

const containerRef = useTemplateRef("container");

function prev() {
  const index = floorList.value.findIndex(floor => floor === floorId.value);
  if (index > 0) {
    const floor = floorList.value[index - 1];
    handleFloorClick(floor);
    containerRef.value?.scrollTo({
      left: (document.getElementById(`floor-select-${floor}`)?.offsetLeft ?? 0) - 30,
      behavior: "smooth",
    });
  }
}

function next() {
  const index = floorList.value.findIndex(floor => floor === floorId.value);
  if (index < floorList.value.length - 1) {
    const floor = floorList.value[index + 1];
    handleFloorClick(floor);
    containerRef.value?.scrollTo({
      left: (document.getElementById(`floor-select-${floor}`)?.offsetLeft ?? 0) - 30,
      behavior: "smooth",
    });
  }
}
</script>

<template>
  <div class="floor-select flex items-center" :class="$attrs.class ?? ''">
    <button class="bg-transparent" @click="prev">
      <img src="@/assets/images_new/arrow.png" alt="arrow">
    </button>
    <ul ref="container" class="scrollhide h-[36px] w-[370px] overflow-x-auto overflow-y-hidden whitespace-nowrap text-center scrollbar-hide">
      <li
        v-for="floor in floorList" :id="`floor-select-${floor}`" :key="floor"
        class="h-full w-[74px] inline-flex cursor-pointer items-center justify-center pb-1 font-text-medium"
        :class="floorId === floor && 'active'"
        @click="handleFloorClick(floor)">
        <span :class="floorId === floor ? 'text-white' : 'text-white/60'">{{ floor }}F</span>
      </li>
    </ul>
    <button class="bg-transparent" @click="next">
      <img src="@/assets/images_new/arrow.png" alt="arrow" class="rotate-180">
    </button>
  </div>
</template>

<style scoped lang="scss">
.floor-select {
  ul {
    background: url("@/assets/images_new/floor-bg.png") no-repeat center / 370px 36px;
    li.active {
      position: relative;
      overflow: hidden;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      &::before {
        bottom: -10px;
        width: 40px;
        height: 20px;
        background: #cc1a1a;
        filter: blur(16px);
      }
      &::after {
        bottom: 0;

        width: 0px;
        height: 0px;
        border-style: solid;
        border-width: 0 4px 7px 4px;
        border-color: transparent transparent #fff transparent;
      }
    }
  }
}
</style>
