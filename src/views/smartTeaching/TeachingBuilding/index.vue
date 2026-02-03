<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import get from "lodash/get";
import { type Ref, watch } from "vue";
import { getBuildingClassroomTable, getBuildingCourseStatistics } from "@/api/smartTeaching";
import { cn } from "@/utils";
import CourseTypeDistribution from "./components/CourseTypeDistribution/index.vue";

const emit = defineEmits<{
  floorClick: [floor: number];
  roomClick: [floorId: number, roomId: string];
}>();

// 当前楼栋
const buildId = useRouteQuery<string>("buildId", "") as unknown as Ref<string>;
// 当前楼层
const floorId = useRouteQuery<string>("floorId", "") as unknown as Ref<string>;
// 楼层房间
const roomId = useRouteQuery<string>("roomId", "") as unknown as Ref<string>;

// 教室繁忙度排行弹窗
const realEstateTableVisible = defineModel("realEstateTableVisible", { default: false });

const { state, execute } = useAsyncState(async () => {
  if (!buildId.value) return;
  const [err, res] = await to(getBuildingCourseStatistics(buildId.value));
  if (err) return {};
  return res?.resultData || {};
}, {}, { immediate: false, resetOnExecute: false });

const { state: classList, execute: executeClassList } = useAsyncState<{ lc: number;children: { name: string; id: string; type: string }[] }[]>(
  async () => {
    if (!buildId.value) return [];
    const [err, res] = await to(getBuildingClassroomTable(buildId.value));
    if (err) return [];
    return (res?.resultData || []).sort((a, b) => a.lc - b.lc);
  },
  [],
  { immediate: false, resetOnExecute: false },
);

const floorRoomList = computed(() => {
  if (!floorId.value) return [];
  return classList.value.find(item => item.lc === Number(floorId.value))?.children || [];
});

watch(buildId, (val) => {
  if (!val) return;
  execute();
  executeClassList();
}, { immediate: true });

// 教室统计
const classCountColumns = [
  { title: "smartsTeaching.roomTotal", field: "jszs", suffix: "间", icon: "i-svg-icon-raw-podium", tipText: "" },
  { title: "smartsTeaching.useScales", field: "sybl", suffix: "%", icon: "i-svg-icon-raw-pie", tipText: "当前使用率=当前正在上课的教室数量/教学楼教室总数" },
];

// 楼层点击
function handleFloorClick(_floorId: number) {
  floorId.value = _floorId.toString();
  emit("floorClick", _floorId);
}

// 教室点击
function handleFloorRoomClick(_floorId: number, _roomId: string) {
  floorId.value = _floorId.toString();
  roomId.value = _roomId;
  emit("roomClick", _floorId, _roomId);
}

defineExpose({
  clearActiveFloor: () => {
    floorId.value = "";
  },
});
</script>

<template>
  <UiBoxPanel
    class="row-span-16"
    title-path="smartsTeaching.buildOverview"
    content-class-name="grid grid-cols-1 grid-rows-12">
    <template #titleSuffix>
      <UiSelectBtn v-model="realEstateTableVisible">
        {{ $t('smartsTeaching.busyDay') }}
        <HelpTipIcon>
          <template #default>
            <div class="flex items-center whitespace-nowrap">
              <span> 教室当天繁忙度 </span>
              <span class="mx-1"> = </span>
              <span class="w-[200px] flex flex-col text-center">
                <span class="block border-b border-white">当天该教室已排课的节数</span>
                <span>14(一天最多排14节课)</span>
              </span>
            </div>
          </template>
          <template #trigger>
            <i class="i-ri-question-line text-[#B4B4B4]" />
          </template>
        </HelpTipIcon>
      </UiSelectBtn>
    </template>

    <div class="count-box row-span-2 flex items-center justify-between">
      <UiCountItem
        v-for="({ title, field, suffix, icon, tipText }, index) in classCountColumns" :key="field"
        class="flex-1"
        :icon="icon" :name="$t(title)" :value="get(state, field)" :unit="suffix" :type="index % 2 ? 'yellow' : 'red'"
        :tip-text="tipText" />
    </div>

    <CourseTypeDistribution :lessons-data="state.kcfb || []" :class-time-data="state.ksfb || []" :class-time-total="state.kczs || 0" />

    <div class="build-room-box row-span-5">
      <ul class="build-room-box-floor text-center">
        <li
          v-for="({ lc }) in classList" :key="lc"
          class="inline-block w-[50px] cursor-pointer text-center"
          :class="Number(floorId) === lc && 'active'"
          @click="handleFloorClick(lc)">
          <span>{{ lc }}F</span>
        </li>
      </ul>
      <ul v-if="floorId && floorRoomList.length" class="build-room-box-room mt-3 h-[140px] flex flex-wrap gap-y-2 overflow-y-auto px-2">
        <li
          v-for="({ id, name, type }) in floorRoomList" :key="id"
          :title="`${name}:${type === '1' ? '在用' : '未用'}`"
          class="w-1/3 px-1"
          @click="handleFloorRoomClick(Number(floorId), id)">
          <span
            :class="cn(
              'cursor-pointer border flex items-center justify-center border  rounded-[2px] font-number text-white text-[16px]',
              roomId === id
                ? 'border-[#CC1A1A] bg-gradient-to-t from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-transparent to-150%'
                : type === '1' ? 'border-[#F7C998] bg-gradient-to-t from-[#F7C998]/20 via-[#F7C998]/75 to-transparent to-150%' : 'border-[#9E9E9E]',
            )">{{ name }}</span>
        </li>
      </ul>
      <div v-else-if="floorId && !floorRoomList.length" class="h-[140px]">
        <EmptyWrapper :is-empty="true" description="暂无房间" size="" />
      </div>
      <div v-else class="mx-5 mt-5 border border-[#CC1A1A] rounded bg-[#CC1A1A]/30 py-1 text-center text-[14px]">
        请选择楼层
      </div>
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count-box {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat 47% center / 1px 30px;
}

.build-room-box {
  // floor-bg
  .build-room-box-floor {
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    background: url("@/assets/images_new/floor-bg-mini.png") no-repeat center / 310px 36px;
    li {
      color: rgba(#ffffff, 0.6);
      font-size: 16px;

      &.active {
        color: #ffffff;
        position: relative;
        &:before,
        &::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
        }
        &:before {
          width: 30px;
          height: 5px;
          background-color: red;
          filter: blur(5px);
        }
        &::after {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 4px 4px 4px;
          border-color: transparent transparent#fff transparent;
        }
      }
    }
  }
}
</style>
