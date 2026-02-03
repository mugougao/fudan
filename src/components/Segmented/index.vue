<script setup lang="ts">
defineOptions({ name: "Segmented", inheritAttrs: false });

const { options } = defineProps<ISegmentedProps>();

interface ISegmentedProps {
  options: { label: string; value: string | number }[];
}
const modelValue = defineModel<string | number>("modelValue", { default: "" });
</script>

<template>
  <ul class="segmented flex items-center gap-x-1 rounded bg-[#767676]/10 p-1 text-[14px] text-[#9E9E9E]">
    <li
      v-for="({ label, value }) in options" :key="value"
      class="segmented-item flex cursor-pointer items-center justify-center rounded px-1.5 py-1 leading-none"
      :class=" modelValue === value ? 'text-white bg-[#20566C]/20 border border-[#20566C]' : 'hover:bg-[#20566C]/20 border border-transparent'"
      @click="modelValue = value">
      {{ label }}
    </li>
  </ul>
</template>

<style scoped lang="scss">

</style>
