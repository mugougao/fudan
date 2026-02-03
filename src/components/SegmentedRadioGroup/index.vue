<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "SegmentedRadioGroup", inheritAttrs: false });

const { options } = defineProps<ISegmentedProps>();

interface ISegmentedProps {
  options: { label: string; value: string | number }[];
}
const modelValue = defineModel<string | number>("modelValue", { default: "" });
</script>

<template>
  <div :class="cn('segmented-radio-group flex items-center gap-2 text-[12px]', $attrs.class ?? '')">
    <label
      v-for="({ label, value }) in options" :key="value"
      class="flex cursor-pointer items-center">
      <span class="icon mr-1 size-[10px] flex-center border" :class="modelValue === value && 'border-[#CC1A1A]'">
        <span v-show="modelValue === value" class="block size-[4px] bg-[#CC1A1A]" />
        <input v-model="modelValue" type="radio" :value="value" name="type" class="hidden">
      </span>
      <span class="font-text-medium" :class="modelValue !== value ? 'text-[#9E9E9E]' : 'text-white'">
        {{ label }}
      </span>
    </label>
  </div>
</template>

<style scoped lang="scss">

</style>
