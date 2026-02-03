<script setup lang="ts">
import ElectricOverview from "../ElectricOverview/index.vue";
import ElectricUseCount from "../ElectricUseCount/index.vue";

defineOptions({ name: "Electric", inheritAttrs: false });

const { overviewData = {}, chartData = [] } = defineProps<{
  overviewData?: Record<string, any>;
  chartData?: { name: string; value1: number;value2: number }[];
}>();
</script>

<template>
  <UiBoxPanel title-path="financial.index.overview" class="row-span-18" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
    <ElectricOverview class="row-span-15" :data="overviewData" />
    <ElectricUseCount class="row-span-9" :data="chartData" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
