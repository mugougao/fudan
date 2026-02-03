<script setup lang="ts">
defineOptions({ name: "LegendPanelItem", inheritAttrs: false });

const { color, text } = defineProps<{
  color: string;
  text: string;
}>();
</script>

<template>
  <div class="legend-panel-item flex items-center gap-2" :style="{ '--color': color }">
    <span class="legend-panel-item-icon" />
    <span class="legend-panel-item-text text-[14px] text-white font-text-medium">
      {{ text }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.legend-panel-item {
  .legend-panel-item-icon {
    width: 25px;
    height: 25px;
    display: inline-block;
    position: relative;
    &:before,
    &:after {
      content: "";
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      backdrop-filter: blur(10px);
      position: absolute;
    }
    &:before {
      background: var(--color);
      bottom: 0;
      right: 0;
    }
    &:after {
      background: rgba(#ffffff, 0.1);
      backdrop-filter: blur(10px);
      box-shadow: inset 0 0 6px 0 rgba(#ffffff, 0.6);
      top: 0;
      left: 0;
    }
  }
}
</style>
