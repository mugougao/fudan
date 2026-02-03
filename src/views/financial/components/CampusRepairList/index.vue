<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { cn, highlightText } from "@/utils";

defineOptions({ name: "CampusRepairList", inheritAttrs: false });

// 热力图
const showHeatMap = ref(false);

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇", field: "build", align: "center" },
  {
    title: () => (
      <span class="text-center leading-none">
        用电金额
        <span class="ml-1 text-[10px] text-white/60 font-text">(元)</span>
      </span>
    ),
    field: "value",
    align: "center",
  },
  {
    title: () => (
      <span class="text-center leading-none">
        用电量
        <span class="ml-1 text-[10px] text-white/60 font-text">(Kwh)</span>
      </span>
    ),
    field: "value",
    align: "center",
  },
];
const searchText = ref("");
const options = shallowRef([]);
function handleSearch() {}
function handleSelect() {}
function handleClear() {}
const state = Array.from({ length: 20 }, (_, index) => {
  return {
    build: `楼宇${index}`,
    value: 123456,
    value2: 100,
  };
});
</script>

<template>
  <div :class="cn('campus-electric-list flex flex-col', $attrs?.class || '')">
    <UiSubTitle title-path="financial.index.buildingDistribution" class="shrink-0">
      <template #extra>
        <UiSwitch v-model="showHeatMap">
          点位分布
        </UiSwitch>
      </template>
    </UiSubTitle>
    <div class="px-2 py-2">
      <AAutoComplete
        v-model:value="searchText"
        size="small" :options="options" allow-clear
        popup-class-name="faculties-query-popup" :style="{ width: '100%' }"
        @search="handleSearch" @select="handleSelect" @clear="handleClear">
        <div class="relative h-24px w-200px border border-#4A4A4A rounded bg-black/10 text-12px text-white">
          <span class="absolute left-10px top-0 inline-block wh-24px">
            <i class="i-ri-search-2-line" />
          </span>
          <input :value="searchText" type="text" class="h-full w-full bg-transparent pl-8 pr-2" placeholder="请输入楼宇名称">
        </div>
        <template #option="{ value: val }">
          <div class="truncate text-white" v-html="highlightText(val, searchText)" />
        </template>
      </AAutoComplete>
    </div>
    <div class="flex-auto overflow-hidden pb-2">
      <UiEasyTable :columns="columns" :data="state" first-column-type="build" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
