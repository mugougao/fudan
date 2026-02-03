<script setup lang="ts">
import { useInjectFormItemContext } from "ant-design-vue/es/form";
import { cn } from "@/utils";

defineOptions({ name: "CustomInputRange", inheritAttrs: false });

const { min = 0, max = 100, trackBackground } = defineProps<{
  min?: number;
  max?: number;
  trackBackground?: (progress: number) => string;
}>();

const emit = defineEmits<{
  change: [value: number];
}>();

const modelValue = defineModel<number>("modelValue", { default: 0 });

const progress = computed(() => {
  const total = [min, max].reduce((prev, curr) => prev += Math.abs(curr), 0);
  return Math.floor(modelValue.value / total * 100);
});

const { onFieldChange, onFieldBlur } = useInjectFormItemContext();

function handleChange() {
  onFieldChange();
  emit("change", modelValue.value);
}

function handleBlur() {
  onFieldBlur();
}
</script>

<template>
  <div class="custom-input-range" :class="cn('flex items-center', $attrs.class ?? '')">
    <slot name="prefix" />
    <div class="flex-auto px-1">
      <input
        v-model="modelValue"
        class="w-full"
        type="range" :min="min" :max="max"
        :style="{
          '--progress': `${progress}%`,
          'background': trackBackground
            ? trackBackground(progress)
            : 'linear-gradient(to right,#ffffff 0%,#73ffff var(--progress),#fff var(--progress),rgba(255, 255, 255, 0.2) var(--progress),rgba(255, 255, 255, 0.2))',
        }"
        @chenge="handleChange" @blur="handleBlur">
    </div>
    <slot name="suffix" />
  </div>
</template>

<style scoped lang="scss">
.custom-input-range {
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    backdrop-filter: blur(10px);
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px;
      height: 16px;
      background: #1d1b33;
      border: 1px solid #73ffff;
      cursor: pointer;
      transform: skewX(-20deg);
    }
  }
}
</style>
