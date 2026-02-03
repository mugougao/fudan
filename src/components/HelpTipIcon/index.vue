<script setup lang="ts">
defineOptions({ name: "HelpTipIcon" });

const { tip } = defineProps<{
  tip?: string;
}>();
</script>

<template>
  <ATooltip
    color="#CC1A1A33"
    overlay-class-name="!min-w-fit [&_.ant-tooltip-inner]:backdrop-blur">
    <template #title>
      <slot>{{ tip }}</slot>
    </template>
    <slot name="trigger">
      <i class="i-ri-question-line ml-1 text-12px text-white/60" :class="$attrs?.class || ''" />
    </slot>
  </ATooltip>
</template>
