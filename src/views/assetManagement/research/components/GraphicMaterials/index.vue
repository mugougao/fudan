<script setup lang="ts">
import { cn } from "@/utils";
import { env } from "@/utils/env.ts";

defineOptions({ name: "GraphicMaterials", inheritAttrs: false });

const assetsUrl = env.VITE_HTTP_ASSETS_URL;
const images = [
  { src: `${assetsUrl}/images/research1.png` },
  { src: `${assetsUrl}/images/research2.jpg` },
];

const index = ref(0);
function onAfterChange(current: number) {
  index.value = current;
}
</script>

<template>
  <div :class="cn('graphic-materials flex flex-col overflow-hidden', $attrs.class ?? '')">
    <UiSubTitle title="图文资料" class="mb-2">
      <template #extra>
        <a href="https://fdemc.fudan.edu.cn/" target="_blank" class="bg-[#7C4D4D]/40 px-1 text-[12px] text-white/60">
          官方网站
        </a>
      </template>
    </UiSubTitle>

    <div class="flex-auto overflow-hidden text-center">
      <UiThirdTitle title="复旦大学电镜中心" class="mb-2" />
      <div class="img-box mx-auto w-full p-2">
        <ACarousel
          autoplay draggable dots-class="custom-paging [&>li]:!size-[8px] !bottom-[-18px]"
          :after-change="onAfterChange">
          <div
            v-for="{ src } in images" :key="src"
            class="relative aspect-video bg-gray-300">
            <img :src="src" alt="img" class="h-full w-full object-cover">
          </div>
          <template #customPaging="{ i }">
            <span
              class="relative block h-full w-full cursor-pointer"
              :class="index === i && 'border border-r-white/50 rounded-full border-white -rotate-45' ">
              <span
                class="absolute left-1/2 top-1/2 block rounded-full -translate-1/2"
                :class="index === i ? 'size-[3px] bg-white' : 'size-[6px] bg-[#868686]'" />
            </span>
          </template>
        </ACarousel>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-box {
  background: url("@/assets/images_new/popup-bg.png") no-repeat center center;
  background-size: contain;
}
</style>
