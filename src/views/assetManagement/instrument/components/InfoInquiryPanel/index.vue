<script setup lang="tsx">
import type { Ref } from "vue";
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { useI18n } from "vue-i18n";
import { fetchCampusAssetsType, fetchCampusAssetsTypeDetail } from "@/api/assetManagement/instrument_etl.ts";
import { getAllBuild, getAllCollege } from "@/api/commons";
import { useStatusFlag } from "@/composables/assetManagement/instrument.ts";
import { CampusId, campusIdFormat } from "@/enums";
import { cn } from "@/utils";
import facultiesLargeInstrumentsPoiLayer
  from "@/utils/WdpMap/assetManagement/instrument/FacultiesLargeInstrumentsPoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";

defineOptions({ name: "InfoInquiryPanel" });

const { t } = useI18n();

const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

const { informationQueryFlag, isLoading, waitForLoadingEnd, resetOtherFlag } = useStatusFlag();

const searchFrom = ref<{ build: string; buildId: string; faculties: string; parentField?: "1" | "2" }>({
  buildId: "",
  build: "",
  faculties: "",
  parentField: undefined,
});
// 楼栋下拉框
const buildOptions = ref<{ value: string; label: string }[]>([]);
// 院系下拉框
const facultiesOptions = ref<{ value: string }[]>([]);
// 列表数据
const searchResult = ref<{ name: number; sl: number; je: number }[]>([]);
// 选中 下拉框
const selected = ref(false);

// 输入框聚焦 事件
function autoSearchInputFocus(parentField: "1" | "2") {
  const field = parentField === "1" ? "build" : "faculties";
  const notField = parentField === "1" ? "faculties" : "build";
  console.log("selected.value[notField]", searchFrom.value[notField], "parentField", parentField);
  if (!searchFrom.value[notField]) {
    searchFrom.value.parentField = parentField;
  }
  field === "build" && buildOptionsSearch("");
  field === "faculties" && facultiesOptionsSearch("");
}

// 撒点
async function openHeatMapChange(val: boolean) {
  resetOtherFlag("informationQueryFlag");
  await waitForLoadingEnd();
  isLoading.value = true;
  try {
    if (val) {
      const { build, faculties } = searchFrom.value;
      await campusPoiLayer.hideAll();
      await facultiesLargeInstrumentsPoiLayer.render(campusId.value, faculties, build);
    }
    else {
      await campusPoiLayer.showAll();
      await facultiesLargeInstrumentsPoiLayer.removeAll();
    }
  }
  catch (e) {
    console.log("=>(index.vue:47) e", e);
  }
  finally {
    isLoading.value = false;
  }
}

// watch(informationQueryFlag, val => openHeatMapChange(val));

// 下拉框选择
async function handleSelect() {
  selected.value = true;
  const { buildId, faculties, parentField } = searchFrom.value;
  const [err, res] = await to(fetchCampusAssetsType(campusId.value, buildId, faculties, parentField!));
  if (err) {
    window.$message.error("获取信息失败");
  }
  searchResult.value = (res?.resultData || []).map((item, index) => ({ ...item, id: index }));
  if (!informationQueryFlag.value) {
    informationQueryFlag.value = true;
  }
  openHeatMapChange(true);
}

async function buildOptionsSearch(value: string) {
  const campusName = campusIdFormat(campusId.value);
  const [, res] = await to(getAllBuild({ yx: searchFrom.value.faculties, xq: campusName }));
  const result: { value: string; label: string }[] = (res?.resultData || []).map(({ name, value }) => ({
    value: name,
    label: value,
  }));
  if (!value) {
    buildOptions.value = result;
  }
  buildOptions.value = result.reduce((acc, cur) => {
    return cur.value.includes(value) ? [...acc, cur] : acc;
  }, [] as { value: string; label: string }[]);
}

async function facultiesOptionsSearch(value: string) {
  const campusName = campusIdFormat(campusId.value);
  const [, res] = await to(getAllCollege({ ly: searchFrom.value.buildId, xq: campusName }));
  const result: { value: string }[] = (res?.resultData || []).map(item => ({ value: item }));
  if (!value) {
    facultiesOptions.value = result;
  }
  facultiesOptions.value = result.reduce((acc, cur) => {
    return cur.value.includes(value) ? [...acc, cur] : acc;
  }, [] as { value: string }[]);
}

// 高亮搜索结果
function highlightText(content: string, text: string) {
  return content.replace(new RegExp(text, "gi"), match => `<span class="text-red">${match}</span>`);
}

// 院系 columns
const facultiesColumns = computed<IEasyTableProps["columns"]>(() => {
  const cols = [
    {
      title: () => (
        <span>
          <span>{t("largeInstruments.amount")}</span>
          <span class="text-[10px] text-white/60">(万元)</span>
        </span>
      ),
      field: "je",
      align: "center",
    },
    {
      title: () => (
        <span>
          <span>{t("largeInstruments.number")}</span>
          <span class="text-[10px] text-white/60">(台)</span>
        </span>
      ),
      field: "sl",
      align: "center",
    },
  ];
  return [
    searchFrom.value.parentField === "2"
      ? { title: () => t("largeInstruments.buildName"), field: "name", align: "center" }
      : { title: () => t("largeInstruments.faculties"), field: "name", align: "center" },
    ...cols,
  ] as IEasyTableProps["columns"];
});
// 院系下设备 columns
const facultiesLargeInstrumentsColumns: IEasyTableProps["columns"] = [
  {
    title: () => t("largeInstruments.device"),
    field: "name",
    align: "center",
  },
  { title: () => t("largeInstruments.faculties"), field: "yx", align: "center" },
  {
    title: () => (
      <span>
        <span>{t("largeInstruments.amount")}</span>
        <span class="text-[10px] text-white/60">(万元)</span>
      </span>
    ),
    field: "je",
    align: "center",
  },
  { title: () => t("largeInstruments.useDirections"), field: "sjfx", align: "center" },
];

