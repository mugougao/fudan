<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "WaterUseCount", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value1: number;value2: number }[];
}>();
</script>

<template>
  <div :class="cn('water-use-count flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.campusWaterStatistics" />
    <div class="flex-auto overflow-hidden">
      <UiChartBarWithLine :data="data" :legend="['用水量', '用水金额']" :unit="['万m³', '万元']" color="blue" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
