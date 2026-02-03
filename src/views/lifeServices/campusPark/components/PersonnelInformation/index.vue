<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useI18n } from "vue-i18n";
import { largestRemainderMethod, numberToThousands } from "@/utils";
import PersonnelInformationOccupancyTop from "@/views/lifeServices/campusPark/components/PersonnelInformationOccupancyTop/index.vue";

const props = defineProps<{
  total: number;
  educationData: { name: string;value: number }[];
  sexData: { name: string;value: number }[];
  departmentData: { name: string;value: number }[];
  timeData: { name: string;value: number }[];
}>();

const sexDataFormat = computed(() => {
  const data = largestRemainderMethod(props.sexData);
  const man = data.find(item => item.name.includes("男"));
  const woman = data.find(item => item.name.includes("女"));
  return {
    man: man?.value ?? 0,
    woman: woman?.value ?? 0,
    manPercent: man?.percent ?? 0,
    womanPercent: woman?.percent ?? 0,
  };
});

const option = computed(() => {
  return {
    color: ["#D45F5F", "#F7C998", "#778BF1"],
    tooltip: {
      trigger: "item",
      valueFormatter: value => `${value}人`,
    },
    legend: { top: 0, right: 0 },
    title: [
      {
        text: `{text|总入住人数}`,
        left: 55,
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "AlibabaPuHuiTi-3-medium",
              align: "center",
              padding: [40, 0, 0, 0],
            },
          },
        },
      },
      {
        text: `{text|(人)}`,
        left: 55,
        top: "middle",
        textStyle: {
          rich: {
            text: {
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              align: "center",
              padding: [10, 0, 0, 0],
            },
          },
        },
      },
      {
        text: `{text|${numberToThousands(props.total ?? 0)}}`,
        left: 55,
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 22,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "D-DIN",
              align: "center",
              padding: [0, 0, 30, 0],
            },
          },
        },
      },
    ],
    series: [
      {
        name: "",
        type: "pie",
        center: [60, "50%"],
        radius: [49, 52],
        padAngle: 2,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        data: props.educationData,
        z: 2,
      },
      {
        name: "",
        type: "pie",
        center: [60, "50%"],
        radius: [42, 52],
        itemStyle: { opacity: 0.2 },
        padAngle: 2,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        data: props.educationData,
        z: 1,
      },
    ],
  } as EChartsOption; ;
});

const { t } = useI18n();

const switchOptions = computed(() => [
  { label: t("dormitory.area.faculties"), value: "1", title: t("dormitory.area.facultiesTop5") },
  { label: t("dormitory.area.checkInTime"), value: "2", title: t("dormitory.area.checkInTime") },
]);
const activeSwitch = ref<"1" | "2">("1");
const title = computed(() => switchOptions.value.find(item => item.value === activeSwitch.value)?.title);

const personnelInformationOccupancyTopData = computed(() => {
  const { departmentData, timeData } = props;
  return activeSwitch.value === "1" ? departmentData : timeData;
});
</script>

<template>
  <UiBoxPanel
    class="row-span-11"
    title-path="dormitory.area.personnelBaseInfo">
    <div class="chart-box relative h-[120px]">
      <RenderEchart :option="option" />
      <div class="absolute right-0 top-1/2 ml-2 w-[calc(100%-120px)] flex flex-col flex-auto gap-y-1 overflow-hidden px-3 -translate-y-1/2">
        <span class="flex items-center justify-between text-[12px]">
          <span class="inline-flex items-center gap-1">
            <span class="inline-block size-[6px] border border-[#C8C8C8] from-white/12 to-white/60 bg-gradient-to-r" />
            男生
          </span>
          <span class="inline-flex items-center gap-1">
            女生
            <span class="inline-block size-[6px] border border-[#CE7A7A] from-[#CC1A1A]/80 to-[#CC1A1A]/12 bg-gradient-to-r" />
          </span>
        </span>
        <span class="w-full flex justify-between text-[10px] children:leading-[10px]">
          <span :style="`width:${sexDataFormat.manPercent}%;`" class="h-[12px] border border-[#C8C8C8] from-white/12 to-white/60 bg-gradient-to-r text-left text-white">{{ sexDataFormat.manPercent }}%</span>
          <span :style="`width:${sexDataFormat.womanPercent}%;`" class="h-[12px] border border-[#CE7A7A] from-[#CC1A1A]/80 to-[#CC1A1A]/12 bg-gradient-to-r text-right text-[#FDDFDF]">{{ sexDataFormat.womanPercent }}%</span>
        </span>
        <span class="flex justify-between">
          <span class="text-[10px] text-white/80"><span class="text-base text-white font-number">{{ numberToThousands(sexDataFormat.man) }}</span>人</span>
          <span class="text-[10px] text-white/80"><span class="from-[#D45F5F] to-white bg-gradient-to-b bg-clip-text text-base text-transparent font-number">{{ numberToThousands(sexDataFormat.woman) }}</span>人</span>
        </span>
      </div>
    </div>

    <div class="relative mt-1 h-[200px] flex flex-col px-1">
      <UiSubTitle :title="title" class="shrink-0">
        <template #extra>
          <SegmentedRadioGroup v-model="activeSwitch" :options="switchOptions" class="justify-end" />
        </template>
      </UiSubTitle>
      <div class="flex-auto overflow-auto">
        <!--  入住人数Top5的院系  -->
        <PersonnelInformationOccupancyTop :type="activeSwitch" :data="personnelInformationOccupancyTopData" />
      </div>
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/chart-bg-3.png") no-repeat center center / 320px 120px;
}
</style>
