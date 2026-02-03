<script setup lang="tsx">
import type { Ref } from "vue";
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import { useI18n } from "vue-i18n";
import { useStatusFlag } from "@/composables/assetManagement/instrument.ts";
import { CampusId } from "@/enums";
import campusAssetsBuildPoiLayer from "@/utils/WdpMap/assetManagement/campusAssets/campusAssetsBuildPoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";

defineOptions({ name: "BuildDistribution" });

const { data } = defineProps<IProps>();

export interface IProps {
  data: { name: string; numberOfDevices: number; money: number; numberOfTerminals: number }[];
}

const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
const { buildDistributionFlag, isLoading, waitForLoadingEnd, resetOtherFlag } = useStatusFlag();
const { t } = useI18n();

watch(
  () => buildDistributionFlag.value,
  async (val) => {
    resetOtherFlag("buildDistributionFlag");
    await waitForLoadingEnd();
    await campusAssetsBuildPoiLayer.removeAll();
    isLoading.value = true;
    try {
      if (val) {
        await campusPoiLayer.hideAll();
        await campusAssetsBuildPoiLayer.render(campusId.value, true);
        campusAssetsBuildPoiLayer.focusAll();
      }
      else {
        await campusPoiLayer.showAll();
      }
    }
    catch (e) {
      console.log("=>(index.vue:47) e", e);
    }
    finally {
      isLoading.value = false;
    }
  },
);

function format(value: any, unit: string) {
  return (
    <div class="inline-flex items-center">
      <span class="text-20px font-number">{ value }</span>
      <span class="ml-0.5 text-12px font-text-medium">{ unit}</span>
    </div>
  );
}

// const columns = computed<IEasyTableProps["columns"]>(() => [
//   { title: t("largeInstruments.buildName"), field: "name", align: "center", ellipsis: true },
//   { title: t("largeInstruments.devicesNumber"), field: "numberOfDevices", align: "center", width: 80 },
//   { title: t("largeInstruments.amount"), field: "money", align: "center" },
//   { title: t("largeInstruments.TerminalsNumber"), field: "numberOfTerminals", align: "center", width: 80 },
// ]);

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇名称", field: "name", align: "center" },
  {
    title: () => (
      <span class="flex flex-col">
        设备数量
        <span class="text-[10px] text-white/60">(台)</span>
      </span>
    ),
    field: "numberOfDevices",
    align: "center",
    // width: 80,
    className: "font-number text-[14px]",
  },
  {
    title: () => (
      <span class="flex flex-col">
        金额
        <span class="text-[10px] text-white/60">(万元)</span>
      </span>
    ),
    field: "money",
    align: "center",
    className: "font-number text-[14px]",
  },
  {
    title: () => (
      <span class="flex flex-col">
        终端数量
        <span class="text-[10px] text-white/60">(台)</span>
      </span>
    ),
    field: "numberOfTerminals",
    align: "center",
    // width: 80,
    className: "font-number text-[14px]",
  },
];

const state = computed(() => (data || []).map((item, index) => ({ id: index, ...item })));

onBeforeUnmount(() => {
  campusAssetsBuildPoiLayer.removeAll();
});
function handleOnSearch(value: string) {
  return Array.from(
    campusAssetsBuildPoiLayer.layerDataMap.values(),
  ).reduce((prev, { name, id }) => {
    if (!name.includes(value)) return prev;
    prev.push({ name, id });
    return prev;
  }, [] as any[]);
}
</script>

<template>
  <div class="row-span-15 flex flex-col">
    <!-- <PoiSearch
      v-if="buildDistributionFlag"
      class="ml-auto mt-1.5" width="300px" :on-search="handleOnSearch"
      @select="({ id }) => campusAssetsBuildPoiLayer.flyTo(id) " /> -->

    <UiSubTitle title-path="largeInstruments.buildDistribution" class="shrink-0">
      <template #extra>
        <UiSwitch v-model="buildDistributionFlag">
          {{ $t('largeInstruments.pointDistribution') }}
        </UiSwitch>
      </template>
    </UiSubTitle>

    <div class="mt-2 flex-auto overflow-hidden px-1">
      <UiEasyTable :columns="columns" :data="state" />
    </div>
  </div>
</template>

<style scoped></style>
