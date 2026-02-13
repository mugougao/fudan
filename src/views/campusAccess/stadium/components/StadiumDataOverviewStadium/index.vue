<script setup lang="ts">
// import to from "await-to-js";
// import { fetchSwimmingPoolUsageRate7Days } from "@/api/campusAccess/stadium";

// 硬编码游泳馆近七天人数数据
const state = ref<{ name: string; value: number }[]>([
  { name: "周一", value: 156 },
  { name: "周二", value: 142 },
  { name: "周三", value: 178 },
  { name: "周四", value: 165 },
  { name: "周五", value: 201 },
  { name: "周六", value: 234 },
  { name: "周日", value: 198 },
]);
</script>

<template>
  <div class="h-full w-full">
    <UiChartBar :data="state" legend="人数" unit="人" />
  </div>
</template>

<style scoped>

</style>
