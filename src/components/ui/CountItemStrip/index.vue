<script setup lang="ts">
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "CountItemStrip", inheritAttrs: false });

const { icon, name, value = 0, unit, type = "red" } = defineProps<{
  icon?: string;
  name: string;
  value?: number | string;
  unit?: string;
  type?: "red" | "yellow";
}>();
</script>

<template>
  <div
    :class="cn(
      'count-item-strip dot-border mx-1 mt-3 flex items-center gap-1 p-1.5',
      $attrs.class ?? '',
    )">
    <div
      :class="cn(
        'size-[28px] flex items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20',
        type === 'yellow' && 'border-[#F7C998] bg-[#F7C998]/20',
      )">
      <i :class="cn(icon, 'text-[14px] text-[#FFC2C2]', type === 'yellow' && 'text-[#F7C998]')" />
    </div>
    <div class="h-[28px] flex flex-auto items-center border border-[#FFF3F3]/10 px-1 leading-none">
      <span :class="cn('text-[14px] text-[#FFE5E5] font-title', type === 'yellow' && 'text-[#FFE8D0]')">{{ name }}</span>
      <span class="empty-number ml-auto text-[20px] font-number">{{ numberToThousands(value) }}</span>
      <span class="ml-1 text-[10px] text-[#9E9E9E]">{{ unit }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
