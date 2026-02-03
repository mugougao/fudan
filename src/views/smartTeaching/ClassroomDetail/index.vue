<script setup lang="tsx">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import get from "lodash/get";
import { getClassroomDetailPanel, type IGetClassroomDetailPanelResult } from "@/api/smartTeaching";
import VideoHlsPlayer from "@/components/VideoHlsPlayer/index.vue";

// 楼层房间
const roomId = useRouteQuery<string>("roomId", "") as unknown as Ref<string>;

const { state, execute } = useAsyncState<IGetClassroomDetailPanelResult>(
  async () => {
    if (!roomId.value) return {} as IGetClassroomDetailPanelResult;
    const [err, res] = await to(getClassroomDetailPanel(roomId.value));
    if (err) return {} as IGetClassroomDetailPanelResult;
    return res?.resultData || {} as IGetClassroomDetailPanelResult;
  },
  {} as IGetClassroomDetailPanelResult,
  { immediate: false, resetOnExecute: false },
);
watch(roomId, val => val && execute(), { immediate: true });

const roomInfoColumns = [
  { title: "smartsTeaching.classroomNumber", field: "jsbh", icon: "i-svg-icon-raw-no" },
  { title: "smartsTeaching.classroomStatus", field: "jszt", icon: "i-svg-icon-raw-card" },
];

// 课程信息
const courseInfoColumns = [
  { title: "smartsTeaching.courseName", field: "jsxx.kcmc" },
  { title: "smartsTeaching.courseCode", field: "jsxx.kcdl" },
  { title: "smartsTeaching.teacher", field: "jsxx.skjs" },
  { title: "smartsTeaching.classSize", field: "jsxx.skrs", suffix: "人" },
];

const labelCardTexts = computed(() => {
  const value = state.value?.jsxx?.sklx;
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value;
  return [];
});
</script>

<template>
  <UiBoxPanel
    class="row-span-21"
    title-path="smartsTeaching.classroomDetails"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <div class="count-box row-span-8">
      <div class="mb-3 h-[130px] flex flex-col items-center">
        <span class="mt-3 text-[22px] font-number">
          <span class="empty-number">{{ state.jsfmd }}</span>
          <span>%</span>
        </span>
        <span class="mb-2 mt-auto text-[14px] text-white/80">{{ $t('smartsTeaching.classroomBusyness') }}</span>
      </div>

      <div class="count flex justify-between">
        <UiCountItem
          v-for="({ title, field, icon }, index) in roomInfoColumns" :key="field"
          class="flex-1"
          :icon="icon" :name="$t(title)" :value="get(state, field, '--')" :type="index % 2 ? 'yellow' : 'red'" />
      </div>
    </div>

    <div class="row-span-16">
      <UiSubTitle title-path="smartsTeaching.courseInformation" />
      <div class="content">
        <div class="video-box mt-2 h-[177px] w-[315px] p-2">
          <div class="h-full w-full">
            <VideoHlsPlayer v-if="roomId === '587'" url="https://dt2.fudan.edu.cn/hlsData/stream.m3u8" />
            <img v-else class="wh-full" src="@/assets/images_new/room.jpg" alt="img">
          </div>
        </div>
        <ul v-if="labelCardTexts.length" class="label-card-text-list mt-2">
          <li v-for="text in labelCardTexts" :key="text" class="size-[38px] flex items-center justify-center">
            <span class="mb-2 from-[#FFC2C2] to-white bg-gradient-to-b bg-clip-text text-transparent font-number">{{ text }}</span>
          </li>
        </ul>
        <div class="mt-2 space-y-1">
          <div
            v-for="(col, index) in courseInfoColumns" :key="col.field"
            class="room-list-item flex items-center px-2 text-[14px] font-number">
            <span class="w-[80px]">{{ $t(col.title) }}</span>
            <span class="w-[calc(100%-80px)] text-center">
              <span :class="[index === courseInfoColumns.length - 1 ? 'empty-number' : 'empty-text']">{{ get(state, col.field) }}</span>
              <span v-if="col.suffix">{{ col.suffix }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </UiBoxpanel>
</template>

<style scoped>
.count-box {
  background: url("@/assets/images_new/value-bg3.png") no-repeat center top / 142px 100px;
  .count {
    background:
      linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat center center / 1px 30px;
  }
}
.content {
  .video-box {
    background: url("@/assets/images_new/video-bg.png");
  }
  .room-list-item {
    height: 40px;
    background: url("@/assets/images_new/row-bg.png") no-repeat left top / 100% 100%;
  }
  .label-card-text-list {
    li {
      background: url("@/assets/images_new/label-bg.png") no-repeat -9px 0px / 53px 44px;
    }
  }
}
</style>
