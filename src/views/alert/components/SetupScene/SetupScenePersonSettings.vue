<script setup lang="ts">
import type { EChartsOption } from "echarts";
import RoundSlider from "vue-three-round-slider";

defineOptions({ name: "SetupScenePersonSettings", inheritAttrs: false });

const type = ref("random");

const data = ref({
  total: 1080,
  // 人员饱和度
  staffSaturation: 40,
  // 学生占比
  teachersRatio: 50,
  // 男学生占比
  maleStudentsRatio: 50,
  // 男教师占比
  maleTeachersRatio: 50,
});

// 学生 / 教师
const staffRatio = computed(() => ({
  students: 100 - data.value.teachersRatio,
  teachers: data.value.teachersRatio,
}));

// 男 / 女 学生
const studentsRatio = computed(() => ({
  male: data.value.maleStudentsRatio,
  female: 100 - data.value.maleStudentsRatio,
}));

// 男 / 女 教师
const teachersRatio = computed(() => ({
  male: data.value.maleTeachersRatio,
  female: 100 - data.value.maleTeachersRatio,
}));

const option = computed(() => {
  const seriesData = [
    { value: staffRatio.value.teachers, name: "教师", itemStyle: { color: "#D45F5F" } },
    { value: staffRatio.value.students, name: "学生", itemStyle: { color: "#FFFFFF" } },
  ];

  return {
    title: [{
      text: "{text|人员数量}",
      top: "50%",
      left: "50%",
      textStyle: {
        rich: {
          text: {
            color: "#FFFFFF",
            fontSize: 14,
            fontFamily: "AlibabaPuHuiTi-3",
            align: "center",
            padding: [0, 10, 0, 0],
          },
        },
      },
    }],
    series: [
      {
        type: "pie",
        clockwise: true,
        radius: [45, 48],
        center: ["50%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        data: seriesData,
        z: 2,
      },
      {
        type: "pie",
        clockwise: true,
        radius: [38, 48],
        center: ["50%", "50%"],
        itemStyle: { opacity: 0.2 },
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        data: seriesData,
        z: 1,
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="setup-scene-person-settings h-full flex flex-col gap-y-2">
    <UiSkewSegmented v-model="type" class="mx-auto" :options="[{ label: '随机生成', value: 'random' }, { label: '同步实时状态', value: 'realTime' }]" />

    <div class="flex items-center">
      <img src="@/assets/images_new/user-icon.png" alt="icon" class="size-[54px]">
      <div class="mx-2 flex-auto">
        <div class="relative mr-2 flex items-center justify-between border-b border-white px-2">
          <span class="text-[16px]">人员饱和度</span>
          <span class="text-[12px]"><span class="text-[20px] font-number">{{ data.staffSaturation }}</span>%</span>
          <span class="absolute bottom-[-3px] right-[-6px] inline-block size-[6px] rotate-45 border border-[#EABC8B]" />
        </div>
        <div class="-mt-2">
          <UiSliderSkew v-model="data.staffSaturation" :max="100" />
        </div>
      </div>
    </div>

    <UiSubTitle title="人员类型分布" />

    <div class="personnel-type-distribution h-[140px] flex items-center px-2 py-8">
      <div class="h-full flex flex-col flex-1 justify-between leading-none">
        <span class="flex items-center">
          <span class="mr-2 block size-[5px] bg-white" />
          <span class="flex items-center text-[14px]">学生 <span class="ml-2 mr-0.5 text-[20px] font-number">{{ staffRatio.students }}</span><span class="text-[12px] text-white/80">%</span></span>
        </span>
        <span class="flex flex-col">
          <span class="flex items-center justify-between text-[14px] font-number">
            <span>{{ studentsRatio.male }}<span class="text-[12px] text-white/80">%</span></span>
            <span>{{ studentsRatio.female }}<span class="text-[12px] text-white/80">%</span></span>
          </span>
          <span class="-mx-1">
            <UiSlider v-model="data.maleStudentsRatio" :min="0" :max="100" />
          </span>
          <span class="flex items-center justify-between text-[12px] text-white/80">
            <span>男学生</span>
            <span>女学生</span>
          </span>
        </span>
      </div>
      <div class="relative mx-3.5 size-[100px]">
        <RenderEchart :option="option" />
        <div class="absolute inset-0 h-full w-full">
          <RoundSlider
            v-model="data.teachersRatio" :max="100" :radius="50" :width="10" :start-angle="90"
            path-color="rgba(0,0,0,0)" range-color="rgba(0,0,0,0)" :show-tooltip="false" />
        </div>
        <input v-model="data.total" class="absolute left-1/2 top-[40px] z-[999] w-[70px] bg-transparent text-center text-[20px] leading-none font-number -translate-1/2" type="number">
      </div>
      <div class="h-full flex flex-col flex-1 justify-between leading-none">
        <span class="flex items-center">
          <span class="mr-2 block size-[5px] bg-[#D45F5F]" />
          <span class="flex items-center text-[14px]">教师 <span class="ml-2 mr-0.5 bg-transparent from-red to-white bg-gradient-to-b bg-clip-text text-[20px] text-transparent font-number">{{ staffRatio.teachers }}</span><span class="text-[12px] text-white/80">%</span></span>
        </span>
        <span class="flex flex-col">
          <span class="flex items-center justify-between text-[14px] font-number">
            <span>{{ teachersRatio.male }}<span class="text-[12px] text-white/80">%</span></span>
            <span>{{ teachersRatio.female }}<span class="text-[12px] text-white/80">%</span></span>
          </span>
          <span class="-mx-1">
            <UiSlider v-model="data.maleTeachersRatio" :min="0" :max="100" />
          </span>
          <span class="flex items-center justify-between text-[12px] text-white/80">
            <span>男教师</span>
            <span>女教师</span>
          </span>
        </span>
      </div>
    </div>

    <div class="flex items-center justify-center gap-3">
      <button
        type="button"
        class="relative flex items-center justify-center gap-2 border border-white bg-transparent from-white/20 via-white/75 to-transparent via-75% px-4 py-0.5 text-[14px] !bg-gradient-to-b">
        <span class="absolute left-[-3px] top-1/2 inline-block size-[4px] bg-white -translate-y-1/2" />
        <span class="absolute right-[-2px] top-1/2 inline-block size-[4px] bg-white -translate-y-1/2" />
        <i class="i-ri-checkbox-circle-line" /> 生成
      </button>
      <button
        type="button"
        class="relative flex items-center justify-center gap-2 border border-[#CC1A1A] bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% px-4 py-0.5 text-[14px] !bg-gradient-to-b">
        <span class="absolute left-[-3px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
        <span class="absolute right-[-2px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
        <i class="i-ri-loop-right-line" /> 重置
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.personnel-type-distribution {
  background: url("@/assets/images_new/chart-bg-5.png") no-repeat center;
  background-size: contain;
}
</style>
