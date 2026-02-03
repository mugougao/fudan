<script setup lang="ts">
const { count = 0, list = [] } = defineProps<{
  count?: number;
  list?: any[];
}>();
</script>

<template>
  <div class="flex flex-col">
    <UiSubTitle title-path="dormitory.room.monthUsePowerInfo" class="shrink-0" />

    <UiCountItemStrip icon="i-svg-icon-bolt" :name="$t('dormitory.room.monthUsePowerInfo')" :value="count" unit="kWh" type="yellow" />

    <div class="flex-auto overflow-hidden">
      <UiChartLine :data="list" :legend="['购电量']" unit="kWh" color="yellow" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
