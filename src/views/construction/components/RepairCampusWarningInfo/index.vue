<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "RepairCampusWarningInfo", inheritAttrs: false });
</script>

<template>
  <div :class="cn('repair-campus-warning-info', $attrs.class ?? '')">
    <UiSubTitle title-path="construction.repair.earlyWarn" />
    <UiCountItemStrip icon="i-svg-icon-warning" name="超期预警" value="100" unit="个" class="mt-1" />
  </div>
</template>

<style scoped lang="scss">

</style>
