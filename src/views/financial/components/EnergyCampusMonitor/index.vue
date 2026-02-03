<script setup lang="ts">
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

defineOptions({ name: "EnergyCampusMonitor", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string;water: number;elect: number }[];
}>();
const { t } = useI18n();
const type = ref<"electricity" | "water">("electricity");
const typeOptions = computed(() => [
  { label: t("financial.energy.energy"), value: "electricity" },
  { label: t("financial.energy.water"), value: "water" },
]);

const timeType = defineModel<"day" | "month">("timeType", { default: "day" });
const timeTypeOptions = [
  { label: "日", value: "day" },
  { label: "月", value: "month" },
];

const chartData = computed(() => data.map(
  ({ name, water, elect }) => ({
    name: dayjs(name).format(timeType.value === "day" ? "M/D" : "M月"),
    value: type.value === "electricity" ? elect : water,
  }),
));

const unit = computed(() => type.value === "electricity" ? "万Kwh" : "万m³");
const name = computed(() => type.value === "electricity" ? "用电量" : "用水量");
</script>

<template>
  <UiBoxPanel title-path="financial.energy.energyMonitoring" class="row-span-8" content-class-name="h-full flex flex-col">
    <div class="flex shrink-0 items-center">
      <UiSkewSegmented v-model="type" :options="typeOptions" class="ml-auto" />
      <SegmentedRadioGroup v-model="timeType" :options="timeTypeOptions" class="ml-5" />
    </div>

    <div class="flex-auto overflow-hidden">
      <UiChartBar :data="chartData" :legend="name" :unit="unit" :size="5" color="yellow" />
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss"></style>
