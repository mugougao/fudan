<script setup lang="ts">
import RepairOverview from "../RepairOverview/index.vue";
import RepairsDistribution from "../RepairsDistribution/index.vue";
import RepairsScale from "../RepairsScale/index.vue";

defineOptions({ name: "Repair", inheritAttrs: false });
</script>

<template>
  <UiBoxPanel title-path="financial.index.overview" class="row-span-20" content-class-name="grid grid-cols-1 grid-rows-24">
    <RepairOverview class="row-span-6" />
    <RepairsDistribution class="row-span-9" />
    <RepairsScale class="row-span-9" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
