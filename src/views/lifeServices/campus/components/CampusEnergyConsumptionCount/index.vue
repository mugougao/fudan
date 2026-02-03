<script setup lang="ts">
defineOptions({ name: "CampusEnergyConsumptionCount", inheritAttrs: false });

const { type = "1", count = 0, data = [] } = defineProps<{
  type: "1" | "2"; // 1: 购电，2：用电
  count?: number;
  data?: { name: string; value: number }[];
}>();

const unit = "kWh";
const typeLabel = computed(() => type === "1" ? "购电" : "用电");
// const title = computed(() => `${type === "1" ? "本月" : "昨日"}${typeLabel.value}`);
const title = computed(() => `昨日${typeLabel.value}`);

const countNumberFormat = computed<string>(() => {
  const _countNumber = count.toString();
  if (_countNumber.length < 4) {
    const span = Array.from({ length: 4 - _countNumber.length }).fill(0).join("");
    return `${span}${_countNumber}`;
  }
  return _countNumber;
}); // electricity
</script>

<template>
  <div class="campus-energy-consumption-count flex flex-col" :class="$attrs.class">
    <div class="today flex-center shrink-0 whitespace-nowrap">
      <span class="text-[14px] text-white">{{ title }}:</span>
      <span
        v-for="(num, index) in countNumberFormat" :key="`${num}-${index}`"
        class="number-span ml-1 h-[32px] w-[24px] flex-center">
        <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[28px] text-transparent font-number">{{ num }}</span>
      </span>
      <span class="ml-1 text-[12px] text-white/60">{{ unit }}</span>
    </div>
    <div class="area-list grid grid-cols-2 grid-rows-2 flex-auto gap-x-1 gap-y-0.5 overflow-hidden pt-1">
      <UiCountItemBox
        v-for="({ name, value }, index) in data" :key="index"
        icon="i-svg-icon-bolt" :icon-text="name" :name="`${name}${typeLabel}`" :value="value" :unit="unit"
        value-vertical />
    </div>
  </div>
</template>

<style scoped>
.today span.number-span {
  background: linear-gradient(0deg, rgba(204, 26, 26, 0.06) 0%, rgba(204, 26, 26, 0.6) 100%);
  border: 1px solid rgba(192, 220, 231, 0.3);
}
</style>
