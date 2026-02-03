<script setup lang="ts">
import AssetMaturityDistribution from "../AssetMaturityDistribution/index.vue";
import AssetStatistics, { type IProps as AssetStatisticsProps } from "../AssetStatistics/index.vue";
import InstrumentDistributionLarge from "../InstrumentDistributionLarge/index.vue";

defineOptions({ name: "CampusPanel" });

const {
  overviewState,
  expireAssetsState,
  setExpireAssetsType,
  largeInstrumentState,
} = defineProps<{
  overviewState: AssetStatisticsProps;
  expireAssetsState: { name: string; value1: number; value2: number }[];
  setExpireAssetsType: (type: 0 | 1) => void;
  largeInstrumentState: { name: string; value: number }[];
}>();
</script>

<template>
  <UiBoxPanel :title="$t('assetMgr.campusOverview')" class="row-span-18" content-class-name="grid grid-cols-1 grid-rows-24">
    <AssetStatistics
      :total-amount="overviewState.totalAmount"
      :total-number="overviewState.totalNumber"
      :list="overviewState.list"
      class="row-span-6" />
    <!-- 资产到期分布 -->
    <AssetMaturityDistribution class="row-span-10" :data="expireAssetsState" @type-change="(val) => setExpireAssetsType(val)" />
    <!-- 大型仪器分布 -->
    <InstrumentDistributionLarge :data="largeInstrumentState" class="row-span-8" />
  </UiBoxPanel>
</template>

<style scoped>

</style>
