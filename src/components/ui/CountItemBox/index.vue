<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "CountItemBox", inheritAttrs: false });

const { icon, iconText, name, value, unit, valueVertical = false } = defineProps<{
  icon?: string;
  iconText?: string;
  name?: string;
  value?: number | string;
  unit?: string;
  valueVertical?: boolean;
}>();
</script>

<template>
  <div class="dot-border count-item-box whitespace-nowrap p-1" :class="$attrs.class ?? ''">
    <div class="h-full w-full flex items-center border border-[#FFF3F3]/10 py-0.5">
      <div
        :class="cn(
          'icon relative mx-1 size-[50px] flex shrink-0 items-center',
          iconText ? 'flex-col justify-end' : 'justify-center',
        )">
        <slot name="icon">
          <i :class="icon" class="from-red to-white bg-gradient-to-b" />
        </slot>
        <span v-if="iconText" class="from-red to-white bg-gradient-to-b bg-clip-text text-[10px] text-transparent font-title">{{ iconText }}</span>
      </div>
      <div class="flex flex-col leading-none">
        <span class="mb-0.5 text-[14px] text-white">
          <slot name="name">{{ name }}</slot>
        </span>
        <span :class="valueVertical && 'flex flex-col'">
          <span class="empty-number" :class="cn('text-[22px] font-number', valueVertical && 'text-[20px]')">
            <slot name="value" :value="value">{{ value }}</slot>
          </span>
          <span v-if="unit" :class="cn('text-[10px] text-white/80', !valueVertical && 'ml-1')">{{ unit }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-item-box {
  .icon {
    background: url("@/assets/images_new/icon-bg-2.png") no-repeat center / 58px 45px;
  }
}
</style>
