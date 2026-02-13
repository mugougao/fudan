<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import get from "lodash/get";
import { type Ref, watch } from "vue";
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
  if (!buildId.value) return {};

  // 硬编码楼栋课程统计数据
  const buildingCourseStats: Record<string, any> = {
    141: { // H6教学楼
      kcfb: [
        { name: "理论课", value: 65 },
        { name: "实验课", value: 25 },
        { name: "讨论课", value: 10 },
      ],
      ksfb: [
        { name: "1-2节", value: 30 },
        { name: "3-4节", value: 40 },
        { name: "5-6节", value: 20 },
        { name: "7-8节", value: 10 },
      ],
      kczs: 120,
      jszs: 45,
      sybl: 78.5,
    },
    140: { // H5教学楼
      kcfb: [
        { name: "理论课", value: 70 },
        { name: "实验课", value: 20 },
        { name: "讨论课", value: 10 },
      ],
      ksfb: [
        { name: "1-2节", value: 35 },
        { name: "3-4节", value: 35 },
        { name: "5-6节", value: 20 },
        { name: "7-8节", value: 10 },
      ],
      kczs: 95,
      jszs: 38,
      sybl: 72.3,
    },
    144: { // JB教学楼
      kcfb: [
        { name: "理论课", value: 60 },
        { name: "实验课", value: 30 },
        { name: "讨论课", value: 10 },
      ],
      ksfb: [
        { name: "1-2节", value: 25 },
        { name: "3-4节", value: 35 },
        { name: "5-6节", value: 25 },
        { name: "7-8节", value: 15 },
      ],
      kczs: 80,
      jszs: 32,
      sybl: 65.8,
    },
  };

  // 返回对应楼栋的数据，如果没有则返回默认数据
  return buildingCourseStats[buildId.value] || {
    kcfb: [
      { name: "理论课", value: 60 },
      { name: "实验课", value: 30 },
      { name: "讨论课", value: 10 },
    ],
    ksfb: [
      { name: "1-2节", value: 30 },
      { name: "3-4节", value: 35 },
      { name: "5-6节", value: 25 },
      { name: "7-8节", value: 10 },
    ],
    kczs: 100,
    jszs: 40,
    sybl: 70.0,
  };

  // 注释掉原来的API调用
  // const [err, res] = await to(getBuildingCourseStatistics(buildId.value));
  // if (err) return {};
  // return res?.resultData || {};
}, {}, { immediate: false, resetOnExecute: false });

