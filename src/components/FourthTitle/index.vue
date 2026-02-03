<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "FourthTitle", inheritAttrs: false });
</script>

<template>
  <div :class="cn('fourth-title relative flex items-center', $attrs.class ?? '')">
    <span class="text-14px text-[#FFE0CC] font-text-medium">
      <slot />
    </span>
    <div v-if="$slots.extra" class="fourth-title-extra ml-auto">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fourth-title {
  &:before {
    content: "";
    display: block;
    width: 6px;
    height: 8px;
    background: linear-gradient(to bottom, #ffb0b0 0%, rgba(0, 0, 0, 0) 100%);
    transform: skewX(30deg);
    margin-right: 5px;
    margin-left: 5px;
  }
}
</style>
