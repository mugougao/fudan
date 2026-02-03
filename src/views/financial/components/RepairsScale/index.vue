<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "RepairsScale", inheritAttrs: false });

const data = [
  { value1: 1048, value2: 820, name: "邯郸" },
  { value1: 735, value2: 820, name: "江湾" },
  { value1: 580, value2: 720, name: "枫林" },
  { value1: 484, value2: 620, name: "张江" },
];
</script>

<template>
  <div :class="cn('repairs-distribution flex flex-col', $attrs.class ?? '')">
    <!-- <UiSubTitle title-path="financial.index.repairDistribution" /> -->
    <UiSubTitle title="规模修缮分布" />
    <div class="flex-auto overflow-hidden pt-2">
      <UiChartBarWithLine :data="data" :legend="['修缮总数', '修缮金额']" :unit="['个', '万元']" color="red" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
