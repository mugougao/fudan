<script setup lang="ts">
import { cn } from "@/utils";
import CampusWaterUseList from "../CampusWaterUseList/index.vue";
import WaterUseOverview from "../WaterUseOverview/index.vue";

defineOptions({ name: "CampusWaterUse", inheritAttrs: false });

const { overviewData = {} } = defineProps<{
  overviewData?: Record<string, any>;
}>();
</script>

<template>
  <div :class="cn('campus-water-use', $attrs?.class || '')">
    <WaterUseOverview class="row-span-11" :data="overviewData" />
    <CampusWaterUseList class="row-span-13" />
  </div>
</template>

<style scoped lang="scss">

</style>
