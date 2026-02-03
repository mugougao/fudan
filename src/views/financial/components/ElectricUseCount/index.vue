<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "ElectricUseCount", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value1: number;value2: number }[];
}>();
</script>

<template>
  <div :class="cn('electric-use-count flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.campusElectricityStatistics" />
    <div class="flex-auto overflow-hidden">
      <UiChartBarWithLine :data="data" :legend="['用电量', '用电金额']" :unit="['万Kwh', '万元']" color="yellow" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
