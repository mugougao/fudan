<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import dayjs from "dayjs";
import { getBuildingClassroomUsageRate, getBuildingUsageRate } from "@/api/smartTeaching";
import { CampusId } from "@/enums";
import { createEChartsLinearGradient } from "@/utils";
import buildingOccupancyRangeLayer from "@/utils/WdpMap/smartTeaching/BuildingOccupancyRangeLayer.ts";
// 校区ID
const campusId = useRouteQuery<string>("campusId", CampusId.HanDan) as unknown as Ref<string>;

const { state, execute } = useAsyncState<{ name: string;value: number }[]>(async () => {
  const [err, res] = await to(getBuildingClassroomUsageRate(campusId.value));
  if (err) return [];
  return res?.resultData || [];
}, [], { immediate: true, resetOnExecute: false });
watch(campusId, () => execute());

const classroomUtilizationData = computed(() => state.value.map(({ name, value }) => ({ name: dayjs(name).format("M-D"), value })));

const { state: buildingUsageRate, execute: buildingUsageRateExecute } = useAsyncState<{ id: string; name: string; value: number }[]>(
  async () => {
    const [err, res] = await to(getBuildingUsageRate(campusId.value));
    if (err) return [];
    return res?.resultData || [];
  },
  [],
  { immediate: true, resetOnExecute: false },
);
watch(campusId, () => buildingUsageRateExecute());

// 根据教学楼栋使用率返回颜色 100/3
function getColor(rank: number) {
  if (100 * (2 / 3) <= rank) return "#BB2A2A";
  else if (100 * (1 / 3) <= rank) return "#BB752A";
  return "#20AF78";
}
const option = computed(() => {
  const category: string[] = [];
  const seriesData: number[] = [];

  buildingUsageRate.value.forEach(({ name, value }) => {
    category.unshift(name);
    seriesData.unshift(value);
  });

  return {
    grid: { left: 10, bottom: 20, right: 10, top: 20 },
    xAxis: {
      type: "value",
      // boundaryGap: [0, 0.01],
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: category,
      axisLine: { show: false },
      axisLabel: { show: false },
    },
    series: [
      {
        z: 2,
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData,
        barWidth: 9,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(255,255,255,0.1)",
        },
        itemStyle: {
          color: createEChartsLinearGradient(["#CC1A1A33", "#CC1A1A"], [0, 0, 1, 0]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        label: {
          show: true,
          formatter: ({ name, dataIndex }) => `{name|TOP${seriesData.length - dataIndex} ${name}}`,
          position: "left",
          offset: [125, -22],
          rich: {
            name: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              width: 120,
            },
          },
        },
      },
      {
        z: 2,
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData,
        barWidth: 9,
        itemStyle: {
          color: "#ffffff00",
        },
        label: {
          show: true,
          formatter: () => `{box|}`,
          position: "insideRight",
          offset: [6, 0],
          rich: {
            box: {
              width: 2,
              height: 11,
              backgroundColor: "#FFD5D5",
            },
          },
        },
      },

      {
        z: 1,
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData.map(() => 100),
        barWidth: 9,
        barGap: "-100%",
        itemStyle: { color: "#ffffff00" },
        label: {
          show: true,
          formatter: () => `{box|}`,
          position: "insideRight",
          offset: [10, 0],
          rich: {
            box: {
              width: 313,
              height: 24,
              borderWidth: 1,
              borderColor: "#636363",
              borderType: "dashed",
            },
          },
        },
      },
      {
        z: 1,
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData.map(() => 100),
        barWidth: 9,
        barGap: "-100%",
        itemStyle: { color: "#ffffff00" },
        label: {
          show: true,
          formatter: ({ dataIndex }) => `{text|${seriesData[dataIndex]}%}`,
          position: "insideRight",
          offset: [5, -24],
          rich: {
            text: {
              fontSize: 16,
              fontFamily: "D-DIN",
              color: "url(#buildingUsageRateText)",
            },
          },
        },
      },
    ],
  } as EChartsOption;
});
;

const showHeatMap = ref(false);
watch(showHeatMap, (val) => {
  if (val) {
    const list = buildingUsageRate.value.map(({ id, value }) => ({ id, color: `${getColor(value)?.replace("#", "")}4D` }));
    buildingOccupancyRangeLayer.render(list);
  }
  else {
    buildingOccupancyRangeLayer.removeAll();
  }
});
onBeforeUnmount(() => {
  buildingOccupancyRangeLayer.removeAll();
});
</script>

<template>
  <UiBoxPanel
    title-path="smartsTeaching.classroomPosture"
    class="row-span-24"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <template #titleSuffix>
      <HelpTipIcon>
        <span class="flex items-center whitespace-nowrap">
          <span>教室使用率</span>
          <span class="mx-1"> = </span>
          <span class="flex flex-col text-center">
            <span class="border-b"> 每天每个教室的排课总和 </span>
            <span> 教室总数x14(一天有14节课) </span>
          </span>
        </span>
      </HelpTipIcon>
    </template>

    <div class="row-span-8 flex flex-col flex-shrink-0">
      <UiSubTitle title-path="smartsTeaching.classroomOccupancy" class="shrink-0" />
      <!-- <div ref="chart" class="echarts flex-auto overflow-hidden" /> -->
      <div class="flex-auto overflow-hidden pt-2">
        <UiChartBar :data="classroomUtilizationData" legend="使用率" unit="%" />
      </div>
    </div>
    <div class="row-span-16 flex flex-col flex-shrink-0">
      <UiSubTitle title-path="smartsTeaching.buildingOccupancy">
        <template #titleSuffix>
          <HelpTipIcon>
            教学楼使用率=当天该教学楼被占用的教室数量/该教学楼的教室总数。
          </HelpTipIcon>
        </template>
        <template #extra>
          <UiSwitch v-model="showHeatMap">
            {{ $t('smartsTeaching.heatmap') }}
          </UiSwitch>
        </template>
      </UiSubTitle>

      <div class="flex-auto overflow-hidden">
        <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="buildingUsageRateText" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#F37373" />
            </linearGradient>
          </defs>
        </svg>
        <RenderEchart :option="option" />
      </div>
    </div>
  </UiBoxPanel>
</template>

<style scoped>

</style>
