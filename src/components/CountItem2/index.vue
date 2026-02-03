<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "CountItem2", inheritAttrs: false });

const { title, value, unit } = defineProps<{
  icon: string;
  title: string;
  value: string | number;
  unit: string;
}>();
</script>

<template>
  <div class="count-item2 flex items-center">
    <span class="count-item-icon-wrapper relative block h-[60px] w-[80px] text-center">
      <span class="ring-wrapper absolute bottom-[-10px] left-0 block">
        <span class="ring-out block size-[75px]" />
        <span class="ring-in absolute left-1/2 top-1/2 block size-[50px] -translate-1/2" />
      </span>
      <i :class="cn('text-[32px] bg-gradient-to-b from-[#CAF2FF] from-50% to-white relative z-9 ml-4 -mt-1', icon)" />
    </span>
    <span class="count-item-content flex flex-col leading-none space-y-1.5">
      <span class="mb-1 text-[16px] text-white font-text-medium">
        {{ title }}
      </span>
      <span class="flex items-center justify-between">
        <span class="empty-number flex-auto from-[#CAF2FF] to-white bg-gradient-to-b bg-clip-text text-center text-[26px] text-transparent font-number">{{ value }}</span>
        <span class="ml-1 text-[16px] font-text-medium">{{ unit }}</span>
      </span>
    </span>
  </div>
</template>;

<style scoped lang="scss">
.count-item2 {
  .count-item-icon-wrapper {
    .ring-wrapper {
      transform: perspective(900px) rotateX(55deg) rotateY(20deg);
      .ring-out {
        border: 5px #c8f1ff solid;
        border-radius: 50%;
        mask: linear-gradient(40deg, #000 30%, transparent 100%);
      }
      .ring-in {
        border: 5px #c8f1ff solid;
        border-radius: 50%;
        mask: linear-gradient(to left, #000 50%, transparent 100%);
        filter: blur(3px);
      }
    }
  }
}
</style>
