<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "BoxRadioGroup", inheritAttrs: false });

const { name, options } = defineProps<{
  options: { label: string;value: string | number }[];
  name?: string;
}>();

const modelValue = defineModel<string | number>("modelValue", { default: undefined });
</script>

<template>
  <div
    :class="cn(
      'box-radio-group',
      'flex flex-col bg-[#797979]/20 border border-[#4A4A4A] rounded-lg backdrop-blur p-2 gap-2',
      $attrs.class ?? '',
    )">
    <label
      v-for="{ label, value } in options" :key="value"
      class="box-radio-group-item inline-block size-[36px] flex cursor-pointer items-center justify-center">
      <input v-model="modelValue" type="radio" :name="name" :value="value" class="absolute hidden">
      <span class="box-radio-group-label size-[26px] flex items-center justify-center text-[#C2E1FF] font-text-medium">{{ label }}</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.box-radio-group {
  .box-radio-group-item {
    --out-border-color: #4e6b7f;
    --in-border-color: #6f7f8b;
    --background-color: #556f7880;
    border: 1px solid var(--out-border-color);
    .box-radio-group-label {
      background:
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat top left / 4px 1px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat top right / 4px 1px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat bottom left / 4px 1px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat bottom right / 4px 1px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat top left / 1px 4px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat top right / 1px 4px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat bottom left / 1px 4px,
        linear-gradient(90deg, var(--in-border-color) 0%, var(--in-border-color) 100%) no-repeat bottom right / 1px 4px,
        var(--background-color);
    }

    &:has(input:checked) {
      --out-border-color: #03d1e8;
      --in-border-color: #a0e7ff;
      --background-color: #556f7880;
    }
  }
}
</style>
