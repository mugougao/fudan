<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";
import { cn } from "@/utils";

defineOptions({ name: "UserTerminalTrends", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value1: number; value2: number }[];
}>();

const timeType = defineModel<"1" | "2">("timeType", { default: "1" });

const radioOptions = [
  { label: "近30天", value: "1" },
  { label: "近24小时", value: "2" },
];

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      series: [
        {
          tooltip: {
            valueFormatter: (val: any) => `${val}人`,
          },
        },
        {
          tooltip: {
            valueFormatter: (val: any) => `${val}台`,
          },
        },
      ],
    },
  );
}
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.userAndTerminalChangeTrend">
      <template #extra>
        <SegmentedRadioGroup v-model="timeType" :options="radioOptions" class="justify-end" />
      </template>
    </UiSubTitle>
    <div class="flex-auto overflow-hidden">
      <UiChartDoubleLine :data="data" :legend="['在线用户', '在线终端']" unit="单位:个" :merge-option="mergeOption" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
