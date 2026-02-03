<script setup lang="tsx">
import { round } from "lodash";
import { cn } from "@/utils";

defineOptions({ name: "EnergyConsumptionStatistics", inheritAttrs: false });

const { water, electricity } = defineProps<{
  water: {
    yearOverYear: number;
    year: number;
    lastYear: number;
  };
  electricity: {
    yearOverYear: number;
    year: number;
    lastYear: number;
  };
}>();

function Instrument({ title, value }: { title: string; value: string | number }) {
  return (
    <div class="instrument size-[120px] flex flex-col shrink-0 items-center justify-center">
      <span>
        <span class="text-[24px] font-number">{value}</span>
        <span class="text-[12px]">%</span>
      </span>
      <i class="i-ri-arrow-up-s-fill -my-1.5"></i>
      <span class="block w-[4em] text-center text-[14px] leading-none">{title}</span>
    </div>
  );
}

function BarItem({ label, value, unit, progress, color }: { label: string;value: string | number;unit: string; progress: number;color: "red" | "yellow" }) {
  return (
    <div>
      <div class="flex items-center justify-between text-white/90">
        <span class="whitespace-nowrap text-[14px]">{label}</span>
        <span>
          <span class="text-[20px] font-number">{value}</span>
          <span class="ml-1 text-[12px] text-white/60">{unit}</span>
        </span>
      </div>
      <div class="h-[4px] w-full bg-[#E1E1E1]/10">
        <div
          class={cn("relative h-full bg-gradient-to-r border", color === "red" ? "from-[#CC1A1A]/10 to-[#CC1A1A]/70 border-[#CE7A7A]" : "from-[#FFCE9B]/10 to-[#FFCE9B]/70 border-[#EABC8B]")}
          style={{ width: `${progress}%` }}
        >
          <span class={cn("absolute right-[-5px] top-1/2 block size-[10px] rounded-full backdrop-blur -translate-y-1/2", color === "red" ? "bg-[#FFD5D5]" : "bg-[#FFEEDB]")}></span>
        </div>
      </div>
    </div>
  );
}

const electricityProgress = computed(() => {
  const { year, lastYear } = electricity;
  const total = year + lastYear;
  const yearProgress = total ? round(year / total * 100) : 0;
  return [
    yearProgress,
    100 - yearProgress,
  ];
});

const waterProgress = computed(() => {
  const { year, lastYear } = water;
  const total = year + lastYear;
  const yearProgress = total ? round(year / total * 100) : 0;
  return [
    yearProgress,
    100 - yearProgress,
  ];
});
</script>

<template>
  <div :class="cn('energy-consumption-statistics flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.energyStatistics" />

    <div class="count-box mt-2 h-[128px] flex items-center">
      <Instrument :title="$t('overviw.totalSavings')" :value="electricity.yearOverYear" color="#29F1FA" />
      <div class="h-full flex flex-col flex-auto pt-5">
        <BarItem :label="$t('overviw.totalElectricity')" :value="electricity.year" unit="万Kwh" :progress="electricityProgress[0]" color="red" />
        <BarItem :label="$t('overviw.totalElectricityLastYear')" :value="electricity.lastYear" unit="万Kwh" :progress="electricityProgress[1]" color="red" />
      </div>
    </div>

    <div class="count-box h-[128px] flex items-center">
      <Instrument :title="$t('overviw.totalSavings')" :value="water.yearOverYear" color="#1B7EF2" />
      <div class="h-full flex flex-col flex-auto pt-5">
        <BarItem :label="$t('overviw.totalWater')" :value="water.year" unit="万m³" :progress="waterProgress[0]" color="yellow" />
        <BarItem :label="$t('overviw.totalWaterLastYear')" :value="water.lastYear" unit="万m³" :progress="waterProgress[1]" color="yellow" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-box {
  background-image: url("@/assets/images_new/count-bg-6.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &:nth-child(2) {
    background-image: url("@/assets/images_new/count-bg-7.png");
  }
}
</style>
