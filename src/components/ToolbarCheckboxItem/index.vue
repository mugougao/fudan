<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "ToolbarCheckboxItem", inheritAttrs: false });

const { label, icon, value, name, checkedValue = true, unCheckedValue = false } = defineProps<{
  label: string;
  name?: string;
  checkedValue?: string | number | boolean;
  unCheckedValue?: string | number | boolean;
  // group 下使用
  value?: string | number | boolean;
  icon: string;
}>();

const emit = defineEmits<{
  change: [value: string | number | boolean];
}>();

const groupModelValue = inject<Ref<(string | number)[]> | undefined>("groupModelValue", undefined);
const setGroupModelValue = inject<((val: (string | number)[]) => void) | undefined>("setGroupModelValue", undefined);
const isGroup = computed(() => toValue(groupModelValue) !== undefined);

const modelValue = defineModel<string | number | boolean>("modelValue", { default: false });

const model = computed({
  get(): (string | number)[] | string | number | boolean {
    if (isGroup.value) {
      return toValue(groupModelValue) ?? [];
    }
    return modelValue.value;
  },
  set(val: string | number | boolean | (string | number)[]) {
    if (isGroup.value && Array.isArray(toValue(groupModelValue))) {
      setGroupModelValue && setGroupModelValue(val as (string | number)[]);
    }
    else {
      modelValue.value = val as (string | number | boolean);
      emit("change", val as (string | number | boolean));
    }
  },
});

const isChecked = computed(() => {
  if (isGroup.value) {
    return toValue(groupModelValue)?.includes(value as string | number);
  }
  return toValue(modelValue) === toValue(checkedValue);
});

function handleChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (isGroup.value) {
    const values = checked
      ? [...(toValue(groupModelValue) ?? []), toValue(value)]
      : toValue(groupModelValue)?.filter(item => item !== toValue(value));
    model.value = Array.from(new Set(values)) as (string | number)[];
  }
  else {
    model.value = checked ? toValue(checkedValue) : toValue(unCheckedValue);
  }
}

// 'peer-checked:bg-gradient-to-b peer-checked:from-[#FFFFFF] peer-checked:to-[#2FE0FF]',
</script>

<template>
  <label
    :class="cn(
      'toolbar-checkbox-item group relative inline-block h-[65px] w-[52px] cursor-pointer select-none',
      $attrs.class || '',
    )">
    <input
      :checked="isChecked" type="checkbox" :name="name" :value="value"
      class="peer hidden" @change="handleChange">
    <span class="toolbar-checkbox-item-backpanel-bg absolute left-[3px] top-[4px] inline-block size-[45px] rounded-full" />
    <span
      :class="cn(
        'toolbar-checkbox-item-backpanel relative',
        'inline-flex items-center justify-center size-[52px] text-[42px] text-[#A9A9A9]',
        'group-hover:text-white',
        'peer-checked:[&>i]:bg-white',
      )">
      <i class="i-svg-network-icon-bg" />
    </span>
    <span
      :class="cn(
        icon,
        'inline-block text-[16px] bg-[#969696] group-hover:bg-white',
        'absolute left-1/2 top-[26px] -translate-x-1/2 -translate-y-1/2',
        // 'peer-checked:bg-[linear-gradient(180deg,#ffffff_0%,#2fffe7_40%,#2fe0ff_70%,rgba(118,184,195,0.8)_100%)]',
        'peer-checked:bg-white',
      )" />
    <span
      :class="cn(
        'relative z-9 block text-center flex items-center justify-center -mt-4',
        'text-[#E3E3E3] text-[14px] font-text-medium group-hover:peer-not-checked:text-white',
        'leading-none',
      )">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
.toolbar-checkbox-item {
  .toolbar-checkbox-item-backpanel {
    mask: linear-gradient(to bottom, #000000 0%, rgba(#000000, 0.2) 130%);
  }
  .toolbar-checkbox-item-backpanel-bg {
    background: radial-gradient(50% 50%, rgba(#000000, 1), rgba(#000000, 0.2) 150%);
    backdrop-filter: blur(4px);
    mask: linear-gradient(to bottom, #000000 0%, rgba(#000000, 0.2) 150%);
  }
  &:has(input:checked) {
    .toolbar-checkbox-item-backpanel-bg {
      background: linear-gradient(to bottom, #cc1a1a, rgba(#000, 0.3) 150%);
    }
  }
}
</style>
