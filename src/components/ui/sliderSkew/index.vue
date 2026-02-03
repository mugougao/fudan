<script setup lang="ts">
defineOptions({ name: "SliderSkew", inheritAttrs: false });

const { min = 0, max = 120 } = defineProps<{
  min?: number;
  max?: number;
}>();

const modelValue = defineModel("modelValue", { default: 0 });
</script>

<template>
  <div class="sliderSkew">
    <ASlider v-model:value="modelValue" :min="min" :max="max" :step="1" :tooltip-open="false" />
  </div>
</template>

<style scoped lang="scss">
.sliderSkew {
  :deep(.ant-slider) {
    transform: skewX(-45deg);
    .ant-slider-rail {
      background-color: rgba(#e9a7a7, 0.2);
      border-radius: 0px;
    }
    .ant-slider-track {
      background-color: #d45f5f;
      border-radius: 0px;
    }
    .ant-slider-handle {
      width: 5px;
      &::after {
        width: 5px;
        border-radius: 0px;
        box-shadow: none;
      }
    }
  }
}
</style>
