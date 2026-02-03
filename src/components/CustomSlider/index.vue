<script setup lang="ts">
import { sleep } from "@/utils";

defineOptions({ name: "CustomSlider", inheritAttrs: false });

const { data, displaySize = 7, length = 20, reverse = false } = defineProps<{
  data?: any[];
  displaySize?: number;
  length?: number;
  reverse?: boolean;
}>();

const modelValue = defineModel<number>("modelValue", { default: 0 });

const container = useTemplateRef("container");
const { width } = useElementSize(container);
const itemWidth = computed(() => {
  if (width.value <= 0) return 30;
  return width.value / displaySize;
});
const maxStartIndex = computed(() => Math.max(0, length - displaySize));

function handleScroll(e: Event) {
  const target = e.target as HTMLElement;
  const scrollLeft = target.scrollLeft;
  // 基于滚动位置计算当前应该显示的起始索引
  const calculatedIndex = Math.round(scrollLeft / itemWidth.value);
  modelValue.value = Math.min(calculatedIndex, maxStartIndex.value);
}

// 添加一个方法来手动滚动到指定位置
function scrollToIndex(index: number) {
  if (container.value) {
    const scrollPosition = index * itemWidth.value;
    container.value.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }
}

onMounted(async () => {
  if (!reverse) return;
  await nextTick();
  await sleep(500);
  scrollToIndex(maxStartIndex.value);
});

watch(
  () => JSON.stringify(data),
  async () => {
    await sleep(500);
    if (!reverse) {
      scrollToIndex(0);
      return;
    }
    scrollToIndex(maxStartIndex.value);
  },
);
</script>

<template>
  <div
    ref="container" class="custom-slider mb-3 w-full overflow-x-auto overflow-y-hidden leading-none"
    @scroll="handleScroll">
    <div class="h-[5px] flex text-[12px] divide-x" :style="{ width: `${itemWidth * length}px` }" />
  </div>
</template>

<style scoped lang="scss">
.custom-slider {
  --sb-track-color: #ffffff1a;
  --sb-thumb-color: #ffffffcc;
  --sb-thumb-hover-color: #ffffff;
  --sb-size: 4px;
  //scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
  &::-webkit-scrollbar {
    width: var(--sb-size);
    height: var(--sb-size);
  }

  &::-webkit-scrollbar-track {
    background: var(--sb-track-color);
    border-radius: 0px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--sb-thumb-color);
    border-radius: 0px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--sb-thumb-hover-color);
  }
}
</style>
