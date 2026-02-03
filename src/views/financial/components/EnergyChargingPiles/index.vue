<script setup lang="tsx">
import get from "lodash/get";
import { useI18n } from "vue-i18n";
import { cn } from "@/utils";
import EnergyChargingPilesItem from "./EnergyChargingPilesItem.tsx";

defineOptions({ name: "EnergyChargingPiles", inheritAttrs: false });

const { data = {} } = defineProps<{
  data?: any;
}>();
const { t } = useI18n();
const carType = ref<"electricBicycle" | "newEnergyVehicles">("electricBicycle");
const carTypeOptions = computed(() =>
  [
    { label: t("financial.energy.electricCar"), value: "electricBicycle" },
    { label: t("financial.energy.newEnergy"), value: "newEnergyVehicles" },
  ],
);

const columnsAll = [
  // 电动车
  { timeType: "年", field: "yearebcumulative" },
  { timeType: "月", field: "monthebcumulative" },
  { timeType: "日", field: "nowebcumulative" },

  { timeType: "年", field: "yearebcumulativeamount" },
  { timeType: "月", field: "monthebcumulativeamount" },
  { timeType: "日", field: "nowebcumulativeamount" },

  // 新能源
  { timeType: "年", field: "yearevcumulative" },
  { timeType: "月", field: "monthevcumulative" },
  { timeType: "日", field: "nowevcumulative" },

  { timeType: "年", field: "yearevcumulativeamount" },
  { timeType: "月", field: "monthevcumulativeamount" },
  { timeType: "日", field: "nowevcumulativeamount" },
] as { timeType: "年" | "月" | "日"; field: string }[];

const columns = computed(() => carType.value === "electricBicycle" ? columnsAll.slice(0, 6) : columnsAll.slice(6));
</script>

<template>
  <div :class="cn('energy-charging-piles', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.energy.chargingPile">
      <template #extra>
        <UiSegmented v-model="carType" :options="carTypeOptions" />
      </template>
    </UiSubTitle>
    <div class="chart-box flex gap-5 px-2">
      <div class="mt-3 flex-1 space-y-4">
        <UiThirdTitle title-path="financial.energy.chargingPileCharge" class="text-[14px]" />
        <EnergyChargingPilesItem
          v-for="({ timeType, field }) in columns.slice(0, 3)" :key="field"
          type="use" :timetype="timeType" :value="get(data, field)" unit="万KWh" icon="icon-flash" />
      </div>
      <div class="mt-3 flex-1 space-y-4">
        <UiThirdTitle title-path="financial.energy.chargingPileChargeAmount" class="text-[14px]" />
        <EnergyChargingPilesItem
          v-for="({ timeType, field }) in columns.slice(3)" :key="field"
          type="money" :timetype="timeType" :value="get(data, field)" unit="万元" icon="icon-flash" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat center / 1px calc(100% - 40px);
}
</style>
