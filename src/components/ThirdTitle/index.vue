<script setup lang="ts">
import GradientText from "@/components/GradientText";
import { cn } from "@/utils";

defineOptions({ name: "ThirdTitle" });

//
</script>

<template>
  <div :class="cn('third-title flex items-center relative pb-1', $attrs.class || '')">
    <span class="ornament mr-3 skew-x-30 space-x-1">
      <span class="inline-block h-8px w-5px from-#ED4E4E to-#FF8585/40 bg-gradient-to-b" />
      <span class="inline-block h-8px w-5px from-#FFB0B0 to-transparent bg-gradient-to-b" />
    </span>
    <GradientText class="text-14px font-text-medium" :deg="180" :colors="{ 0: '#FFD5B7', 100: '#fff' }">
      <slot />
    </GradientText>
    <div v-if="$slots.extra" class="second-extra ml-auto">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.third-title {
  &:after {
    content: "";
    @apply absolute w-full h-2px bottom-0 left-0 right-0;
    background: linear-gradient(
      to right,
      #ffb4b4 0%,
      #ffb4b4 6px,
      #9d7474 6px,
      #9d7474 calc(100% - 6px),
      #ffb4b4 calc(100% - 6px),
      #ffb4b4 100%
    );
  }
}
</style>
