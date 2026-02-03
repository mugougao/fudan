<script setup lang="ts">
defineOptions({ name: "AssetQuantityDistribution" });

const { data } = defineProps<{
  data: { name: string; value: number;value2: number }[];
}>();

const chartData = computed(() => data.map(({ name, value, value2 }) => ({ name, value1: value, value2 })));
</script>

<template>
  <div class="row-span-7 flex flex-col">
    <UiSubTitle title-path="assetMgr.campusAssetsNumberDistribution" class="shrink-0" />
    <div class="flex-auto overflow-hidden py-2">
      <UiChartBarWithLine :data="chartData" :legend="['资产数量', '资产金额']" :unit="['万个', '亿元']" />
    </div>
  </div>
</template>

<style scoped>
</style>
