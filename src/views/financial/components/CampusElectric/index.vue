<script setup lang="ts">
import { cn } from "@/utils";
import CampusElectricList from "../CampusElectricList/index.vue";
import ElectricOverview from "../ElectricOverview/index.vue";

defineOptions({ name: "CampusElectric", inheritAttrs: false });

const { overviewData = {} } = defineProps<{
  overviewData?: Record<string, any>;
}>();
</script>

<template>
  <div :class="cn('campus-electric', $attrs?.class || '')">
    <ElectricOverview class="row-span-11" :data="overviewData" />
    <!--    <CampusElectricUseType class="row-span-6" /> -->
    <CampusElectricList class="row-span-13" />
  </div>
</template>

<style scoped lang="scss">

</style>
