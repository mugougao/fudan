<script setup lang="ts">
defineOptions({ name: "Slider", inheritAttrs: false });

const { min = 0, max = 120 } = defineProps<{
  min?: number;
  max?: number;
}>();

const modelValue = defineModel("modelValue", { default: 0 });
</script>

<template>
  <div class="slider">
    <ASlider v-model:value="modelValue" :min="min" :max="max" :step="1" :tooltip-open="false" />
  </div>
</template>

<style scoped lang="scss">
.slider {
  :deep(.ant-slider) {
    margin: 0px 5px;
    .ant-slider-rail {
      border: 1px #cc1a1a solid;
      background-color: rgba(#cc1a1a, 0.6);
      border-radius: 0px;
    }
    .ant-slider-track {
      border: 1px #ffffff solid;
      background-color: rgba(#ffffff, 0.6);
      border-radius: 0px;
    }
    .ant-slider-handle {
      width: 5px;

      &::after {
        background: linear-gradient(to bottom, transparent, #fff, transparent);
        width: 5px;
        border-radius: 0px;
        box-shadow: none;
      }
    }
  }
}
</style>
