<script setup lang="ts">
defineOptions({ name: "Segmented", inheritAttrs: false });

const { options } = defineProps<ISegmentedProps>();

interface ISegmentedProps {
  options: { label: string; value: string | number }[];
}
const modelValue = defineModel<string | number>("modelValue", { default: "" });
</script>

<template>
  <ul class="segmented flex items-center bg-[#7C4D4D]/40 text-white/60">
    <li
      v-for="({ label, value }) in options" :key="value"
      class="segmented-item flex cursor-pointer items-center justify-center px-1 py-0.5 text-[12px] leading-none"
      :class=" modelValue === value
        ? 'text-white bg-[#20566C]/20 border border-[#CC1A1A] bg-gradient-to-b from-[#DC2F2F]/20  via-[#C62323]/70 to-transparent'
        : 'hover:bg-[#20566C]/20 border border-transparent'"
      @click="modelValue = value">
      {{ label }}
    </li>
  </ul>
</template>

<style scoped lang="scss">

</style>
