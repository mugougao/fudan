<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { getBuildRoomTable } from "@/api/lifeServices";
import { CampusId } from "@/enums";
import { cn } from "@/utils";
import dormitoryAreaOneBuildLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaOneBuildLayer.ts";

defineOptions({ name: "RealEstateTablePopup" });
const visible = defineModel<boolean>("visible", { default: false });

const router = useRouter();
// 校区 ID
const campusId = useRouteQuery("campusId", CampusId.HanDan) as unknown as Ref<string>;
// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;
// 楼栋 ID
const buildId = useRouteQuery("buildId") as unknown as Ref<string>;
const type = ref(undefined);
const typeOptions = [
  { label: "未住满", value: "1" },
  { label: "文明宿舍", value: "2" },
  { label: "已住满", value: "3" },
  { label: "单人间", value: "4" },
  { label: "双人间", value: "5" },
];

const floorId = ref<number | undefined>();
const roomId = ref("");
const roomList = ref<{ id: string; name: string }[]>([]);

const { execute, state } = useAsyncState(async () => {
  const [err, res] = await to(getBuildRoomTable(buildId.value, type.value));
  if (err) return [];
  return (res?.resultData || []).sort((a, b) => Number(b.lc) - Number(a.lc));
}, [], {
  immediate: false,
  resetOnExecute: false,
  onSuccess() {
    const firstFloor = state.value[0];
    if (!firstFloor) return;
    floorId.value = firstFloor.lc;
    roomList.value = firstFloor.children.map((item: any) => ({ id: item.id, name: item.name }));
  },
});

const floorList = computed(() => {
  return state.value.map(({ lc, children }) => {
    return {
      id: lc,
      name: `${lc}F`,
      children: children.map((item: any) => ({
        id: item.id,
        name: item.name,
      })),
    };
  });
});

// 楼层点击
function handleFloorClick(_floorId: number, _roomList: any[]) {
  floorId.value = _floorId;
  roomList.value = _roomList;
  dormitoryAreaOneBuildLayer.splitBuild(buildId.value, _floorId.toString());
}

async function handleRoomClick(item: any) {
  visible.value = false;
  router.push({
    path: "/lifeServices/cubicles",
    query: {
      campusId: campusId.value,
      dormitoryAreaId: dormitoryAreaId.value,
      buildId: buildId.value,
      roomId: item.id,
    },
  });
}

watch(
  () => buildId.value,
  () => {
    if (!buildId.value) return;
    execute();
  },
  { immediate: true },
);

const floorContainer = useTemplateRef<HTMLElement>("floorContainer");
function scrollFloor(type: "left" | "right") {
  if (!floorContainer.value) return;
  const currentScrollLeft = floorContainer.value.scrollLeft;
  const offset = type === "left" ? -38 : 38;
  floorContainer.value.scrollBy({
    left: currentScrollLeft + offset,
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="real-estate-table-popup-container">
    <DragPopup v-model:visible="visible" :title="$t('dormitory.build.floorTables')" :width="345" :top="120" :left="380">
      <div>
        <ASelect
          v-model:value="type" placeholder="请选择" :options="typeOptions" class="!w-full"
          allow-clear
          @change="() => execute()" />
      </div>
      <div>
        <div class="floor-box my-2 flex">
          <button class="shrink-0 bg-transparent" @click="scrollFloor('left')">
            <img src="@/assets/images_new/arrow.png" alt="arrow" class="h-[30px]">
          </button>
          <ul ref="floorContainer" class="floor mx-2 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide space-x-[8px]">
            <li
              v-for="floor in floorList" :key="floor.id"
              class="size-[30px] inline-flex items-center justify-center text-[12px] font-number"
              :class="floorId === floor.id && 'active'"
              @click="handleFloorClick(floor.id, floor.children)">
              {{ floor.name }}
            </li>
          </ul>
          <button class="shrink-0 bg-transparent" @click="scrollFloor('right')">
            <img src="@/assets/images_new/arrow.png" alt="arrow" class="h-[30px] rotate-180">
          </button>
        </div>
        <div class="room-box">
          <ul class="flex flex-wrap gap-y-2 -mx-1">
            <li v-for="room in roomList" :key="room.id" class="w-1/4 px-1">
              <button
                type="button"
                :class="cn(
                  'w-full border border-[#9E9E9E] rounded text-[14px] bg-transparent py-1 text-white',
                  'hover:border-[#CC1A1A] hover:font-number hover:bg-gradient-to-b hover:from-[#DC2F2F]/25 hover:to-[#DC2F2F]/0  hover:via-[#DC2F2F]/75',
                )"
                @click="handleRoomClick(room)">
                {{ room.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </DragPopup>
  </div>
</template>

<style scoped lang="scss">
.floor-box {
  ul {
    li {
      background: url("@/assets/images_new/rect.png") no-repeat center / 30px 30px;
      &.active,
      &:hover {
        background: url("@/assets/images_new/rect-active.png") no-repeat center / 30px 30px;
      }
    }
  }
}
</style>
