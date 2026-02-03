<script setup lang="ts">
import get from "lodash/get";
import { useCampusAssetsBuildInfo } from "@/composables/assetManagement/campusAssets.ts";
import { cn } from "@/utils";
import AssetDistribution from "./components/AssetDistribution/index.vue";
import MaturityDistribution from "./components/MaturityDistribution/index.vue";

defineOptions({ name: "BuildPopup" });

const props = defineProps<{
  buildId: string;
  title: string;
  faculties: string; // 所属院系
}>();

const emit = defineEmits<{
  close: [];
}>();

const { buildId, title } = toRefs(props);

const visible = defineModel<boolean>("visible", { default: false });

const {
  propertyInfo,
  assetsInfo,
  assetsTypeInfo,
  assetsYearInfo,
  setExpireAssetsType,
  run,
} = useCampusAssetsBuildInfo(buildId);

watch(
  () => [buildId.value, visible.value],
  () => {
    if (!visible.value || !buildId.value) return;
    run();
  },
);

const columns = [
  { title: "assetMgr.grossFloorArea", field: "jzmj", suffix: "㎡" },
  { title: "assetMgr.usableArea", field: "symj", suffix: "㎡" },
  { title: "assetMgr.yearOfConstruction", field: "jsnf", suffix: "年" },
  // { title: "是否有电梯", field: "sfydt" },
  { title: "assetMgr.buildingNature", field: "lyxz" },
  { title: "assetMgr.buildTotalAssets", field: "sl", suffix: "个" },
  { title: "assetMgr.buildTotalAmount", field: "je", suffix: "万元" },
  { title: "assetMgr.largeInstrumentsNumber", field: "dxyqsl", suffix: "个" },
];

const color1 = ["#D45F5F", "#778BF1", "#FFFFFF"];
const color2 = ["#F7C998", "#778BF1", "#FFFFFF"];
</script>

<template>
  <DragPopup
    v-model:visible="visible"
    :title="title" :width="460" :top="100" left="calc(100% - 820px)"
    @close="() => emit('close')">
    <div class="h-660px">
      <UiThirdTitle title-path="assetMgr.propertyInformation" />
      <ul class="grid grid-cols-2 my-2 gap-2 text-[14px]">
        <li v-for="col in columns.slice(0, 4)" :key="col.field" :class="cn('flex items-center')">
          <label class="mr-1 flex-shrink-0 text-white/80">{{ $t(col.title) }}: </label>
          <div class="flex flex-auto items-center overflow-hidden">
            <div class="empty-text text-[14px] font-number">
              {{ get(propertyInfo, col.field) }}
            </div>
            <span v-if="col.suffix" class="flex-shrink-0 text-[12px] text-white/80">{{ col.suffix }}</span>
          </div>
        </li>
      </ul>
      <UiThirdTitle title-path="assetMgr.assetInformation" />
      <ul class="grid grid-cols-2 my-2 gap-2 text-14px">
        <li v-for="col in columns.slice(4)" :key="col.field" :class="cn('flex items-center')">
          <label class="mr-1 flex-shrink-0 text-white/80">{{ $t(col.title) }}: </label>
          <div class="flex flex-auto items-center overflow-hidden">
            <div class="empty-text text-[14px] font-number">
              {{ get(assetsInfo, col.field) }}
            </div>
            <span v-if="col.suffix" class="flex-shrink-0 text-[12px] text-white/80">{{ col.suffix }}</span>
          </div>
        </li>
      </ul>
      <UiThirdTitle title-path="assetMgr.assetDistribution" class="mb-2" />
      <div class="count-pie flex px-3">
        <AssetDistribution
          :title="$t('assetMgr.assetsNumberDistribution')" :sub-title="$t('assetMgr.assetsTotal')"
          name="资产数量" unit="个" :data="assetsTypeInfo.number"
          :color="color1" />
        <AssetDistribution
          :title="$t('assetMgr.assetsAmountDistribution')" :sub-title="$t('assetMgr.assetsTotalAmount')"
          name="资产金额" unit="万元" :data="assetsTypeInfo.amount"
          :color="color2" />
      </div>
      <div class="mt-3 h-230px -mx-3">
        <MaturityDistribution :data="assetsYearInfo" @type-change="setExpireAssetsType" />
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">
.count-pie {
  background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat center / 1px 50%;
}
</style>