const { state: classList, execute: executeClassList } = useAsyncState<{ lc: number;children: { name: string; id: string; type: string }[] }[]>(
  async () => {
    if (!buildId.value) return [];

    // 硬编码楼栋教室数据
    const buildingClassroomData: Record<string, { lc: number; children: { name: string; id: string; type: string }[] }[]> = {
      141: [ // H6教学楼，6层
        { lc: 1, children: [
          { name: "101", id: "101_1", type: "1" },
          { name: "102", id: "102_1", type: "1" },
          { name: "103", id: "103_1", type: "0" },
          { name: "104", id: "104_1", type: "1" },
          { name: "105", id: "105_1", type: "1" },
          { name: "106", id: "106_1", type: "0" },
        ] },
        { lc: 2, children: [
          { name: "201", id: "201_2", type: "1" },
          { name: "202", id: "202_2", type: "1" },
          { name: "203", id: "203_2", type: "1" },
          { name: "204", id: "204_2", type: "0" },
          { name: "205", id: "205_2", type: "1" },
          { name: "206", id: "206_2", type: "1" },
        ] },
        { lc: 3, children: [
          { name: "301", id: "301_3", type: "1" },
          { name: "302", id: "302_3", type: "1" },
          { name: "303", id: "303_3", type: "1" },
          { name: "304", id: "304_3", type: "1" },
          { name: "305", id: "305_3", type: "0" },
          { name: "306", id: "306_3", type: "1" },
        ] },
        { lc: 4, children: [
          { name: "401", id: "401_4", type: "1" },
          { name: "402", id: "402_4", type: "1" },
          { name: "403", id: "403_4", type: "1" },
          { name: "404", id: "404_4", type: "0" },
          { name: "405", id: "405_4", type: "1" },
          { name: "406", id: "406_4", type: "1" },
        ] },
        { lc: 5, children: [
          { name: "501", id: "501_5", type: "1" },
          { name: "502", id: "502_5", type: "1" },
          { name: "503", id: "503_5", type: "1" },
          { name: "504", id: "504_5", type: "1" },
          { name: "505", id: "505_5", type: "1" },
          { name: "506", id: "506_5", type: "0" },
        ] },
        { lc: 6, children: [
          { name: "601", id: "601_6", type: "1" },
          { name: "602", id: "602_6", type: "1" },
          { name: "603", id: "603_6", type: "1" },
          { name: "604", id: "604_6", type: "1" },
          { name: "605", id: "605_6", type: "1" },
          { name: "606", id: "606_6", type: "1" },
        ] },
      ],
      140: [ // H5教学楼，5层
        { lc: 1, children: [
          { name: "101", id: "101_1_h5", type: "1" },
          { name: "102", id: "102_1_h5", type: "1" },
          { name: "103", id: "103_1_h5", type: "0" },
          { name: "104", id: "104_1_h5", type: "1" },
          { name: "105", id: "105_1_h5", type: "1" },
        ] },
        { lc: 2, children: [
          { name: "201", id: "201_2_h5", type: "1" },
          { name: "202", id: "202_2_h5", type: "1" },
          { name: "203", id: "203_2_h5", type: "1" },
          { name: "204", id: "204_2_h5", type: "0" },
          { name: "205", id: "205_2_h5", type: "1" },
        ] },
        { lc: 3, children: [
          { name: "301", id: "301_3_h5", type: "1" },
          { name: "302", id: "302_3_h5", type: "1" },
          { name: "303", id: "303_3_h5", type: "1" },
          { name: "304", id: "304_3_h5", type: "1" },
          { name: "305", id: "305_3_h5", type: "0" },
        ] },
        { lc: 4, children: [
          { name: "401", id: "401_4_h5", type: "1" },
          { name: "402", id: "402_4_h5", type: "1" },
          { name: "403", id: "403_4_h5", type: "1" },
          { name: "404", id: "404_4_h5", type: "0" },
          { name: "405", id: "405_4_h5", type: "1" },
        ] },
        { lc: 5, children: [
          { name: "501", id: "501_5_h5", type: "1" },
          { name: "502", id: "502_5_h5", type: "1" },
          { name: "503", id: "503_5_h5", type: "1" },
          { name: "504", id: "504_5_h5", type: "1" },
          { name: "505", id: "505_5_h5", type: "1" },
        ] },
      ],
    };

    // 返回对应楼栋的数据，如果没有则返回默认数据
    const data = buildingClassroomData[buildId.value] || [
      { lc: 1, children: [
        { name: "101", id: "101_1_default", type: "1" },
        { name: "102", id: "102_1_default", type: "1" },
        { name: "103", id: "103_1_default", type: "0" },
      ] },
      { lc: 2, children: [
        { name: "201", id: "201_2_default", type: "1" },
        { name: "202", id: "202_2_default", type: "1" },
        { name: "203", id: "203_2_default", type: "1" },
      ] },
    ];

    return data.sort((a, b) => a.lc - b.lc);

    // 注释掉原来的API调用
    // const [err, res] = await to(getBuildingClassroomTable(buildId.value));
    // if (err) return [];
    // return (res?.resultData || []).sort((a, b) => a.lc - b.lc);
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
  // 从复合ID中提取纯房间号（例如从"101_1"中提取"101"）
  const pureRoomId = _roomId.split("_")[0];
  emit("roomClick", _floorId, pureRoomId);
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
