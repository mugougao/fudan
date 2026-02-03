<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CampusEnergyConsumptionChain from "../CampusEnergyConsumptionChain/index.vue";
import CampusEnergyConsumptionCount from "../CampusEnergyConsumptionCount/index.vue";
import CampusEnergyConsumptionTrend from "../CampusEnergyConsumptionTrend/index.vue";

defineOptions({ name: "CampusEnergyConsumption" });

const {
  energyUseData = {
    regionStatistics: { count: 0, data: [] },
    monthStatistics: [],
    chainStatistics: [],
  },
  energyPurchaseData = {
    regionStatistics: { count: 0, data: [] },
    monthStatistics: [],
    chainStatistics: [],
  },
} = defineProps<{
  energyUseData: IData;
  energyPurchaseData: IData;
}>();

const { t } = useI18n();

interface IData {
  regionStatistics: {
    count: number;
    data: { name: string; value: number }[];
  };
  monthStatistics: { name: string; value1: number; value2: number }[];
  chainStatistics: { name: string; value1: number; value2: number }[];
}

const type = ref<"1" | "2">("1");
const options2 = computed(() => [
  { label: t("dormitory.campus.buyPower"), value: "1" },
  { label: t("dormitory.campus.usePower"), value: "2" },
]);

const data = computed<IData>(() => type.value === "1" ? energyPurchaseData : energyUseData);
</script>

<template>
  <UiBoxPanel
    title-path="dormitory.campus.campusEnergyConsumption"
    class="row-span-17"
    content-class-name="flex flex-col overflow-hidden">
    <div class="mb-2 shrink-0 text-center">
      <!-- <TabNavExtra v-model="type" :options="options2" /> -->
      <UiSkewSegmented v-model="type" :options="options2" />
    </div>
    <CampusEnergyConsumptionCount class="flex-1 overflow-hidden" :type="type" :count="data?.regionStatistics?.count" :data="data?.regionStatistics?.data" />
    <CampusEnergyConsumptionTrend class="flex-1 overflow-hidden" :type="type" :data="data.monthStatistics" />
    <CampusEnergyConsumptionChain class="flex-1 overflow-hidden" :type="type" :data="data.chainStatistics" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
