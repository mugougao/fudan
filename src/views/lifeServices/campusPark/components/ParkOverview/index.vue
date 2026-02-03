<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { cn, numberToThousands } from "@/utils";
import occupancyRateDistributionLayer from "@/utils/WdpMap/lifeServices/OccupancyRateDistributionLayer.ts";

const props = defineProps<{
  data: Record<string, any>;
  totalSupervisor: number;
}>();

// 入住率分布
const openOccupancyDistribution = defineModel("openOccupancyDistribution", { default: false });

// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

const list = [
  { title: "dormitory.area.build", filed: "lys", unit: "栋", icon: "i-svg-icon-build3" },
  { title: "dormitory.area.rooms", filed: "fjs", unit: "间", icon: "i-svg-icon-house" },
  { title: "dormitory.area.beds", filed: "cws", unit: "个", icon: "i-svg-icon-bed" },
  { title: "dormitory.area.supervisors", filed: "totalSupervisor", unit: "人", icon: "i-svg-icon-administrator" },
];
const listState = computed(() => {
  const { data = {}, totalSupervisor = 0 } = props;
  return { ...data, totalSupervisor };
});

const list2 = [
  { title: "dormitory.area.occupiedRoom", field: "yrzfj", unit: "间", colors: { 0: "#04E3FF", 100: "#04E3FF" } },
  { title: "dormitory.area.noShowroom", field: "wrzfj", unit: "间", colors: { 0: "#089AFF", 100: "#089AFF" } },
  { title: "dormitory.area.occupiedBed", field: "yrzcw", unit: "个", colors: { 0: "#69FFCA", 100: "#69FFCA" } },
  { title: "dormitory.area.noShowBed", field: "wrzcw", unit: "个", colors: { 0: "#36D99F", 100: "#36D99F" } },
];

function getOption(data: { name: string; value: number }[], color: string[], title: string, subtitle: string, unit: string) {
  return {
    color,
    tooltip: {
      trigger: "item",
      valueFormatter: value => `${value} ${unit}`,
    },
    legend: [
      {
        top: 45,
        right: 10,
        data: [data[0].name],
        formatter: (name) => {
          const value = data.find(item => item.name = name)?.value ?? 0;
          return `{name|${name}}\n{value|${numberToThousands(value)}}{unit|${unit}}`;
        },
        textStyle: {
          rich: {
            name: { fontSize: 12, fontFamily: "AlibabaPuHuiTi-3-bold", padding: [25, 0, 10, 0] },
            value: { color: `url(#openOccupancyDistribution_${color[0]})`, fontSize: 18, fontFamily: "D-DIN" },
            unit: { fontSize: 12, color: "rgba(255,255,255,0.8)", padding: [0, 0, 0, 5] },
          },
        },
      },
      {
        top: 45,
        left: 10,
        data: [data[1].name],
        formatter: (name) => {
          const value = data.find(item => item.name = name)?.value ?? 0;
          return `{name|${name}}\n{value|${numberToThousands(value)}}{unit|${unit}}`;
        },
        textStyle: {
          rich: {
            name: { fontSize: 12, fontFamily: "AlibabaPuHuiTi-3-bold", padding: [25, 0, 10, 0] },
            value: { color: `url(#openOccupancyDistribution_${color[1]})`, fontSize: 18, fontFamily: "D-DIN" },
            unit: { fontSize: 12, color: "rgba(255,255,255,0.8)", padding: [0, 0, 0, 5] },
          },
        },
      },
    ],
    title: [
      {
        text: `{text|${title}}`,
        left: "middle",
        top: "middle",
        textStyle: {
          rich: {
            text: {
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "AlibabaPuHuiTi-3-medium",
              align: "center",
              padding: [20, 10, 0, 0],
            },
          },
        },
      },
      {
        text: `{text|${subtitle ?? 0}}{unit|%}`,
        left: "middle",
        top: "middle",
        textStyle: {
          rich: {
            unit: {
              fontSize: 12,
              color: "#fff",
              fontFamily: "D-DIN",
              align: "center",
              padding: [0, 0, 15, -20],
            },
            text: {
              fontSize: 22,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "D-DIN",
              align: "center",
              padding: [0, 20, 20, 0],
            },
          },
        },
      },
    ],
    series: [
      {
        name: "",
        type: "pie",
        center: ["50%", "50%"],
        radius: [45, 48],
        padAngle: 2,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        data,
        z: 2,
      },
      {
        name: "",
        type: "pie",
        center: ["50%", "50%"],
        radius: [38, 48],
        itemStyle: { opacity: 0.2 },
        padAngle: 2,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { disabled: true },
        data,
        z: 1,
      },
    ],
  } as EChartsOption;
}

