<script setup lang="ts">
import occupancyRateDistributionLayer from "@/utils/WdpMap/lifeServices/OccupancyRateDistributionLayer.ts";

defineOptions({ name: "LegendBox" });
//

const legendList = occupancyRateDistributionLayer.standardMap;
</script>

<template>
  <section class="legend-box absolute bottom-0 left-5 inline-block">
    <LegendPanel>
      <div class="p-3 space-y-3">
        <LegendPanelItem
          v-for="({ name, color }) in legendList" :key="color"
          :color="`#${color}`" :text="name" />
      </div>
    </LegendPanel>
  </section>
</template>

<style scoped lang="scss">
</style>
