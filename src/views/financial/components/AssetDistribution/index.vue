<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";
import { cn } from "@/utils";

defineOptions({ name: "AssetDistribution", inheritAttrs: false });

const { numberData = [], moneyData = [] } = defineProps<{
  numberData?: { name: string; value: number }[];
  moneyData?: { name: string; value1: number; value2: number }[];
}>();

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      yAxis: { nameTextStyle: { align: "", padding: [0, 0, 0, 0] } },
    },
  );
}

function mergeOption2(option: EChartsOption) {
  return merge(
    option,
    {
      yAxis: { nameTextStyle: { align: "", padding: [0, 0, 0, 0] } },
      tooltip: {
        valueFormatter: (val: any) => `${val} 亿元`,
      },
    },
  );
}
</script>

<template>
  <div :class="cn('asset-distribution flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.campusAssetsDistribution" class="shrink-0" />
    <div class="flex-auto overflow-hidden py-2">
      <div class="h-1/2">
        <UiChartBar :data="numberData" legend="数量" unit="万个" :merge-option="mergeOption" />
      </div>
      <div class="h-1/2">
        <UiChartDoubleLine :data="moneyData" :legend="['总金额', '资产净值']" unit="单位:亿元" :merge-option="mergeOption2" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