const chartOption1 = computed(() => {
  return getOption(
    [
      { name: "已入住房间", value: props.data.yrzfj ?? 0 },
      { name: "未入住房间", value: props.data.wrzfj ?? 0 },
    ],
    ["#D45F5F", "#fff"],
    "房间入住率",
    props.data.fjrzl,
    "间",
  );
});
const chartOption2 = computed(() => {
  return getOption(
    [
      { name: "未入住床位", value: props.data.wrzcw ?? 0 },
      { name: "已入住床位", value: props.data.yrzcw ?? 0 },
    ],
    ["#778BF1", "#fff"],
    "房间入住率",
    props.data.cwzyl,
    "个",
  );
});

watch(
  () => openOccupancyDistribution.value,
  (val) => {
    val
      ? occupancyRateDistributionLayer.render(dormitoryAreaId.value)
      : occupancyRateDistributionLayer.removeAll();
  },
);

watch(dormitoryAreaId, () => openOccupancyDistribution.value = false);
</script>

<template>
  <UiBoxPanel
    class="row-span-13"
    title-path="dormitory.area.parkBaseOverview">
    <div class="flex shrink-0 justify-end">
      <UiSwitch v-model="openOccupancyDistribution">
        {{ $t('dormitory.area.occupancyRate') }}
      </UiSwitch>
    </div>

    <ul class="count-box h-[100px] flex shrink-0 items-center justify-evenly -mt-2">
      <li
        v-for="(item, index) in list" :key="index"
        class="flex flex-col items-center">
        <div class="icon-box h-[60px] w-[50px] flex flex-col items-center justify-end">
          <i :class="cn(item.icon, 'from-[#FFDBDB] to-white bg-gradient-to-b')" />
          <span class="mt-1 from-[#FFDBDB]/80 to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-title">{{ $t(item.title) }}</span>
        </div>
        <span class="flex flex-col items-center gap-0.5 leading-none">
          <span class="empty-number from-red to-white bg-gradient-to-b bg-clip-text text-[20px] text-transparent font-number">
            {{ $_.get(listState, item.filed) }}
          </span>
          <span class="text-[12px] text-white/60">({{ item.unit }})</span>
        </span>
      </li>
    </ul>
    <svg width="0" height="0">
      <defs>
        <linearGradient id="openOccupancyDistribution_#D45F5F" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#D45F5F" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <linearGradient id="openOccupancyDistribution_#778BF1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#778BF1" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <linearGradient id="openOccupancyDistribution_#fff" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
    <div class="chart-box mt-1.5 h-[140px] w-full">
      <RenderEchart :option="chartOption1" />
    </div>
    <div class="chart-box mt-1.5 h-[140px] w-full">
      <RenderEchart :option="chartOption2" />
    </div>

    <!-- <div class="row-span-12">
      <div class="grid grid-cols-2 grid-rows-1 py-10px">
        <div class="col-span-1 row-span-1">
    <parkOverviewRoom :value="props.data.fjrzl || 0" />
    </div>
    <div class="cols-span-1 row-span-1">
      <parkOverviewBed :value="props.data.cwzyl || 0" />
    </div>
    </div>
    </div>

    <div class="row-span-5 mt-3 flex justify-around">
      <div v-for="({ title, field, unit, colors }) in list2" :key="field">
        <div class="text-14px text-white">
          {{ $t(title) }}
        </div>
        <div class="flex items-baseline justify-between gap-2 text-16px text-white">
          <GradientText class="text-24px font-number" :deg="0" :colors="colors">
            <span class="empty-number">{{ $_.get(props.data, field) }}</span>
          </GradientText>
          <span>{{ unit }}</span>
        </div>
      </div>
    </div> -->
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count-box {
  .icon-box {
    background: url("@/assets/images_new/icon-bg-2.png") no-repeat center / 58px 45px;
  }
}

.chart-box {
  background-image: url("@/assets/images_new/chart-bg1.png");
  background-size: 329px 128px;
  background-position: calc(50% - 1px) center;
  background-repeat: no-repeat;
}
.chart-box:last-of-type {
  background-image: url("@/assets/images_new/chart-bg2.png");
}
</style>
