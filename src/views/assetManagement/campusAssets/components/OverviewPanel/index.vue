<script setup lang="ts">
import AssetMaturityDistribution from "../AssetMaturityDistribution/index.vue";
import AssetQuantityDistribution from "../AssetQuantityDistribution/index.vue";
import AssetStatistics, { type IProps as AssetStatisticsProps } from "../AssetStatistics/index.vue";
import InstrumentDistribution from "../InstrumentDistribution/index.vue";

defineOptions({ name: "OverviewPanel" });
const {
  overviewState,
  numberAssetsState,
  expireAssetsState,
  setExpireAssetsType,
  largeInstrumentState,
} = defineProps<{
  overviewState: AssetStatisticsProps;
  numberAssetsState: { name: string; value: number; value2: number }[];
  expireAssetsState: { name: string; value1: number; value2: number }[];
  setExpireAssetsType: (type: 0 | 1) => void;
  largeInstrumentState: { name: string; value: number }[];
}>();
</script>

<template>
  <UiBoxPanel
    :title="$t('assetMgr.campusOverview')"
    class="row-span-24" content-class-name="grid grid-cols-1 grid-rows-24 px-4">
    <AssetStatistics :total-amount="overviewState.totalAmount" :total-number="overviewState.totalNumber" :list="overviewState.list" />
    <!-- 资产数量分布 -->
    <AssetQuantityDistribution :data="numberAssetsState" />
    <!-- 资产到期分布 -->
    <AssetMaturityDistribution :data="expireAssetsState" @type-change="(val) => setExpireAssetsType(val)" />
    <!-- 大型仪器分布 -->
    <InstrumentDistribution :data="largeInstrumentState" />
  </UiBoxPanel>
</template>

<style scoped>

</style>
