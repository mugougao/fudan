<script setup lang="ts">
import WaterUseCount from "../WaterUseCount/index.vue";
import WaterUseOverview from "../WaterUseOverview/index.vue";

defineOptions({ name: "WaterUse", inheritAttrs: false });

const { overviewData = {}, chartData = [] } = defineProps<{
  overviewData?: Record<string, any>;
  chartData?: { name: string; value1: number;value2: number }[];
}>();
</script>

<template>
  <UiBoxPanel title-path="financial.index.overview" class="row-span-18" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
    <WaterUseOverview class="row-span-15" :data="overviewData" />
    <WaterUseCount class="row-span-9" :data="chartData" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
