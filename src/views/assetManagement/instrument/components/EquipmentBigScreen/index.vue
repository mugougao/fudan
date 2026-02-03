<script setup lang="ts">
import imageSrc from "@/assets/images/largeInstrumentMonitoringScreen.png";

defineOptions({ name: "EquipmentBigScreen", inheritAttrs: false });
</script>

<template>
  <UiBoxPanel title-path="largeInstruments.largeInstrumentMonitoringScreen" class="row-span-7">
    <LargeScreenPreview
      :preview-image-src="imageSrc"
      :screen-title="$t('largeInstruments.largeInstrumentMonitoringScreen')"
      screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/f7e0c83d941e4a61b0460bbe1dfb830c/view?entryType=7" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
