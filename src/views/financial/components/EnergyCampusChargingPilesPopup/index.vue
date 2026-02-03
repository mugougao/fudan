<script setup lang="ts">
import dayjs from "dayjs";
import { merge } from "lodash";
import useChargingPilesDetail from "@/composables/financial/useChargingPilesDetail.ts";
import BaseInfoItem from "./BaseInfoItem.vue";
import ChargingPilesList from "./ChargingPilesList.vue";
import DetailCard from "./DetailCard.vue";

defineOptions({ name: "EnergyCampusChargingPilesPopup", inheritAttrs: false });

const { id, title } = defineProps<{
  id?: string;
  title?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const visible = defineModel<boolean>("visible", { default: false });

const areaId = ref<string | undefined>(undefined);
const chargingPileId = ref<string | undefined>(undefined);
const areaTimeType = ref<"day" | "month">("day");
const timeType = ref<"day" | "month">("day");

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      if (!id) return;
      areaId.value = id;
    }
    else {
      emit("close");
      areaId.value = undefined;
      chargingPileId.value = undefined;
      areaTimeType.value = "day";
      timeType.value = "day";
    }
  },
);

const {
  chargingPileAreaYearStatisticsState,
  chargingPileAreaDayMonthStatisticsState,
  chargingPileChargeYearStatisticsState,
  chargingPileChargeDayMonthStatisticsState,
  chargingPileListState,
} = useChargingPilesDetail(areaId, chargingPileId, areaTimeType, timeType);

const chartTimeType = computed({
  get() {
    return chargingPileId.value ? timeType.value : areaTimeType.value;
  },
  set(value: "day" | "month") {
    if (chargingPileId.value) {
      timeType.value = value;
    }
    else {
      areaTimeType.value = value;
    }
  },
});

const chartData = computed(() => {
  const result: any[] = chargingPileId.value ? chargingPileChargeDayMonthStatisticsState.value : chargingPileAreaDayMonthStatisticsState.value;

  return result.map(({ name, value2 }) => ({
    name: dayjs(name).format(chartTimeType.value === "day" ? "M/D" : "M月"),
    value: value2,
  }));
});
</script>

<template>
  <DragPopup v-model:visible="visible" :title="title" :width="480" left="calc(100% - 840px)" :top="100">
    <UiThirdTitle title="基础信息" />
    <div class="my-2 flex items-center justify-evenly">
      <BaseInfoItem color="red" label="年度充电量" :value="chargingPileAreaYearStatisticsState.value" unit="KWh" />
      <LightLine type="vertical" width="1px" height="40px" color="#fff" />
      <BaseInfoItem color="gray" label="年度充电金额" :value="chargingPileAreaYearStatisticsState.amount" unit="元" />
    </div>
    <UiThirdTitle title="充电明细" />
    <ChargingPilesList v-model:select-id="chargingPileId" :data="chargingPileListState" />

    <div class="mt-5 h-[200px] flex gap-2 px-5">
      <div v-show="chargingPileId" class="flex flex-col items-center justify-evenly">
        <DetailCard color="red" label="年度充电量" :value="chargingPileChargeYearStatisticsState.value" unit="KWh" />
        <DetailCard color="yellow" label="年度充电金额" :value="chargingPileChargeYearStatisticsState.amount" unit="元" />
      </div>
      <div class="relative h-full flex-auto overflow-hidden">
        <SegmentedRadioGroup
          v-model="chartTimeType"
          class="absolute right-0 top-0 z-9"
          :options="[
            { label: '日', value: 'day' },
            { label: '月', value: 'month' },
          ]" />
        <UiChartLine :data="chartData" unit="元" :color="chargingPileId ? 'blue' : 'yellow'" :merge-option="(option) => merge(option, { series: [{ name: '金额' }] })" />
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
