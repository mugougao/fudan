<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "PropertyFee", inheritAttrs: false });

const data = [
  { value: 1048, name: "邯郸" },
  { value: 735, name: "江湾" },
  { value: 580, name: "枫林" },
  { value: 484, name: "张江" },
];
</script>

<template>
  <div :class="cn('property-fee flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.propertyDistribution" />
    <div class="flex-auto overflow-hidden pt-1">
      <UiChartBar :data="data" legend="数量" unit="万元" color="blue" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
