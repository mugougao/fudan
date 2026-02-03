<script setup lang="ts">
import GradientText from "@/components/GradientText";
import { cn } from "@/utils";

defineOptions({ name: "SecondTitle", inheritAttrs: true });
</script>

<template>
  <div :class="cn('second-title flex items-center', $attrs.class || '')">
    <span class="line mr-3 inline-block h-15px w-3px from-#FFB3B3 to-#FF2626 bg-gradient-to-t shadow-[inset_0_0_6px_0_#FFE9E966]" />
    <GradientText class="text-18px font-text-medium" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
      <slot />
    </GradientText>
    <div v-if="$slots.extra" class="second-extra ml-auto">
      <slot name="extra" />
    </div>
  </div>
</template>
