<script setup lang="tsx">
import type { EChartsOption } from "echarts";
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchUserDistributionTop5More } from "@/api/network/campus";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";
import { cn, createEChartsLinearGradient } from "@/utils";

defineOptions({ name: "PersonDistributedBuilding", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string;value1: number;value2: number }[];
}>();
const emit = defineEmits<{
  buildClick: [data: { id: string; x: string; y: string; name: string; value: number[] }];
}>();
const campusId = useRouteQuery<CampusId>("campusId", CampusId.HanDan);

const option = computed(() => {
  return {
    grid: { left: 0, right: 20, bottom: 15, top: 30, containLabel: true },
    // color: ["#5EDEDA", "#7BD1FF"],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value: number) => `${value} 个`,
    },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: data.map(item => item.name),
      axisLabel: {
        formatter: (value: string) => value.length > 5 ? value.match(/.{1,5}/g)?.join("\n") : value,
      },
      triggerEvent: true,
    },
    legend: {
      top: 5,
      left: "30%",
      data: [
        { name: "用户数", itemStyle: { color: "#CC1A1A", borderWidth: 0 } },
        { name: "终端数", itemStyle: { color: "#EABC8B", borderWidth: 0 } },
      ],
      itemGap: 40,
    },
    series: [
      {
        name: "用户数",
        data: data.map(item => item.value1),
        type: "bar",
        barWidth: 10,
        barGap: "50%",
        itemStyle: {
          color: createEChartsLinearGradient(["#cc1a1acc", "#cc1a1a26"], [1, 0, 0, 0]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: ["100%", -1],
          formatter: `{box|}`,
          rich: { box: { backgroundColor: "#FFD5D5", width: 2, height: 12 } },
        },
        showBackground: true,
        backgroundStyle: {
          color: "rgba(225, 225, 225, 0.1)",
        },
      },
      {
        name: "终端数",
        data: data.map(item => item.value2),
        type: "bar",
        barWidth: 10,
        itemStyle: {
          color: createEChartsLinearGradient(["#FFCE9B", "#ffce9b66"], [1, 0, 0, 0]),
          borderColor: "#EABC8B",
          borderWidth: 1,
        },
        label: {
          show: true,
          position: ["100%", -1],
          formatter: `{box|}`,
          rich: { box: { backgroundColor: "#FFE5CA", width: 2, height: 12 } },
        },
        showBackground: true,
        backgroundStyle: {
          color: "rgba(225, 225, 225, 0.1)",
        },
      },
    ],
  } as EChartsOption;
});

const [visible, setVisible] = useState(false);
const columns: IEasyTableProps["columns"] = [
  { title: "楼宇名称", field: "name", align: "center" },
  {
    title: () => (
      <span>
        用户数
        <span class="ml-1 text-[10px] text-white/60 font-text">(个)</span>
      </span>
    ),
    field: "yhs",
    align: "center",
  },
  { title: () => (
    <span>
      终端数
      <span class="ml-1 text-[10px] text-white/60 font-text">(个)</span>
    </span>
  ), field: "zds", align: "center" },
];
let buildNameList: string[] = [];
const buildNameOptions = ref<{ value: string }[]>([]);
const searchText = ref("");
const { state, execute } = useAsyncState(
  async () => {
    const [,res] = await to(fetchUserDistributionTop5More(campusId.value, searchText.value));
    const result = res?.resultData || [];
    if (!buildNameList.length) {
      buildNameList = result.map(item => item.name);
    }
    return result;
  },
  [],
  {
    immediate: false,
    resetOnExecute: false,
  },
);
function handleSearch(val: string) {
  buildNameOptions.value = !val
    ? []
    : buildNameList
        .filter(item => item.includes(val))
        .map(item => ({ value: item }));
}
function handleChange(e) {
  if (e.type === "click") {
    searchText.value = "";
    execute();
  }
}

function echartClick(params: any) {
  const { dataIndex } = params;
  const { id, name, x, y, value1, value2 } = data[dataIndex] as any;
  emit("buildClick", { name, id, x, y, value: [value2, value1] });
}

function rowClick({ row }) {
  const { id, x, y, name, yhs, zds } = row;
  emit("buildClick", { name, id, x, y, value: [zds, yhs] });
}
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.personnelDistributionBuildingTop5">
      <template #extra>
        <button
          type="button"
          class="rounded bg-transparent px-1.5 py-0.5 text-xs hover:bg-red-500/20 hover:text-red-500"
          @click="() => {
            setVisible(true);
            execute();
          }">
          更多
        </button>
      </template>
    </UiSubTitle>
    <div class="flex-auto overflow-hidden">
      <RenderEchart :option="option" @click="echartClick" />
    </div>

    <DragPopup v-model:visible="visible" title="人员楼宇分布" width="400" top="130" left="calc(100% - 760px)">
      <AAutoComplete v-model:value="searchText" class="w-full" :options="buildNameOptions" @search="handleSearch" @select="() => execute()">
        <AInput placeholder="请输入楼宇名称" allow-clear @change="handleChange">
          <template #prefix>
            <i class="i-ri-search-2-line" />
          </template>
        </AInput>
      </AAutoComplete>
      <div class="mt-2 h-[300px]">
        <UiEasyTable
          :columns="columns" :data="state" :row-cell-class-name="({ columnIndex }) => columnIndex > 0 ? 'font-number text-[14px]' : ''"
          @row-click="rowClick" />
      </div>
    </DragPopup>
  </div>
</template>

<style scoped lang="scss">

</style>
