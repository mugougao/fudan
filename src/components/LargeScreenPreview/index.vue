<script setup lang="ts">
// 大屏预览组件
import { cn } from "@/utils";

defineOptions({ name: "LargeScreenPreview", inheritAttrs: false });

const {
  previewImageSrc,
  screenUrl,
  screenTitle,
} = defineProps<{
  previewImageSrc?: string;
  screenUrl: string;
  screenTitle: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const fullscreenTargetRef = useTemplateRef<HTMLDivElement>("fullscreenTarget");
const { isFullscreen, toggle } = useFullscreen(fullscreenTargetRef);
const open = ref(false);
</script>

<template>
  <div :class="cn('large-screen-preview', !$slots.trigger && 'w-full h-full', $attrs.class ?? '')">
    <div class="wh-full" @click="() => open = true">
      <slot name="trigger" :open="open">
        <div class="group relative wh-full flex cursor-pointer items-center justify-center">
          <div class="aspect-video w-full bg-gray-900">
            <img :src="previewImageSrc" alt="bg" class="h-full w-full object-cover">
          </div>
          <div class="absolute inset-0 wh-full flex-center bg-gray-500/50 opacity-0 transition-all group-hover:opacity-100">
            <i class="i-ri-eye-line text-5xl text-white" />
          </div>
        </div>
      </slot>
    </div>
    <DragPopup v-model:visible="open" :width="1200" left="auto" @close="() => emit('close')">
      <template #title>
        <div class="flex items-center justify-between">
          <span>{{ screenTitle }}</span>
          <button type="button" class="flex-center rounded bg-transparent hover:bg-white/10" @click="toggle">
            <i :class="[isFullscreen ? 'i-ri-fullscreen-exit-line' : 'i-ri-fullscreen-line']" />
          </button>
        </div>
      </template>
      <div class="screen-bg p-5">
        <div ref="fullscreenTarget" class="h-640px bg-gray-900">
          <iframe v-if="open" :src="screenUrl" width="100%" height="100%" />
        </div>
      </div>
    </DragPopup>
  </div>
</template>

<style scoped lang="scss">
.screen-bg {
  background: url("@/assets/images_new/popup-bg.png") no-repeat center / 100% 100%;
}
</style>
