<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { merge } from "lodash";

defineOptions({ name: "CampusEnergyConsumptionTrend", inheritAttrs: false });

const { data = [], type = "1" } = defineProps<{
  data: { name: string; value1: number; value2: number }[];
  type: "1" | "2"; // 1: 购电，2：用电
}>();

const typeText = computed(() => type === "1" ? "购电量" : "用电量");

const dataFormat = computed(() => data.map(({ name, value1, value2 }) => ({ name: `${Number(name)}月`, value1, value2 })));

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      series: [
        {},
        {
          label: {
            position: [-2, -0],
            formatter: "{box|}",
          },
        },
      ],
    },
  );
}
</script>

<template>
  <div :class="$attrs.class">
    <UiChartBarWithLine
      :data="dataFormat" :legend="[typeText, '同比增长率']" :unit="['Kwh', '%']" color="red"
      :merge-option="mergeOption" />
  </div>
</template>

<style scoped>
</style>
