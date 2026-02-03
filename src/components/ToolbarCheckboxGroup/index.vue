<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "ToolbarCheckboxGroup", inheritAttrs: false });

const { options } = defineProps<{
  options?: { label: string; value: string | number; icon: string }[];
}>();

const modelValue = defineModel<(string | number)[]>("modelValue", { default: [] });
function setModelValue(val: (string | number)[]) {
  modelValue.value = val;
}
provide("groupModelValue", modelValue);
provide("setGroupModelValue", setModelValue);
</script>

<template>
  <div :class="cn('toolbar-checkbox-group flex flex-col gap-1', $attrs.class ?? '')">
    <template v-if="options && options.length">
      <ToolbarCheckboxItem
        v-for="({ label, icon, value }) in options" :key="value"
        :label="label" :icon="icon" :value="value" />
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>
