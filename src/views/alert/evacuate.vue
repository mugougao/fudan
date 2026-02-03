<script setup lang="ts">
import { useState } from "@/hooks";
import AddCasePopup from "./components/AddCasePopup/index.vue";
import ListlationCaseList from "./components/ListlationCaseList/index.vue";
import SimulationSettings from "./components/SimulationSettings/index.vue";

const [showAddCasePopup, setShowAddCasePopup] = useState(false);
const [showSimulationSettings, setShowSimulationSettings] = useState(true);

const planBaseInfo = ref({
  name: "方案1",
  startTime: "2023-01-01 00:00:00",
  duration: 5,
});

function nextStepHandler(params: any) {
  planBaseInfo.value = params;
  setShowSimulationSettings(true);
}
</script>

<template>
  <UiViewPanel v-if="!showSimulationSettings">
    <template #left>
      <!-- 仿真案例列表 -->
      <ListlationCaseList @add="setShowAddCasePopup(true)" />
    </template>
    <AddCasePopup v-model:visible="showAddCasePopup" @next-step="nextStepHandler" />
  </UiViewPanel>

  <SimulationSettings v-else />
</template>

<style scoped lang="scss">
</style>
