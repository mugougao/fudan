<script setup lang="ts">
import SetupSceneDataList from "./SetupSceneDataList.vue";
import SetupScenePersonSettings from "./SetupScenePersonSettings.vue";

defineOptions({ name: "SetupScene", inheritAttrs: false });
</script>

<template>
  <div class="grid row-span-full grid-rows-24 gap-5">
    <UiBoxPanel title="自动生成行人组成" class="row-span-11">
      <SetupScenePersonSettings />
    </UiBoxPanel>
    <UiBoxPanel title="数据列表" class="row-span-10">
      <SetupSceneDataList />
    </UiBoxPanel>
  </div>
</template>

<style scoped lang="scss">
</style>
