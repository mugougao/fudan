<script setup lang="ts">
import { cn } from "@/utils";
import CampusPropertyList from "../CampusPropertyList/index.vue";
import PropertyOverview from "../PropertyOverview/index.vue";

defineOptions({ name: "CampusProperty", inheritAttrs: false });
</script>

<template>
  <div :class="cn('campus-property', $attrs.class ?? '')">
    <PropertyOverview class="row-span-4" />
    <CampusPropertyList class="row-span-20" />
  </div>
</template>

<style scoped lang="scss">

</style>
