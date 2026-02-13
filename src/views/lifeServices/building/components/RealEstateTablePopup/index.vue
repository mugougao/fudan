<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { getBuildRoomTable } from "@/api/lifeServices";
import { CampusId } from "@/enums";
import { cn } from "@/utils";
import { getBuildingUuidByNumericId } from "@/utils/buildingMapping";
import buildingFloorTableHelper from "@/utils/buildingFloorTableHelper";
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

// 从本地楼层表生成数据
function generateFloorTableFromLocal(buildingUuid: string) {
  console.log("🏢 [楼盘表] 使用本地楼层表数据:", { buildingUuid });
  
  const building = buildingFloorTableHelper.getBuildingFloorTable(buildingUuid);
  if (!building) {
    console.warn("⚠️ [楼盘表] 本地楼层表无数据:", { buildingUuid });
    return [];
  }

  console.log("✅ [楼盘表] 本地楼层表数据获取成功:", {
    楼栋名称: building.buildingName,
    总楼层数: building.totalFloors,
    总房间数: buildingFloorTableHelper.getTotalRoomCount(buildingUuid),
  });

  // 转换为组件需要的格式
  return building.floors
    .map(floor => {
      const floorNum = floor.floorNum;
      const roomCount = floor.roomCount;
      
      // 生成房间号：如 101, 102, ..., 201, 202, ...
      // 如果房间数超过9个，使用两位数：101, 102, ..., 110, 111
      const children = floor.rooms.map((room, index) => {
        const roomIndex = index + 1;
        let roomName: string;
        
        if (roomCount <= 9) {
          // 房间数少于等于9个：101-109
          roomName = `${floorNum}0${roomIndex}`;
        } else if (roomCount <= 99) {
          // 房间数10-99个：101-199
          roomName = `${floorNum}${roomIndex.toString().padStart(2, "0")}`;
        } else {
          // 房间数超过99个：1001-1999
          roomName = `${floorNum}${roomIndex.toString().padStart(3, "0")}`;
        }
        
        return {
          id: room.id,
          name: roomName,
        };
      });

      return {
        lc: floorNum,
        children,
      };
    })
    .sort((a, b) => Number(b.lc) - Number(a.lc)); // 从高到低排序
}

const { execute, state } = useAsyncState(async () => {
  console.log("🏢 [楼盘表] 🚫 API调用已注释，直接使用本地楼层表数据");

  const buildingUuid = getBuildingUuidByNumericId(buildId.value);
  if (!buildingUuid) {
    console.warn("⚠️ [楼盘表] UUID映射失败");
    return [];
  }

  // 🚫 注释掉API调用，直接使用本地数据
  const localData = generateFloorTableFromLocal(buildingUuid);
  console.log("✅ [楼盘表] 本地数据加载完成，楼层数:", localData.length);
  return localData;

  /* // 原API调用逻辑已注释
  console.log("🏢 [楼盘表] 调用API获取楼盘表数据...");
  const [err, res] = await to(getBuildRoomTable(buildingUuid, type.value));
  
  if (err) {
    console.warn("⚠️ [楼盘表] API获取失败，使用本地楼层表数据:", err);
    return generateFloorTableFromLocal(buildingUuid);
  }

  const resultData = res?.resultData;
  if (!resultData || resultData.length === 0) {
    console.warn("⚠️ [楼盘表] API返回数据为空，使用本地楼层表数据");
    return generateFloorTableFromLocal(buildingUuid);
  }

  console.log("✅ [楼盘表] API数据获取成功:", {
    楼层数: resultData.length,
  });

  return resultData.sort((a, b) => Number(b.lc) - Number(a.lc));
  */
}, [], {
  immediate: true,
  resetOnExecute: false,
  onSuccess() {
    console.log("🏢 [楼盘表] 数据加载成功，楼层数:", state.value.length);
    const firstFloor = state.value[0];
    if (!firstFloor) {
      console.warn("⚠️ [楼盘表] 无楼层数据");
      return;
    }
    floorId.value = firstFloor.lc;
    roomList.value = firstFloor.children.map((item: any) => ({ id: item.id, name: item.name }));
    console.log("🏢 [楼盘表] 默认选中楼层:", {
      楼层: floorId.value,
      房间数: roomList.value.length,
    });
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
  console.log("🏢 [楼盘表] 切换楼层:", {
    楼层: _floorId,
    房间数: _roomList.length,
  });
  floorId.value = _floorId;
  roomList.value = _roomList;
  dormitoryAreaOneBuildLayer.splitBuild(buildId.value, _floorId.toString());
}

async function handleRoomClick(item: any) {
  console.log("🏢 [楼盘表] 点击房间:", {
    房间名称: item.name,
    房间ID: item.id,
  });
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

// 🚫 注释掉自动加载逻辑，数据已在 useAsyncState 中初始化
/*
watch(
  () => buildId.value,
  () => {
    if (!buildId.value) return;
    execute();
  },
  { immediate: true },
);
*/

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
          allow-clear />
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
