<script setup lang="tsx">
import type { Ref } from "vue";
import type { IGetClassroomDetailPanelResult } from "@/api/smartTeaching";
import { useRouteQuery } from "@vueuse/router";
import get from "lodash/get";
import VideoHlsPlayer from "@/components/VideoHlsPlayer/index.vue";

// 楼层房间
const roomId = useRouteQuery<string>("roomId", "") as unknown as Ref<string>;

const { state, execute } = useAsyncState<IGetClassroomDetailPanelResult>(
  async () => {
    if (!roomId.value) return {} as IGetClassroomDetailPanelResult;

    // 硬编码教室详情数据
    const classroomDetailData: Record<string, IGetClassroomDetailPanelResult> = {
      "101_1": {
        jsxx: {
          sklx: "理论课",
          kcdl: "CS101",
          skjs: "张教授",
          kcmc: "计算机科学导论",
          skrs: "45",
        },
        jszt: "在用",
        jsbh: "101",
        jsfmd: 85,
      },
      "102_1": {
        jsxx: {
          sklx: "实验课",
          kcdl: "PHY201",
          skjs: "李教授",
          kcmc: "物理实验",
          skrs: "30",
        },
        jszt: "在用",
        jsbh: "102",
        jsfmd: 72,
      },
      "103_1": {
        jsxx: {
          sklx: "讨论课",
          kcdl: "MATH301",
          skjs: "王教授",
          kcmc: "高等数学讨论",
          skrs: "25",
        },
        jszt: "未用",
        jsbh: "103",
        jsfmd: 35,
      },
      "201_2": {
        jsxx: {
          sklx: "理论课",
          kcdl: "ENG101",
          skjs: "赵教授",
          kcmc: "英语写作",
          skrs: "50",
        },
        jszt: "在用",
        jsbh: "201",
        jsfmd: 90,
      },
      "202_2": {
        jsxx: {
          sklx: "实验课",
          kcdl: "CHEM202",
          skjs: "刘教授",
          kcmc: "化学实验",
          skrs: "28",
        },
        jszt: "在用",
        jsbh: "202",
        jsfmd: 78,
      },
      "301_3": {
        jsxx: {
          sklx: "理论课",
          kcdl: "BIO101",
          skjs: "陈教授",
          kcmc: "生物学导论",
          skrs: "55",
        },
        jszt: "在用",
        jsbh: "301",
        jsfmd: 82,
      },
      "401_4": {
        jsxx: {
          sklx: "讨论课",
          kcdl: "ECON201",
          skjs: "孙教授",
          kcmc: "经济学原理",
          skrs: "35",
        },
        jszt: "在用",
        jsbh: "401",
        jsfmd: 65,
      },
      "501_5": {
        jsxx: {
          sklx: "理论课",
          kcdl: "HIST101",
          skjs: "周教授",
          kcmc: "中国历史",
          skrs: "60",
        },
        jszt: "在用",
        jsbh: "501",
        jsfmd: 88,
      },
      "587": { // 特殊教室，有视频流
        jsxx: {
          sklx: "多媒体课",
          kcdl: "MEDIA301",
          skjs: "吴教授",
          kcmc: "多媒体技术",
          skrs: "40",
        },
        jszt: "在用",
        jsbh: "587",
        jsfmd: 95,
      },
    };

    // 返回对应教室的数据，如果没有则返回默认数据
    return classroomDetailData[roomId.value] || {
      jsxx: {
        sklx: "理论课",
        kcdl: "DEFAULT101",
        skjs: "默认教师",
        kcmc: "默认课程",
        skrs: "30",
      },
      jszt: "在用",
      jsbh: roomId.value,
      jsfmd: 70,
    };

    // 注释掉原来的API调用
    // const [err, res] = await to(getClassroomDetailPanel(roomId.value));
    // if (err) return {} as IGetClassroomDetailPanelResult;
    // return res?.resultData || {} as IGetClassroomDetailPanelResult;
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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat center center / 1px 30px;
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
