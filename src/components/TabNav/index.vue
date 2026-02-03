<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "TabNav", inheritAttrs: true });

const { options = [], contentClass = "", itemClass = "" } = defineProps<{
  options: { label: any; value: string | number }[];
  contentClass?: string;
  itemClass?: string;
}>();

const modelValue = defineModel<string | number>("modelValue", { default: "" });
function setModelValue(value: string | number) {
  modelValue.value = value;
}
</script>

<template>
  <div :class="cn('tab-nav inline-block', $attrs?.class || '')">
    <ul :class="cn('flex items-center gap-6', contentClass)">
      <!--  min-w-140px -->
      <li
        v-for="({ label, value }) in options" :key="value"
        :class="cn(
          value === modelValue ? 'active text-white' : 'text-#9E9E9E hover:text-white',
          'tab-nav-item relative h-[32px] flex-center cursor-pointer px-8 text-[18px] font-title',
          itemClass,
        )"
        @click="setModelValue(value)">
        <span class="tab-nav-item-content">
          <slot :label="label" :value="value">
            {{ label }}
          </slot>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.tab-nav {
  ul {
    li {
      @apply -skew-x-30;
      &:before,
      &:after {
        content: "";
        @apply absolute inset-0 wh-full rounded backdrop-blur-lg -z-1;
      }
      &:before {
        @apply translate-5px;
      }
      & > .tab-nav-item-content {
        @apply skew-x-30;
      }

      &:not(.active) {
        &:before,
        &:after {
          mask: linear-gradient(150deg, transparent 0%, #000 100%);
          @apply border border-#969696 bg-#BFBFBF1A;
          background: linear-gradient(105deg, transparent 3%, rgba(191, 191, 191, 0.1) 100%);
        }
      }
      &.active,
      &:hover {
        &:after {
          background:
            linear-gradient(104deg, rgba(255, 255, 255, 0) 3%, rgba(255, 179, 179, 0.1) 100%),
            linear-gradient(
              180deg,
              rgba(255, 71, 71, 0.5) 0%,
              rgba(255, 106, 106, 0.5) 50%,
              rgba(226, 36, 36, 0.5) 100%
            );
          border: 1px solid #ff6666;
          backdrop-filter: blur(11px);
          box-shadow: inset 2.2px 2.2px 2.2px 0 rgba(255, 77, 77, 0.5);
        }
        &:before {
          mask: linear-gradient(150deg, transparent 0%, #000 100%);
          @apply border border-#FF6969 bg-#BFBFBF1A;
        }
      }
    }
  }
}
</style>
