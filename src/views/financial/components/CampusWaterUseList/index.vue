<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import { to } from "await-to-js";
import { fetchCampusBuildingUseWaterWithElectricityList } from "@/api/financial/index.ts";
import { CampusId } from "@/enums";
import { cn } from "@/utils";
import buildingPoiLayer from "@/utils/WdpMap/financial/BuildingPoiLayer.ts";
import waterElectricityHeatMap from "@/utils/WdpMap/financial/WaterElectricityHeatMap";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";

defineOptions({ name: "CampusWaterUseList", inheritAttrs: false });

const campusId = useRouteQuery("campusId", CampusId.Overview);

onMounted(() => {
  wdpMap.addLayer(waterElectricityHeatMap);
});

onBeforeUnmount(() => {
  buildingPoiLayer.removeAll();
  wdpMap.removeLayer(waterElectricityHeatMap);
});

// 热力图
const showHeatMap = ref(false);
watch(
  () => showHeatMap.value,
  (show) => {
    show
      ? waterElectricityHeatMap.render(campusId.value, "water")
      : waterElectricityHeatMap.removeAll();
  },
);

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇", field: "name", align: "center" },
  {
    title: () => (
      <span class="text-center leading-none">
        年度用水金额
        <span class="ml-1 text-[10px] text-white/60 font-text">(万元)</span>
      </span>
    ),
    field: "wateramount",
    align: "center",
  },
  {
    title: () => (
      <span class="text-center leading-none">
        年度用水量
        <span class="ml-1 text-[10px] text-white/60 font-text">(万m³)</span>
      </span>
    ),
    field: "water",
    align: "center",
  },
];
const searchText = ref("");
const {
  state,
  execute: handleSearch,
} = useAsyncState(
  async () => {
    const [,res] = await to(fetchCampusBuildingUseWaterWithElectricityList(campusId.value, searchText.value));
    return (res?.resultData || []).sort((a, b) => b.wateramount - a.wateramount);
  },
  [],
  { immediate: true, resetOnExecute: false },
);

watch(
  campusId,
  () => {
    buildingPoiLayer.removeAll();
    handleSearch();
  },
);

async function handleRowClick({ row }: any) {
  console.log("🚀 ~ handleRowClick ~ row:", row.id);
  await buildingPoiLayer.removeAll();
  buildingPoiLayer.render(row.id);
}
</script>

<template>
  <div :class="cn('campus-water-use-list flex flex-col', $attrs?.class || '')">
    <UiSubTitle title-path="financial.index.buildingWaterDistribution" class="shrink-0">
      <template #extra>
        <UiSwitch v-model="showHeatMap">
          热力图
        </UiSwitch>
      </template>
    </UiSubTitle>
    <div class="px-2 py-2">
      <AInput v-model:value="searchText" placeholder="请输入楼宇名称" allow-clear @press-enter="() => handleSearch()" />
    </div>
    <div class="flex-auto overflow-hidden pb-2">
      <div class="h-full overflow-x-hidden overflow-y-auto">
        <UiEasyTable :columns="columns" :data="state" first-column-type="build" @row-click="handleRowClick" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
