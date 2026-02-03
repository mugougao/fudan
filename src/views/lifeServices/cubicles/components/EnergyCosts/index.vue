<script setup lang="ts">
import { get } from "lodash";
import EnergyCostsMothElectronic from "@/views/lifeServices/cubicles/components/EnergyCostsMothElectronic/index.vue";
import EnergyCostsYearlyFlashy from "@/views/lifeServices/cubicles/components/EnergyCostsYearlyFlashy/index.vue";

const {
  yearElectricity = { statistics: { use: 0, purchase: 0 }, list: [] },
  monthUseElectricity = { count: 0, list: [] },
  monthPurchaseElectricity = { count: 0, list: [] },
} = defineProps<{
  yearElectricity?: {
    statistics: { use: number; purchase: number };
    list: any[];
  };
  monthUseElectricity?: { count: number; list: any[] };
  monthPurchaseElectricity?: { count: number; list: any[] };
}>();

const countList = [
  { name: "dormitory.room.currentYearUsePower", field: "use", title: "用电" },
  { name: "dormitory.room.currentYearBuyPowerAmount", field: "purchase", title: "购电" },
];
</script>

<template>
  <UiBoxPanel
    title-path="dormitory.room.energyInformation"
    class="row-span-24"
    content-class-name="grid grid-cols-1 grid-rows-12 overflow-hidden">
    <!--  年度能耗信息 -->
    <div class="row-span-4 flex flex-col">
      <UiSubTitle title-path="dormitory.room.yearEnergyInformation" />

      <div class="area-list grid grid-cols-2 grid-rows-1 mt-1 h-[70px] flex-auto gap-x-1.5 gap-y-1.5 overflow-hidden pt-1">
        <UiCountItemBox
          v-for="({ name, field, title }, index) in countList" :key="index"
          icon="i-svg-icon-bolt" :icon-text="title" :name="$t(name)" :value="get(yearElectricity, `statistics.${field}`)" unit="Kwh"
          value-vertical>
          <template #name>
            <span class="text-[12px]">{{ $t(name) }}</span>
          </template>
        </UiCountItemBox>
      </div>

      <div class="flex flex-col flex-auto overflow-hidden">
        <UiChartLine :data="yearElectricity?.list" :legend="['月度用电量']" unit="kWh" color="red" />
      </div>
    </div>

    <!--  当月用电信息 -->
    <EnergyCostsMothElectronic class="row-span-4" :count="monthUseElectricity.count" :list="monthUseElectricity.list" />

    <!--   当月购电信息   -->
    <EnergyCostsYearlyFlashy class="row-span-4" :count="monthPurchaseElectricity.count" :list="monthPurchaseElectricity.list" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
