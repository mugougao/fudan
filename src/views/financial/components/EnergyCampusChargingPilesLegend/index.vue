<script setup lang="ts">
import { env } from "@/utils/env.ts";

defineOptions({ name: "EnergyCampusChargingPilesLegend", inheritAttrs: false });

const { carType } = defineProps<{
  carType: string;
}>();
const assetsUrl = env.VITE_HTTP_ASSETS_URL;
const imagePath = (str: string) => `${assetsUrl}/markers${str}`;

const listAll = [
  { label: "高", icon: imagePath("/eBikes_red.png"), iconCar: imagePath("/ev_red.png") },
  { label: "中", icon: imagePath("/eBikes_yellow.png"), iconCar: imagePath("/ev_yellow.png") },
  { label: "低", icon: imagePath("/eBikes_green.png"), iconCar: imagePath("/ev_green.png") },
];
</script>

<template>
  <div class="energy-campus-charging-piles-legend absolute bottom-0 right-5">
    <LegendPanel width="190px">
      <template #title>
        <span>年度充电量<span class="ml-2 text-[12px] text-white/60 font-text">(按排序三等分)</span></span>
      </template>
      <div class="flex justify-between px-5 py-2">
        <div
          v-for="({ label, icon, iconCar }) in listAll" :key="label"
          class="flex flex-col items-center justify-center">
          <img
            :src="carType === 'electricBicycle' ? icon : iconCar" :alt="label"
            class="w-[25px]">
          <span>{{ label }}</span>
        </div>
      </div>
    </LegendPanel>
  </div>
</template>

<style scoped lang="scss">

</style>
