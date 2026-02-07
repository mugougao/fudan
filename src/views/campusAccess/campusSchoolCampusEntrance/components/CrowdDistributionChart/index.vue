<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useRouteQuery } from "@vueuse/router";
// import to from "await-to-js";
// import { fetchCampusFlowDistribution } from "@/api/campusAccess/campusSchool";
import { CampusId, CampusName } from "@/enums";
import { useDataSlice, useEChartRender } from "@/hooks";
import crowdDistributionHeatMapLayer from "@/utils/WdpMap/campusAccess/campusSchool/CrowdDistributionHeatMapLayer.ts";
import { merge } from "lodash";

defineOptions({ name: "CrowdDistributionChart" });

// 校区id
const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

// 模拟数据：校区人流量分布数据
const mockCampusFlowDistributionData = {
  "3": [ // 邯郸校区
    { name: "6", value: 45 },
    { name: "7", value: 68 },
    { name: "8", value: 125 },
    { name: "9", value: 142 },
    { name: "10", value: 158 },
    { name: "11", value: 165 },
    { name: "12", value: 152 },
    { name: "13", value: 148 },
    { name: "14", value: 155 },
    { name: "15", value: 162 },
    { name: "16", value: 168 },
    { name: "17", value: 172 },
    { name: "18", value: 165 },
    { name: "19", value: 148 },
    { name: "20", value: 125 },
    { name: "21", value: 92 },
    { name: "22", value: 68 },
    { name: "23", value: 45 }
  ],
  "4": [ // 江湾校区
    { name: "6", value: 35 },
    { name: "7", value: 52 },
    { name: "8", value: 95 },
    { name: "9", value: 112 },
    { name: "10", value: 128 },
    { name: "11", value: 135 },
    { name: "12", value: 122 },
    { name: "13", value: 118 },
    { name: "14", value: 125 },
    { name: "15", value: 132 },
    { name: "16", value: 138 },
    { name: "17", value: 142 },
    { name: "18", value: 135 },
    { name: "19", value: 118 },
    { name: "20", value: 95 },
    { name: "21", value: 72 },
    { name: "22", value: 52 },
    { name: "23", value: 35 }
  ],
  "5": [ // 枫林校区
    { name: "6", value: 28 },
    { name: "7", value: 42 },
    { name: "8", value: 78 },
    { name: "9", value: 92 },
    { name: "10", value: 105 },
    { name: "11", value: 112 },
    { name: "12", value: 98 },
    { name: "13", value: 95 },
    { name: "14", value: 102 },
    { name: "15", value: 108 },
    { name: "16", value: 115 },
    { name: "17", value: 118 },
    { name: "18", value: 112 },
    { name: "19", value: 98 },
    { name: "20", value: 78 },
    { name: "21", value: 58 },
    { name: "22", value: 42 },
    { name: "23", value: 28 }
  ],
  "6": [ // 张江校区
    { name: "6", value: 22 },
    { name: "7", value: 35 },
    { name: "8", value: 65 },
    { name: "9", value: 78 },
    { name: "10", value: 88 },
    { name: "11", value: 95 },
    { name: "12", value: 82 },
    { name: "13", value: 78 },
    { name: "14", value: 85 },
    { name: "15", value: 92 },
    { name: "16", value: 98 },
    { name: "17", value: 102 },
    { name: "18", value: 95 },
    { name: "19", value: 82 },
    { name: "20", value: 65 },
    { name: "21", value: 48 },
    { name: "22", value: 35 },
    { name: "23", value: 22 }
  ]
};

const { state: crowdDistributionState, execute: crowdDistributionExecute } = useAsyncState(async () => {
  if (campusId.value === CampusId.Overview) return [];
  // 获取校区数据，默认为邯郸校区
  const data = mockCampusFlowDistributionData[campusId.value as keyof typeof mockCampusFlowDistributionData] || mockCampusFlowDistributionData["3"];
  const hours = new Date().getHours();
  return data.filter(({ name }) => Number(name) < hours + 1);
}, [], { immediate: false, resetOnExecute: false });
watch(campusId, () => crowdDistributionExecute(), { immediate: true });

const openHeatMap = ref(false);

watch(openHeatMap, (val) => {
  val
    ? crowdDistributionHeatMapLayer.render(campusId.value)
    : crowdDistributionHeatMapLayer.removeAll();
});


function mergeOption(option: EChartsOption){
  return merge(
    option,
    {
      xAxis: { axisLabel: { formatter: (value)=> `${Number(value)}时` } },
      series: [
        { name: "人流分布" },
      ],
    },
  )
}

</script>

<template>
  <div class="row-span-9 flex flex-col flex-shrink-0">
    <UiSubTitle title-path="campusAccess.footTrafficDistribution" class="shrink-0">
      <template #extra>
        <UiSwitch v-model="openHeatMap">
          {{ $t("campusAccess.useHeatMapsForEachEntrance") }}
        </UiSwitch>
      </template>
    </UiSubTitle>
    <div class="flex-auto overflow-hidden mt-3">
      <UiChartLine :data="crowdDistributionState" unit="人" :merge-option="mergeOption"/>
    </div>
     
  </div>
</template>

<style scoped>

</style>
