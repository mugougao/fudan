<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "DeviceNumberStats", inheritAttrs: false });

const { data = [], title, subTitle } = defineProps<{
  data?: { name: string; value: number }[];
  title?: string;
  subTitle?: string;
}>();
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle :title="title" />
    <div class="chart-box flex flex-auto items-center overflow-hidden">
      <UiChartPie :data="data" series-name="设备数量" :title="subTitle" :color="['#F37373', '#F7C998', '#778BF1', '#FFFFFF']" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/pie-bg.png") no-repeat 15px center / 123px 128px;
}
</style>
