<script setup lang="ts">
import PropertyFee from "../PropertyFee/index.vue";
import PropertyOverview from "../PropertyOverview/index.vue";
import PropertySecurityFee from "../PropertySecurityFee/index.vue";

defineOptions({ name: "Property", inheritAttrs: false });
</script>

<template>
  <UiBoxPanel title-path="financial.index.overview" class="row-span-18" content-class-name="grid grid-cols-1 grid-rows-24">
    <PropertyOverview class="row-span-6" />
    <PropertySecurityFee class="row-span-9" />
    <PropertyFee class="row-span-9" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