// 表格 选中
const tableSelected = ref(false);
const columns = computed(() => {
  return (tableSelected.value ? facultiesLargeInstrumentsColumns : facultiesColumns.value);
});
const { state: searchResultDetail, execute: searchResultDetailExecute } = useAsyncState(
  async (parentName: string) => {
    const { buildId, faculties, parentField } = searchFrom.value;
    const [err, res] = await to(fetchCampusAssetsTypeDetail(campusId.value, buildId, faculties, parentField!, parentName));
    if (err) return [];
    return (res?.resultData || []).map((item, index) => ({ ...item, id: index }));
  },
  [] as { id: number; zj: number; zcmc: string; zcbh: string; ly: string; yx: string }[],
  { resetOnExecute: false, immediate: false },
);

const tableData = computed(() =>
  tableSelected.value
    ? searchResultDetail.value
    : [...searchResult.value].sort(({ sl: a }, { sl: b }) => b - a),
);

// 表格 行点击
function handleRowClick(data: any) {
  if (tableSelected.value) return;
  const { row: { name, no } } = data;
  tableSelected.value = true;
  searchResultDetailExecute(0, no);
}

onBeforeUnmount(async () => {
  await campusPoiLayer.showAll();
  await facultiesLargeInstrumentsPoiLayer.removeAll();
});
</script>

<template>
  <div class="pointer-events-none grid row-span-24 grid-cols-1 grid-rows-24 gap-3 overflow-hidden children:pointer-events-auto">
    <UiBoxPanel class="row-span-4" title-path="largeInstruments.informationInquiry">
      <div class="mt-2 flex items-center gap-2 px-1">
        <label class="flex-shrink-0 text-[12px]">{{ $t('largeInstruments.buildInfoQuery') }}</label>
        <AAutoComplete
          v-model:value="searchFrom.build"
          :options="buildOptions" popup-class-name="faculties-query-popup"
          :style="{ width: '100%' }" allow-clear
          @search="buildOptionsSearch"
          @select="(value, option) => {
            searchFrom.buildId = option.label;
            handleSelect()
          }"
          @clear="() => {
            searchFrom.build = '';
            searchFrom.buildId = '';
          }">
          <div class="relative h-24px flex-auto border border-#4A4A4A rounded bg-black/10 text-12px text-white">
            <span class="absolute left-10px top-0 inline-block wh-24px">
              <i class="i-ri-search-2-line" />
            </span>
            <input
              :value="searchFrom.build" type="text" class="h-full w-full bg-transparent pl-8 pr-2"
              :placeholder="$t('largeInstruments.pleaseEnterBuilding')"
              @focus="() => autoSearchInputFocus('1')">
          </div>
          <template #option="{ value }">
            <div class="truncate text-white" v-html="highlightText(value, searchFrom.build)" />
          </template>
        </AAutoComplete>
      </div>
      <div class="mt-3 flex items-center gap-2 px-1">
        <label class="flex-shrink-0 text-[12px]">{{ $t('largeInstruments.facultiesInfoQuery') }}</label>
        <AAutoComplete
          v-model:value="searchFrom.faculties"
          :options="facultiesOptions" popup-class-name="faculties-query-popup" :style="{ width: '100%' }" allow-clear
          @search="facultiesOptionsSearch" @select="handleSelect" @clear="() => searchFrom.faculties = ''">
          <div class="relative h-24px flex-auto border border-#4A4A4A rounded bg-black/10 text-12px text-white">
            <span class="absolute left-10px top-0 inline-block wh-24px">
              <i class="i-ri-search-2-line" />
            </span>
            <input
              :value="searchFrom.faculties" type="text" class="h-full w-full bg-transparent pl-8 pr-2"
              :placeholder="$t('largeInstruments.pleaseEnterFaculties')"
              @focus="() => autoSearchInputFocus('2')">
          </div>
          <template #option="{ value: val }">
            <div class="truncate text-white" v-html="highlightText(val, searchFrom.faculties)" />
          </template>
        </AAutoComplete>
      </div>
    </UiBoxPanel>
    <UiBoxPanel v-if="selected" class="row-span-20" title-path="largeInstruments.facultiesLargeInstrumentsList">
      <div class="h-full flex flex-col">
        <button
          v-if="tableSelected" type="button"
          class="mb-2 self-end rounded-lg bg-transparent px-2 py-1 hover:bg-gray-100/10"
          @click="() => tableSelected = false">
          <i class="i-ri-arrow-go-back-fill" />
        </button>
        <div class="flex-auto overflow-hidden">
          <UiEasyTable
            first-column-type="build"
            :columns="columns" :data="tableData"
            @row-click="handleRowClick" />
        </div>
      </div>
    </UiBoxPanel>
  </div>
</template>

<style scoped lang="scss">

</style>
