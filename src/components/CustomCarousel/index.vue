<script setup lang="ts">
defineOptions({ name: "CustomCarousel" });

const props = defineProps<{
  data: any[];
  autoplay: boolean;
}>();

const carouselRef = ref();
const handleWheel = useThrottleFn((event: WheelEvent) => {
  event.deltaY > 0 ? carouselRef.value?.next() : carouselRef.value?.prev();
}, 200);

const expose = new Proxy({}, {
  get(target, key) {
    if (carouselRef.value?.[key]) return carouselRef.value?.[key];
    return target[key];
  },
  has(target, key) {
    return carouselRef.value?.[key] || target[key];
  },
});

watch(
  () => props.data,
  () => carouselRef.value?.goto?.(0, true),
  { deep: true },
);

defineExpose(expose);
</script>

<template>
  <div class="custom-carousel wh-full" @wheel.prevent.stop="handleWheel">
    <ACarousel ref="carouselRef" :autoplay="props.autoplay">
      <slot />
    </ACarousel>
  </div>
</template>

<style scoped lang="scss">
.custom-carousel {
  :deep(.ant-carousel) {
    &,
    & .slick-slider,
    & .slick-slider .slick-list,
    & .slick-slider .slick-list .slick-track,
    & .slick-slider .slick-list .slick-track .slick-slide,
    & .slick-slider .slick-list .slick-track .slick-slide > div {
      width: 100%;
      height: 100%;
    }

    .slick-dots {
      bottom: 0;

      li {
        &,
        &.slick-active,
        & button {
          width: 6px;
          height: 6px;
          background: rgba(51, 187, 255, 0.3);
        }

        &.slick-active button {
          background: #33bbff;
        }
      }
    }
  }
}
</style>
