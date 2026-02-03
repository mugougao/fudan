<script setup lang="tsx">
import type { FunctionalComponent } from "vue";
import get from "lodash/get";
import { cn, numberToThousands } from "@/utils";
import EnergyChargingPilesItem from "../EnergyChargingPiles/EnergyChargingPilesItem.tsx";

defineOptions({ name: "EnergyCampusChargingPiles", inheritAttrs: false });

const { data = {} } = defineProps<{
  data?: any;
}>();

// 点位分布
const showPoi = defineModel<boolean>("showPoi", { default: false });

const EnergyChargingPilesCountTypeRadio: FunctionalComponent<
  { icon: string; value: string; modelValue: string },
  {
    "update:modelValue": (value: string) => void;
  }
> = ({ icon, value, modelValue }, { emit }) => {
  return (
    <label class={cn(
      "cursor-pointer",
      "size-[30px] inline-flex items-center justify-center",
      "border border-white/20 text-white bg-gradient-to-b from-white/10 via-white/30 to-transparent",
      "has-checked:border-[#FF9D9D] has-checked:from-[#DC2F2F]/25 has-checked:via-[#DC2F2F]/75",
    )}
    >
      <input
        class="hidden"
        type="radio"
        name="energy-charging-piles-count-type"
        value={value}
        checked={modelValue === value}
        onChange={() => emit("update:modelValue", value)}
      />
      <i class={`iconfont ${icon} !text-[16px]`}></i>
    </label>
  );
};

const EnergyChargingPilesCountNumber: FunctionalComponent<{
  title: string;
  value: string;
  unit: string;
  type: "red" | "yellow";
}> = ({ title, value, unit, type }) => {
  return (
    <span class="flex flex-col items-center">
      <span class="text-[12px] text-white">{title}</span>
      <span class="text-[#D5FDFF]">
        <span class={cn(
          "mr-1 to-white bg-gradient-to-b bg-clip-text text-[22px] text-transparent font-number",
          type === "red" ? "from-[#FF9D9D]" : "from-[#F7C998]",
        )}
        >
          {numberToThousands(value)}
        </span>
        <span class="text-[12px] text-white">{unit}</span>
      </span>
    </span>
  );
};

const carType = defineModel<string>("carType", { default: "electricBicycle" });

const columnsAll = [
  // 电动车
  { timeType: "年", field: "yearebcumulative" },
  { timeType: "月", field: "monthebcumulative" },
  { timeType: "日", field: "nowebcumulative" },

  { timeType: "年", field: "yearebcumulativeamount" },
  { timeType: "月", field: "monthebcumulativeamount" },
  { timeType: "日", field: "nowebcumulativeamount" },

  // 新能源汽车
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
        <UiSwitch v-model="showPoi">
          <span class="text-[#9E9E9E]">点位分布</span>
        </UiSwitch>
      </template>
    </UiSubTitle>

    <div class="energy-charging-piles-count relative my-2 h-[60px] flex items-center px-2">
      <div class="shrink-0 space-x-2">
        <EnergyChargingPilesCountTypeRadio v-model="carType" icon="icon-ev" value="electricBicycle" />
        <EnergyChargingPilesCountTypeRadio v-model="carType" icon="icon-car" value="newEnergyVehicles" />
      </div>
      <div class="h-full flex flex-auto items-center justify-evenly pt-1.5">
        <EnergyChargingPilesCountNumber type="red" :title="$t('financial.energy.chargingPileChargeTotal')" :value="get(data, carType === 'electricBicycle' ? 'yearebcumulative' : 'yearevcumulative')" unit="万Kwh" />
        <EnergyChargingPilesCountNumber type="yellow" :title="$t('financial.energy.energyStatisticsTotal')" :value="get(data, carType === 'electricBicycle' ? 'yearebcumulativeamount' : 'yearevcumulativeamount')" unit="万元" />
      </div>
    </div>

    <div class="flex gap-5 px-3 pt-2">
      <div class="flex-1">
        <UiThirdTitle class="whitespace-nowrap text-[12px]" :title="carType === 'electricBicycle' ? $t('financial.energy.electricCarChargeTotal') : $t('financial.energy.electricChargeTotal')" />
        <div class="mt-3 space-y-3">
          <EnergyChargingPilesItem
            v-for="({ timeType, field }) in columns.slice(0, 3)" :key="field"
            :timetype="timeType" type="use" :value="get(data, field)" unit="万KWh" icon="icon-flash" />
        </div>
      </div>
      <div class="flex-1">
        <UiThirdTitle class="whitespace-nowrap text-[12px]" :title="$t('financial.energy.totalConsumptionAmount')" />
        <div class="mt-3 space-y-3">
          <EnergyChargingPilesItem
            v-for="({ timeType, field }) in columns.slice(3)" :key="field"
            :timetype="timeType" type="money" :value="get(data, field)" unit="万元" icon="icon-money-cny" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.energy-charging-piles-count {
  background:
    linear-gradient(to right, rgba(#ffe5e5, 0.5), rgba(#ffe5e5, 0.5)) no-repeat left top / 2px 2px,
    linear-gradient(to right, rgba(#ffe5e5, 0.5), rgba(#ffe5e5, 0.5)) no-repeat left bottom / 2px 2px,
    linear-gradient(to right, rgba(#ffe5e5, 0.5), rgba(#ffe5e5, 0.5)) no-repeat right top / 2px 2px,
    linear-gradient(to right, rgba(#ffe5e5, 0.5), rgba(#ffe5e5, 0.5)) no-repeat right bottom / 2px 2px,
    linear-gradient(to right, rgba(#fff3f3, 0.5), rgba(#fff3f3, 0.5)) no-repeat left top / 100% 2px,
    linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left bottom / 100% 2px,
    linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left top / 2px 100%,
    linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat right top / 2px 100%,
    rgba(#000a17, 0.3);

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
    width: calc(100% - 100px);
    height: 2px;
    background:
      linear-gradient(to right, #ffe5e5, #ffe5e5) no-repeat left center / 4px 2px,
      linear-gradient(to right, #ffe5e5, #ffe5e5) no-repeat right center / 4px 2px,
      linear-gradient(to right, rgba(#ffe5e5, 0.6), rgba(#ffe5e5, 0.6)) no-repeat right center / 100% 1px;
  }
}
</style>
