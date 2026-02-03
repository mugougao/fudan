<script setup lang="ts">
const { count = 0, list = [] } = defineProps<{
  count?: number;
  list?: any[];
}>();

const data = computed(() => {
  return list.map(({ name, value, value1 }) => ({ name, value1: value, value2: value1 }));
});
</script>

<template>
  <div class="flex flex-col">
    <UiSubTitle title-path="dormitory.room.monthUsePowerInfo" class="shrink-0" />

    <UiCountItemStrip icon="i-svg-icon-bolt" :name="$t('dormitory.room.monthUsePower')" :value="count" unit="kWh" />

    <div class="flex-auto overflow-hidden">
      <UiChartBarWithLine :data="data" :legend="['用电量', '环比率']" :unit="['kWh', '%']" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
