<script setup lang="ts">
import { useInstrumentBuildingDetail } from "@/composables/assetManagement/instrument_etl.ts";
import { useState } from "@/hooks";
import DeviceDetailPopup from "./components/DeviceDetailPopup/index.vue";
import DeviceDistribution from "./components/DeviceDistribution/index.vue";
import NumberOfLargeInstruments from "./components/NumberOfLargeInstruments/index.vue";
import TerminalDetailsPopup from "./components/TerminalDetailsPopup/index.vue";
import UseDirections from "./components/UseDirections/index.vue";

defineOptions({ name: "BuildPopup" });

const { title = "", buildId } = defineProps<{
  title?: string;
  buildId: string ;
}>();

const emits = defineEmits<{
  close: [];
}>();

const visible = defineModel("visible", { default: false });

// TerminalDetailsPopup
const [terminalDetailsPopupVisible, setTerminalDetailsPopupVisible] = useState(false);

// DeviceDetailPopup
const [deviceDetailPopupVisible, setDeviceDetailPopupVisible] = useState(false);

const {
  run,
  largeInstrumentData,
  useDirectionsData,
  deviceDistributionData,
  terminalDeviceDetailData,
  deviceDistributionDetailData,
} = useInstrumentBuildingDetail();

watch(
  () => [visible.value, title],
  () => {
    if (visible.value && title) {
      run(title, buildId);
    }
  },
);
whenever(
  () => !visible.value,
  () => {
    setTerminalDetailsPopupVisible(false);
    setDeviceDetailPopupVisible(false);
  },
);
</script>

<template>
  <DragPopup
    v-model:visible="visible" :title="title" :width="400" :top="200" left="calc(100% - 860px)"
    @close="emits('close')">
    <UiThirdTitle title="大型仪器数" />
    <NumberOfLargeInstruments :data="largeInstrumentData" @details="setTerminalDetailsPopupVisible(true)" />
    <UiThirdTitle title="使用方向" />
    <UseDirections :data="useDirectionsData" />
    <div class="relative">
      <UiThirdTitle title="设备分布" />
      <button
        type="button" class="absolute right-0 top-0 rounded-lg bg-transparent px-1.5 py-0.5 text-12px text-#9E9E9E hover:bg-gray-100/10"
        @click="setDeviceDetailPopupVisible(true)">
        详情
      </button>
    </div>
    <DeviceDistribution :data="deviceDistributionData" />
  </DragPopup>
  <TerminalDetailsPopup v-model:visible="terminalDetailsPopupVisible" :data="terminalDeviceDetailData" />
  <DeviceDetailPopup v-model:visible="deviceDetailPopupVisible" :data="deviceDistributionDetailData" />
</template>

<style scoped>
</style>
