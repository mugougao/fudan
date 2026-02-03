<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchBuildingEnergyList } from "@/api/financial/energy.ts";
import { CampusId } from "@/enums";

defineOptions({ name: "EnergyCampusMonthDetails", inheritAttrs: false });

const emit = defineEmits<{
  rowClick: [id: string];
}>();

const campusId = useRouteQuery("campusId", CampusId.HanDan);

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇", field: "name", align: "center", ellipsis: true },
  {
    title: () => (
      <span class="text-center leading-none">
        用电
        <span class="ml-1 text-[10px] text-white/60 font-text">(万Kwh)</span>
      </span>
    ),
    field: "elect",
    align: "center",
  },
  {
    title: () => (
      <span class="text-center leading-none">
        用水
        <span class="ml-1 text-[10px] text-white/60 font-text">(万m³)</span>
      </span>
    ),
    field: "water",
    align: "center",
  },
];
const searchText = ref("");
let buildNameList: { value: string }[] = [];
const buildNameOptions = ref<{ value: string }[]>([]);
function handleSearch(val: string) {
  buildNameOptions.value = !val
    ? []
    : buildNameList.filter(item => item.value.includes(val));
}

const { state, execute } = useAsyncState(
  async () => {
    const [,res] = await to(fetchBuildingEnergyList(campusId.value, searchText.value));
    const list = res?.resultData || [];
    if (!buildNameList.length) {
      buildNameList = list.map(({ name }) => ({ value: name }));
    }
    return list;
  },
  [],
  { immediate: true, resetOnExecute: false },
);

watch(campusId, () => execute());

function handleChange(e) {
  if (e.type === "click") {
    searchText.value = "";
    execute();
  }
}
</script>

<template>
  <UiBoxPanel title-path="financial.energy.yearBuildingEnergyDetail" class="row-span-16" content-class-name="flex flex-col overflow-hidden">
    <div class="shrink-0 -mt-1">
      <AAutoComplete
        v-model:value="searchText" class="!w-full" :options="buildNameOptions" @search="handleSearch"
        @select="() => execute()">
        <AInput placeholder="请输入楼宇名称" allow-clear @change="handleChange">
          <template #prefix>
            <i class="i-ri-search-2-line" />
          </template>
        </AInput>
      </AAutoComplete>
    </div>
    <div class="flex-auto overflow-hidden px-1 pb-2">
      <UiEasyTable
        :columns="columns" :data="state" row-class-name="cursor-pointer"
        first-column-type="build"
        @row-click="({ row }) => emit('rowClick', row.id)" />
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
