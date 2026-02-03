<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "CustomSwitch", inheritAttrs: true });

const props = defineProps<{
  value?: string | number;
}>();

const emits = defineEmits<{
  change: [value: boolean | (string | number)[]];
}>();

const modelValue = defineModel<boolean | (string | number)[]>("modelValue", { default: false });

function handlerChange() {
  emits("change", modelValue.value);
}
</script>

<template>
  <label class="custom-switch cursor-pointer" :class="cn('flex items-center', $attrs.class || '')">
    <span v-if="$slots.default" class="mr-2 text-16px">
      <slot />
    </span>
    <input v-if="props.value == null" v-model="modelValue" type="checkbox" class="hidden" @change="handlerChange">
    <input
      v-else v-model="modelValue" type="checkbox" class="hidden" :value="props.value"
      @change="handlerChange">
    <span class="switch" />
  </label>
</template>

<style scoped lang="scss">
label.custom-switch {
  span.switch {
    @apply inline-block w-52px h-24px bg-#4E5864 border border-#4D4D4D rounded-full relative;
    box-shadow: inset 0 2px 12px 0 #000000;
    &:before {
      content: "";
      @apply inline-block w-20px h-20px rounded-full top-1px left-1px absolute transition-all;
      background: linear-gradient(125deg, #5a5a5a 0%, #acacac 100%);
    }
  }
  &:has(input:checked) {
    span.switch {
      @apply border-white bg-#FF7B7B;
      box-shadow: inset 0 4px 10px 0 rgba(255, 38, 38, 0.3);
      &:before {
        @apply left-29px;
        background: linear-gradient(225deg, #ffd6d6 0%, #fffcfc 100%);
      }
    }
  }
}
</style>
