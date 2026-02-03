<script setup lang="ts">
defineOptions({ name: "RoomLegend" });

const legend = [
  { title: "空置房间", color: "#5EA778" },
  { title: "空置床位房间", color: "#AEA872" },
  { title: "住满房间", color: "#A5242E" },
];
</script>

<template>
  <ul class="room-legend ml-10 inline-block inline-flex items-center bg-black/50 px-3 py-1 py-2 space-x-5">
    <li
      v-for="({ title, color }) in legend" :key="title"
      class="flex items-center text-20px leading-none">
      <span class="mr-2 inline-block wh-16px" :style="{ backgroundColor: color } " />
      <span>{{ title }}</span>
    </li>
  </ul>
</template>

<style scoped>

</style>
