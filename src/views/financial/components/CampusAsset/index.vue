<script setup lang="ts">
import { cn } from "@/utils";
import AssetLargeInstruments from "../AssetLargeInstruments/index.vue";
import AssetOverview from "../AssetOverview/index.vue";
import CampusAssetList from "../CampusAssetList/index.vue";

defineOptions({ name: "CampusAsset", inheritAttrs: false });
const {
  totalCount = [300, 0, 0],
  typeCount = {
    device: [0, 0, 0],
    furniture: [0, 0, 0],
    software: [0, 0, 0],
    animal: [0, 0, 0],
  },
  chargeData = [0, 0],
} = defineProps<{
  totalCount?: [300, number, number];
  typeCount?: {
    device: [number, number, number];
    furniture: [number, number, number];
    software: [number, number, number];
    animal: [number, number, number];
  };
  chargeData?: [number, number];
}>();
</script>

<template>
  <div :class="cn('campus-asset', $attrs?.class || '')">
    <AssetOverview class="row-span-6" :total-count="totalCount" :type-count="typeCount" />
    <CampusAssetList class="row-span-13" />
    <AssetLargeInstruments class="row-span-5" :charge-data="chargeData" />
  </div>
</template>

<style scoped lang="scss">

</style>
