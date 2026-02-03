<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";
import { cn } from "@/utils";

defineOptions({ name: "TrafficComparison", inheritAttrs: false });
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
            valueFormatter: (val: any) => `${val}Mbps`,
          },
        },
        {
          tooltip: {
            valueFormatter: (val: any) => `${val}Mbps`,
          },
        },
      ],
    },
  );
}
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.trafficComparison">
      <template #extra>
        <SegmentedRadioGroup v-model="timeType" :options="radioOptions" class="justify-end" />
      </template>
    </UiSubTitle>
    <div class="flex-auto overflow-hidden">
      <UiChartSmoothDoubleLine :data="data" :legend="['上行流量', '下行流量']" unit="流量" :merge-option="mergeOption" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
