<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "EnergyYearUseCount", inheritAttrs: false });

const { type = "electricity", data = [] } = defineProps<{
  type?: "electricity" | "water";
  data?: { name: string; value1: number;value2: number }[];
}>();

const uiChartBarWithLineProps = computed(() => {
  const unit = type === "electricity" ? "万Kwh" : "万m³";
  const name = type === "electricity" ? "用电" : "用水";
  return {
    data,
    legend: [`${name}量`, `${name}金额`],
    unit: [unit, "万元"],
  };
});
</script>

<template>
  <div :class="cn('energy-year-use-count flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.energy.energyStatistics" />
    <div class="flex-auto">
      <UiChartBarWithLine v-bind="uiChartBarWithLineProps" color="red" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
