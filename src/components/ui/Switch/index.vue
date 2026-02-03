<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "UiSwitch", inheritAttrs: true });

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
    <span v-if="$slots.default" class="mr-2 text-[12px]">
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
    display: inline-block;
    width: 52px;
    height: 10px;
    background-color: rgba(#6a2525, 0.4);
    border: 2px #927575 solid;
    border-radius: 10px;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      border-radius: 10px;
      background: #9e9e9e;
      box-shadow: 0px 2.64px 9.9px 0px rgba(0, 0, 0, 0.25);
      transition: all 0.3s ease-in-out;
    }
  }
  &:has(input:checked) {
    span.switch {
      border-color: #ce4242;
      background: rgba(#ce4242, 0.4);
      &:before {
        left: 32px;
        background: #fff;
      }
    }
  }
}
</style>
