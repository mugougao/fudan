<script setup lang="ts">
import info from "@/assets/json/CampusOverviwInfo.json";
import { campusIdFormat } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import { cn } from "@/utils";

defineOptions({ name: "CampusIntr", inheritAttrs: false });

const campusStore = useCampusStore();

const campusInfo = computed(() => info.find(item => item.id === campusStore.activeCampusId) ?? {
  name: campusIdFormat(campusStore.activeCampusId),
  introduction: "",
  landArea: "0",
  image: "https://dt.fudan.edu.cn/assets/images/cumpus-3.jpg",
  images: [],
});
//
</script>

<template>
  <div :class="cn('campus-intr flex flex-col', $attrs.class ?? '')">
    <UiThirdTitle :title="campusInfo.name" />
    <div class="campus-intr-image h-[200px] w-full shrink-0 px-2 py-5.5">
      <ACarousel autoplay :autoplay-speed="3000" effect="fade">
        <div
          v-for="(image, index) in campusInfo.images" :key="`${campusStore.activeCampusId}-${index}`"
          class="relative h-[180px] w-full shrink-0">
          <img :src="image" alt="" class="h-full w-full object-cover transition-all duration-500 delay-250 group-hover:scale-120">
        </div>
      </ACarousel>
    </div>
    <UiCountItemStrip class="mb-1" icon="i-svg-icon-area2" name="占地面积" :value="campusInfo.landArea" unit="亩" />
    <UiSubTitle class="shrink-0" title="校园介绍" />
    <div class="flex-auto overflow-hidden px-2 py-3">
      <AutoScrollParagraph>
        <div
          class="indent-[2em] text-[14px] text-white/80 leading-6"
          v-html="campusInfo.introduction" />
      </AutoScrollParagraph>
    </div>
  </div>
</template>

<style scoped lang="scss">
.campus-intr {
  .campus-intr-image {
    background: url("@/assets/images_new/video-bg.png") no-repeat center / contain;
  }

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

    .slick-dots.slick-dots-bottom {
      bottom: -20px;
      li {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        button {
          width: 6px;
          height: 6px;
          background-color: rgba(#fff, 0.2);
          border-radius: 50%;
        }
        &.slick-active {
          button {
            background-color: rgba(#fff, 1);
          }
        }
      }
    }
  }
}
</style>
