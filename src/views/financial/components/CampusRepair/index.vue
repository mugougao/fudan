<script setup lang="ts">
import { cn } from "@/utils";
import CampusRepairList from "../CampusRepairList/index.vue";
import RepairOverview from "../RepairOverview/index.vue";

defineOptions({ name: "CampusRepair", inheritAttrs: false });
</script>

<template>
  <div :class="cn('campus-repair', $attrs.class ?? '')">
    <RepairOverview class="row-span-5" />
    <CampusRepairList class="row-span-19" />
  </div>
</template>

<style scoped lang="scss">

</style>
