<script setup lang="ts">
import { useState } from "@/hooks";

defineOptions({ name: "LegendController" });

const modelValue = defineModel<string>("modelValue", { default: "1" });

const legendList = [
  // { label: "楼宇名称显示", value: "1" },
  { label: "修缮时间分布", value: "2" },
  { label: "入住率分布", value: "3" },
];

const [visible, setVisible] = useState(false);
let timeoutId: any = null;
function handleLegendMouseenter() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}
function handleLegendMouseleave() {
  timeoutId = setTimeout(() => {
    setVisible(false);
  }, 5000);
}

function handleChange(checked: boolean, val: string) {
  if (checked) modelValue.value = val;
}
</script>

<template>
  <div
    class="legend-controller" :class="{ active: visible }"
    @mouseenter="handleLegendMouseenter"
    @mouseleave="handleLegendMouseleave">
    <div class="legend-controller-content relative overflow-hidden" :class="{ animation: visible }">
      <button
        v-show="!visible"
        class="legend-controller-trigger bg-transparent text-20px" @click="setVisible(true)">
        <i class="i-ri-arrow-right-s-line mr-2" />
        <i class="i-ri-grid-fill" />
      </button>
      <div v-show="visible" class="legend-controller-switch-list absolute left-0 top-0 h-220px w-150px flex flex-col justify-start gap-2 px-5 py-3">
        <button type="button" class="absolute right-1 top-0 bg-transparent" @click="setVisible(false)">
          <i class="i-ri-close-line" />
        </button>
        <template v-for="({ label, value }) in legendList" :key="value">
          <label class="custom-switch flex flex flex-col cursor-pointer items-center gap-y-1">
            <span class="mr-2 text-16px">
              {{ label }}
            </span>
            <input
              :checked="modelValue === value" type="radio" class="hidden"
              @change="(checked:any) => handleChange(checked.target.checked, value)">
            <span class="switch" />
          </label>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.legend-controller {
  @apply mt-1 inline-block pl-0 transition-all;
  .legend-controller-content {
    .legend-controller-trigger {
      @apply h-36px w-28px;
    }
    @apply relative h-36px w-28px flex-center rounded-r-full;
    background: linear-gradient(90deg, rgba(199, 59, 59, 0.8) 0%, rgba(255, 121, 121, 0.8) 100%);
    .legend-controller-trigger {
      i:nth-child(1) {
        @apply inline-block;
      }
      i:nth-child(2) {
        @apply hidden;
      }
    }
  }

  & .legend-controller-content.animation {
    transition:
      width 0.3s ease-in-out,
      height 0.3s ease-in-out;
  }

  &:hover,
  &.active {
    @apply pl-3;
    .legend-controller-content {
      @apply w-36px rounded backdrop-blur;
      background: linear-gradient(
        90deg,
        rgba(21, 44, 56, 0.8063) 0%,
        rgba(3, 22, 44, 0.6776) 38%,
        rgba(14, 27, 43, 0.72) 99%
      );
      .legend-controller-trigger {
        @apply h-36px w-36px;
      }
      &:before,
      &:after {
        content: "";
        @apply wh-full absolute border-1.5 rounded pointer-events-none;
      }
      &:before {
        @apply border-white;
      }
      &:after {
        @apply border-#FF6B6B;
        mask: linear-gradient(45deg, transparent 0%, #000 50%, transparent 100%);
      }
      .legend-controller-trigger {
        i:nth-child(1) {
          @apply hidden;
        }
        i:nth-child(2) {
          @apply inline-block;
        }
      }
    }
  }

  &.active {
    .legend-controller-content {
      @apply w-150px h-220px;
    }
  }

  label.custom-switch {
    span.switch {
      @apply inline-block w-52px h-24px bg-#4E5864 border border-#4D4D4D rounded-full relative;
      box-shadow: inset 0 2px 12px 0 #000000;
      &:before {
        content: "";
        @apply inline-block w-20px h-20px rounded-full top-1px left-1px absolute transition-all;
        background: linear-gradient(125deg, #5a5a5a 0%, #acacac 100%);
      }
    }
    &:has(input:checked) {
      span.switch {
        @apply border-white bg-#FF7B7B;
        box-shadow: inset 0 4px 10px 0 rgba(255, 38, 38, 0.3);
        &:before {
          @apply left-29px;
          background: linear-gradient(225deg, #ffd6d6 0%, #fffcfc 100%);
        }
      }
    }
  }
}
</style>
