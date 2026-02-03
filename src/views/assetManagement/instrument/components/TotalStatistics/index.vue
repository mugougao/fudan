<script setup lang="ts">
import get from "lodash/get";
import { numberToThousands } from "@/utils";

defineOptions({ name: "TotalStatistics" });

const { data } = defineProps<IProps>();

export interface IProps {
  data: { number: number; amount: number };
}

const columns = [
  { icon: "i-svg-icon-equipment", title: "largeInstruments.totalDevices", field: "number", suffix: "台" },
  { icon: "i-svg-icon-money", title: "largeInstruments.totalAmount", field: "amount", suffix: "万元" },
];
</script>

<template>
  <div class="total-statistics row-span-3 flex justify-between overflow-hidden">
    <UiCountItem
      v-for="(item, index) in columns" :key="item.field"
      :icon="item.icon" value-vertical
      :name="$t(item.title)" :value="numberToThousands(get(data, item.field, 0))" :unit="item.suffix" :type="index % 2 ? 'yellow' : 'red'" />
  </div>
</template>

<style scoped lang="scss">
.total-statistics {
  background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat 48% center / 1px 50%;
}
</style>
