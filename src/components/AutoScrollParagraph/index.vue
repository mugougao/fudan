<script setup lang="ts">
import { cn, numberToCss } from "@/utils";

defineOptions({ name: "AutoScrollParagraph", inheritAttrs: false });

const { height = "100%" } = defineProps<{
  height?: number | string;
}>();

const isOverflow = ref(false);
const wrapperRef = useTemplateRef("wrapper");
const containerRef = useTemplateRef("container");
let timeoutId: any = null;

function playAutoScroll() {
  if (wrapperRef.value) {
    wrapperRef.value.scrollTop += 2;
    // 滚动到一半，重置滚动位置
    if (wrapperRef.value.scrollTop > wrapperRef.value.scrollHeight / 2) {
      wrapperRef.value.scrollTop = 0;
    }
    if (isOverflow.value) {
      timeoutId = setTimeout(playAutoScroll, 100);
    }
  }
}

const isHovered = useElementHover(wrapperRef);

// useMutationObserver 监听 containerRef 容器内容变化
useMutationObserver(containerRef, () => {
  isOverflow.value = false;
  clearTimeout(timeoutId);
  timeoutId = null;
  if (isHovered.value) return;
  nextTick(() => {
    if (wrapperRef.value) {
      isOverflow.value = wrapperRef.value.scrollHeight > wrapperRef.value.clientHeight;
    }
  });
}, {
  childList: true,
  subtree: true,
  //   attributes: true,
  characterData: true,
});

onMounted(() => {
  if (wrapperRef.value) {
    isOverflow.value = wrapperRef.value.scrollHeight > wrapperRef.value.clientHeight;
  }
});

watch(
  isOverflow,
  () => {
    if (isHovered.value) return;
    if (isOverflow.value) {
      timeoutId = setTimeout(playAutoScroll, 100);
    }
    else {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  },
);

watch(
  isHovered,
  () => {
    if (isHovered.value) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
    else {
      if (isOverflow.value) {
        timeoutId = setTimeout(playAutoScroll, 100);
      }
    }
  },
);
</script>

<template>
  <div
    ref="wrapper"
    class="auto-scroll-paragraph"
    :class="cn($attrs.class || '', isHovered ? 'overflow-y-auto' : 'overflow-y-hidden')"
    :style="{ height: numberToCss(height) }">
    <div ref="container">
      <slot />
    </div>
    <div v-if="isOverflow && !isHovered">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
