<script setup lang="ts">
import AssetDistribution from "../AssetDistribution/index.vue";
import AssetLargeInstruments from "../AssetLargeInstruments/index.vue";
import AssetOverview from "../AssetOverview/index.vue";

defineOptions({ name: "Asset", inheritAttrs: false });

const {
  totalCount = [0, 0, 0],
  typeCount = {
    device: [0, 0, 0],
    furniture: [0, 0, 0],
    software: [0, 0, 0],
    animal: [0, 0, 0],
  },
  numberData = [],
  moneyData = [],
  chargeData = [0, 0],
} = defineProps<{
  totalCount?: [number, number, number];
  typeCount?: {
    device: [number, number, number];
    furniture: [number, number, number];
    software: [number, number, number];
    animal: [number, number, number];
  };
  numberData?: { name: string; value: number }[];
  moneyData?: { name: string; value1: number; value2: number }[];
  chargeData?: [number, number];
}>();
</script>

<template>
  <UiBoxPanel title-path="financial.index.overview" class="row-span-full" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
    <AssetOverview class="row-span-6" :total-count="totalCount" :type-count="typeCount" />
    <AssetDistribution class="row-span-13" :money-data="moneyData" :number-data="numberData" />
    <AssetLargeInstruments class="row-span-5" :charge-data="chargeData" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
