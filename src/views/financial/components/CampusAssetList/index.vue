<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import { to } from "await-to-js";
import { getAllDept } from "@/api/commons";
import { fetchCampusAssetsBuildingList } from "@/api/financial/index.ts";
import { CampusId } from "@/enums";
import { cn } from "@/utils";
import assetHeatmapLayer from "@/utils/WdpMap/financial/AssetHeatmapLayer";
import buildingPoiLayer from "@/utils/WdpMap/financial/BuildingPoiLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";

defineOptions({ name: "CampusAssetList", inheritAttrs: false });

const campusId = useRouteQuery("campusId", CampusId.Overview);

onMounted(() => {
  wdpMap.addLayer(assetHeatmapLayer);
});

onBeforeUnmount(() => {
  buildingPoiLayer.removeAll();
  wdpMap.removeLayer(assetHeatmapLayer);
});

// 热力图
const showHeatMap = ref(false);
watch(
  () => showHeatMap.value,
  (show) => {
    show ? assetHeatmapLayer.render(campusId.value) : assetHeatmapLayer.removeAll();
  },
);

const searchText = ref({ building: "", department: "" });

const { state: departmentAllList } = useAsyncState(
  async () => {
    const [,res] = await to(getAllDept());
    return (res?.resultData ?? []).map(item => ({ value: item }));
  },
  [],
  { immediate: true },
);

const departmentOptions = ref<any[]>([]);
function searchDepartment(value: string) {
  departmentOptions.value = !value
    ? []
    : departmentAllList.value.filter((item: any) => item.value.includes(value));
}

const {
  state,
  execute: handleSearch,
} = useAsyncState(
  async () => {
    const { building, department } = searchText.value;
    const [,res] = await to(fetchCampusAssetsBuildingList(campusId.value, building, department));
    return res?.resultData || [];
  },
  [],
  { immediate: true, resetOnExecute: false },
);

watch(() => campusId.value, () => {
  buildingPoiLayer.removeAll();
  handleSearch();
});

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇", field: "name", align: "center" },
  {
    title: () => (
      <span class="text-center leading-none">
        资产净值
        <span class="ml-1 text-[10px] text-white/60 font-text">(万元)</span>
      </span>
    ),
    field: "jz",
    align: "center",
  },
  {
    title: () => (
      <span class="text-center leading-none">
        资产原值
        <span class="ml-1 text-[10px] text-white/60 font-text">(万元)</span>
      </span>
    ),
    field: "je",
    align: "center",
  },
  {
    title: () => (
      <span class="text-center leading-none">
        资产数
        <span class="ml-1 text-[10px] text-white/60 font-text">(个)</span>
      </span>
    ),
    field: "sl",
    align: "center",
  },
];

async function handleRowClick({ row }: any) {
  await buildingPoiLayer.removeAll();
  buildingPoiLayer.render(row.id);
}
</script>

<template>
  <div :class="cn('campus-asset-list flex flex-col', $attrs.class ?? '')">
    <UiSubTitle class="shrink-0" title-path="financial.index.assetsDistribution">
      <template #extra>
        <UiSwitch v-model="showHeatMap">
          <span class="text-[12px]">热力图</span>
        </UiSwitch>
      </template>
    </UiSubTitle>
    <div class="shrink-0 px-2 pt-1">
      <AForm :colon="false" class="children:!mb-1">
        <AFormItem label="楼宇信息查询" class="[&_.ant-form-item-label_label]:!text-white">
          <AInput v-model:value="searchText.building" placeholder="请输入楼宇名称" @press-enter="() => handleSearch()">
            <template #prefix>
              <i class="i-ri-search-line" />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="部门信息查询" class="[&_.ant-form-item-label_label]:!text-white">
          <AAutoComplete
            v-model:value="searchText.department"
            :options="departmentOptions"
            @search="searchDepartment"
            @select="() => handleSearch()">
            <AInput placeholder="请输入部门名称" @press-enter="() => handleSearch()">
              <template #prefix>
                <i class="i-ri-search-line" />
              </template>
            </AInput>
          </AAutoComplete>
        </AFormItem>
      </AForm>
    </div>
    <div class="flex-auto overflow-hidden pb-2">
      <UiEasyTable first-column-type="build" :columns="columns" :data="state" @row-click="handleRowClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
