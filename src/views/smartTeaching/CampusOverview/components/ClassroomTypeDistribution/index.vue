<script setup lang="ts">
defineOptions({ name: "ClassroomTypeDistribution", inheritAttrs: false });

const { data } = defineProps<{
  data: { name: string; value: number }[];
}>();
</script>

<template>
  <div class="row-span-9 flex flex-col">
    <UiSubTitle title-path="smartsTeaching.classroomTypeDistribution" />
    <div class="flex-auto overflow-hidden">
      <UiChartPie :data="data" series-name="设备数量" title="总教室数" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
