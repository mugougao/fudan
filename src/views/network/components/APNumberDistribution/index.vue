<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "APNumberDistribution", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: { name: string; value: number }[];
}>();
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.campusAPDistribution" />
    <div class="flex-auto overflow-hidden pt-1">
      <UiChartBar :data="data" legend="AP数量" unit="个" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
