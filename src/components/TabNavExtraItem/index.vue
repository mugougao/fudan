<script setup lang="ts">
defineOptions({ name: "TabNavExtraItem" });

const props = defineProps<{
  disabledUpdate?: boolean;
}>();

const emit = defineEmits<{
  change: [checked: boolean];
}>();

const checked = defineModel("modelValue", { default: false });

watch(
  () => checked.value,
  (val) => {
    emit("change", val);
  },
);
</script>

<template>
  <label
    :class="[checked ? 'active text-white' : 'text-#A5A5A5 hover:text-white']"
    class="tab-nav-extra-item relative h-32px flex-center cursor-pointer select-none px-4 text-16px"
    @click="
      () => {
        if (disabledUpdate) return;
        checked = !checked
      }
    ">
    <span class="tab-nav-extra-item-content">
      <slot />
    </span>
  </label>
</template>

<style scoped lang="scss">
.tab-nav-extra-item {
  @apply -skew-x-30;
  &:after {
    content: "";
    @apply absolute inset-0 wh-full;
    mask: linear-gradient(180deg, transparent 0%, #000 50%);
  }
  & > .tab-nav-extra-item-content {
    @apply skew-x-30;
  }

  &:not(.active) {
    &:after {
      @apply border-l border-r border-b border-#C8C8C8/50 bg-#868686/20;
    }
  }
  &.active {
    &:after {
      @apply bg-#FFC368/20 border-l border-r border-b border-#cec68e;
    }
  }
}
</style>
