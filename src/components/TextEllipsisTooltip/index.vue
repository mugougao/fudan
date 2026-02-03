<script setup lang="ts">
import type { TooltipProps } from "ant-design-vue";
import type { CSSProperties } from "vue";

defineOptions({ name: "TextEllipsisTooltip" });

const props = withDefaults(defineProps<{
  text?: string;
  width?: string | number;
  mode?: "single" | "multi";
  line?: number;
  tooltipProps?: Omit<TooltipProps, "open">;
}>(), {
  width: "100%",
  mode: "single",
  line: 2,
});

const textStyle = computed(() => {
  const { width, mode, line } = props;

  return {
    width: typeof width === "number" ? `${width}px` : width,
    ...(
      mode === "single"
        ? {
            "overflow": "hidden",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
          }
        : {
            "overflow": "hidden",
            "display": "-webkit-box",
            "-webkit-box-orient": "vertical",
            "-webkit-line-clamp": line,
          }
    ),
  } as unknown as CSSProperties;
});

const textRef = ref<HTMLElement>();
// 是否超出
const isOverflow = ref(false);
// 鼠标是否在元素上
const isHovered = useElementHover(textRef);
// 是否显示tooltip
const tooltipOpen = computed(() => isOverflow.value && isHovered.value);

function checkOverflow() {
  const cellChild = textRef.value!;
  // 简单的溢出检测方法
  if (props.mode === "single") {
    // 单行情况
    isOverflow.value = cellChild.scrollWidth > cellChild.offsetWidth;
  }
  else {
    // 多行情况
    isOverflow.value = cellChild.scrollHeight > cellChild.offsetHeight;
  }
}

useEventListener(textRef, "mouseenter", checkOverflow);
</script>

<template>
  <!-- 文字自动超出省略，并显示tooltip -->
  <ATooltip v-bind="props.tooltipProps" :open="tooltipOpen">
    <template #title>
      <slot>{{ props.text }}</slot>
    </template>
    <span ref="textRef" v-bind="$attrs" class="text-ellipsis-tooltip inline-block w-full" :style="textStyle">
      <slot>{{ props.text }}</slot>
    </span>
  </ATooltip>
</template>

<style scoped>
/* 添加一些基本样式确保效果能正常展示 */
.text-ellipsis-tooltip {
  box-sizing: border-box;
}
</style>
