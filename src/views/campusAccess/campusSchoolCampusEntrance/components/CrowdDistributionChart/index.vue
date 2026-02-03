<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchCampusFlowDistribution } from "@/api/campusAccess/campusSchool";
import { CampusId, CampusName } from "@/enums";
import { useDataSlice, useEChartRender } from "@/hooks";
import crowdDistributionHeatMapLayer from "@/utils/WdpMap/campusAccess/campusSchool/CrowdDistributionHeatMapLayer.ts";
import { merge } from "lodash";

defineOptions({ name: "CrowdDistributionChart" });

// 校区id
const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

const { state: crowdDistributionState, execute: crowdDistributionExecute } = useAsyncState(async () => {
  if (campusId.value === CampusId.Overview) return [];
  const campusName = CampusName[campusId.value];
  const [err, res] = await to(fetchCampusFlowDistribution(`${campusName}校区`));
  if (err) return [];
  const hours = new Date().getHours();
  return (res?.resultData || []).filter(({ name }) => Number(name) < hours + 1);
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
