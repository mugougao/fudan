<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "BasicSituation", inheritAttrs: false });
</script>

<template>
  <div :class="cn('basic-situation', $attrs.class ?? '')">
    <UiSubTitle title="基本情况" />
    <div class="flex items-center justify-evenly pt-5">
      <UiCountItem icon="i-svg-icon-raw-microscope" name="仪器设备" value="16" unit="台" />
      <LightLine type="vertical" width="1px" height="40px" />
      <UiCountItem icon="i-svg-icon-raw-device" name="已开放设备" value="6" unit="台" type="yellow" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
