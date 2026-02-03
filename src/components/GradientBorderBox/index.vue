<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { ref } from "vue";

defineOptions({ name: "GradientBorderBox" });

const props = withDefaults(
  defineProps<{
    borderColor: string | string[] | Record<number, string>;
    borderGradientDeg?: [number, number, number, number];
    backgroundGradientDeg?: [number, number, number, number];
    borderRadius?: number;
    borderWidth?: number;
    backgroundColor?: string | string[] | Record<number, string>;
    contentWrapperClass?: string;
    contentClass?: string;
  }>(),
  {
    borderGradientDeg: () => [0, 0, 0, 1],
    backgroundGradientDeg: () => [0, 0, 0, 1],
    borderRadius: 0,
    borderWidth: 1,
    backgroundColor: "#fff",
    contentWrapperClass: "",
    contentClass: "",
  },
);
const gradientBorderBoxRef = ref<HTMLDivElement>();
const { width, height } = useElementSize(gradientBorderBoxRef);

function colorFormat(value: string | string[] | Record<number, string>): Record<number, string> {
  const type = Object.prototype.toString.call(value);
  if (type === "[object Object]") {
    return value;
  }
  else if (type === "[object Array]") {
    const length = (value as string[]).length - 1;
    if (length === 0) return {};
    return (value as string[]).reduce((pre, cur, index) => ({
      ...pre,
      [index / length * 100]: cur,
    }), {} as Record<number, string>);
  }
  else if (type === "[object String]") {
    return { 0: value, 100: value } as Record<number, string>;
  }
  return { 0: "rgba(0,0,0,0)", 100: "rgba(0,0,0,0)" };
}

const backgroundColor = computed(() => colorFormat(props.backgroundColor));
const borderColor = computed(() => colorFormat(props.borderColor));
const borderRectSize = computed(() => {
  const borderWidth = props.borderWidth / 2;
  return {
    x: borderWidth,
    y: borderWidth,
    width: `${width.value - props.borderWidth}px`,
    height: `${height.value - props.borderWidth}px`,
  };
});

const rectRef = ref<SVGRectElement>();
const rectTotalLength = ref(0);
const rectTotalLength2 = computed(() => rectTotalLength.value / 4);
onMounted(() => {
  setTimeout(() => {
    if (rectRef.value) {
      rectTotalLength.value = rectRef.value.getTotalLength();
    }
  });
});
</script>

<template>
  <div ref="gradientBorderBoxRef" class="gradient-border-box relative" :style="{ borderRadius: `${borderRadius}px` }">
    <div class="gradient-border-box-border pointer-events-none absolute inset-0 z-0 wh-full">
      <svg :width="Math.max(width, 1)" :height="Math.max(height, 1)" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="gradientBorder"
            :x1="props.borderGradientDeg[0]" :y1="props.borderGradientDeg[1]"
            :x2="props.borderGradientDeg[2]" :y2="props.borderGradientDeg[3]">
            <stop v-for="(value, key) in borderColor" :key="key" :offset="`${key}%`" :stop-color="value" />
          </linearGradient>
          <linearGradient
            id="gradientBackground"
            :x1="props.backgroundGradientDeg[0]" :y1="props.backgroundGradientDeg[1]"
            :x2="props.backgroundGradientDeg[2]" :y2="props.backgroundGradientDeg[3]">
            <stop v-for="(value, key) in backgroundColor" :key="key" :offset="`${key}%`" :stop-color="value" />
          </linearGradient>
        </defs>
        <rect
          ref="rectRef"
          v-bind="borderRectSize"
          :rx="borderRadius"
          fill="url(#gradientBackground)"
          :stroke-width="borderWidth"
          stroke="url(#gradientBorder)"
          stroke-linecap="round" />
      </svg>
    </div>

    <div
      class="gradient-border-box-content-wrapper relative"
      :class="contentWrapperClass"
      :style="{ borderRadius: `${borderRadius}px`, padding: `${borderWidth}px` }">
      <div class="gradient-border-box-content" :class="contentClass">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gradient-border-box {
  .gradient-border-box-border {
    rect {
      stroke-dasharray: v-bind(rectTotalLength2);
      animation: dash 4s linear infinite;
    }
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
  from {
    stroke-dashoffset: v-bind(rectTotalLength);
  }
}
</style>
