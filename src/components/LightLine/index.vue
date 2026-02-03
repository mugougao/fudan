<script setup lang="ts">
defineOptions({ name: "LightLine" });

const { color = "#fff", type = "horizontal", height = "1px", width = "100%" } = defineProps<{
  color?: string;
  type?: "horizontal" | "vertical";
  height?: string;
  width?: string;
}>();
</script>

<template>
  <div
    class="light-line"
    :style="{
      height,
      width,
      background: `linear-gradient(${type === 'horizontal' ? '90deg' : '0deg'}, transparent 0%, ${color} 50%, transparent 100%)`,
    }" />
</template>

<style scoped>
</style>
