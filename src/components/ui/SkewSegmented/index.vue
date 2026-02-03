<script setup lang="ts">
defineOptions({ name: "SkewSegmented", inheritAttrs: false });

const { options } = defineProps<ISegmentedProps>();

interface ISegmentedProps {
  options: { label: string; value: string | number }[];
}
const modelValue = defineModel<string | number>("modelValue", { default: "" });
</script>

<template>
  <ul class="skew-segmented inline-flex items-center bg-[#7C4D4D]/40 text-white/60 -skew-x-40" :class="$attrs.class">
    <li
      v-for="({ label, value }) in options" :key="value"
      class="skew-segmented-item flex cursor-pointer items-center justify-center px-5 py-1 text-[14px] leading-none"
      :class=" modelValue === value
        ? 'text-white bg-[#20566C]/20 border border-[#CC1A1A] bg-gradient-to-b from-[#DC2F2F]/20  via-[#C62323]/70 to-transparent'
        : 'hover:bg-[#20566C]/20 border border-transparent'"
      @click="modelValue = value">
      <span class="skew-x-40">{{ label }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">

</style>
