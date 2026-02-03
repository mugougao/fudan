<script setup lang="ts">
defineOptions({ name: "FifthTitle", inheritAttrs: false });
</script>

<template>
  <div class="fifth-title flex items-center">
    <span class="fifth-title-icon mr-2 h-[16px] w-[4px] shrink-0 rounded-br rounded-tl bg-[#C1FFF7]" />
    <div class="flex-auto text-[18px] text-white font-text-medium">
      <slot>
        <span class="fifth-title-text">{{ $slots.default }}</span>
      </slot>
    </div>
    <div v-if="$slots.extra" class="fifth-title-extra shrink-0">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
