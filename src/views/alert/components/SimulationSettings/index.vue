<script setup lang="ts">
import type { IStepKeys } from "../SimulationSettingsSteps/index.vue";
import PlanPopup from "../PlanPopup/index.vue";
import SetupAccidentPoint from "../SetupAccidentPoint/index.vue";
import SetupChannelStatus from "../SetupChannelStatus/index.vue";
import SetupObstacle from "../SetupObstacle/index.vue";
import SetupScene from "../SetupScene/index.vue";
import SimulationSettingsFloorSelect from "../SimulationSettingsFloorSelect/index.vue";
import SimulationSettingsSteps from "../SimulationSettingsSteps/index.vue";

defineOptions({ name: "SimulationSettings", inheritAttrs: false });

const step = ref<IStepKeys>("scene");
const floor = ref<string>("1");

const componentMap = {
  scene: SetupScene,
  obstacle: SetupObstacle,
  channelStatus: SetupChannelStatus,
  accidentPoint: SetupAccidentPoint,
};
//
const rigthComponent = computed(() => {
  if (step.value === "plan") {
    return SetupAccidentPoint;
  }
  return componentMap[step.value];
});

const showPlanPopup = computed({
  get: () => step.value === "plan",
  set: (value) => {
    if (!value) step.value = "accidentPoint";
    else step.value = "plan";
  },
});
</script>

<template>
  <UiViewPanel>
    <template #left>
      <div class="pointer-events-none row-span-full flex flex-col items-start gap-15px children:pointer-events-auto">
        <SimulationSettingsSteps v-model:step="step" />
        <SimulationSettingsFloorSelect v-model:floor="floor" />
      </div>
    </template>
    <template #right>
      <Component :is="rigthComponent" />
    </template>

    <PlanPopup v-model:visible="showPlanPopup" />
  </UiViewPanel>
</template>

<style scoped lang="scss">
</style>
