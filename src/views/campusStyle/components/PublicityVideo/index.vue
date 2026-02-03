<script setup lang="ts">
import { env } from "@/utils/env.ts";

defineOptions({ name: "PublicityVideo", inheritAttrs: false });

const emit = defineEmits<{
  close: [];
}>();

const visible = defineModel<boolean>("visible", { default: false });

// 宣传片视频播放器
const videoRef = useTemplateRef<HTMLVideoElement>("videoRef");

watchEffect(async () => {
  if (!videoRef.value) return;
  await nextTick();
  videoRef.value.volume = 0.2;
  try {
    await videoRef.value.play();
  }
  catch (e) {
    videoRef.value.muted = true;
    await videoRef.value.play();
  }
});
</script>

<template>
  <!--   宣传片 弹窗   -->
  <DragPopup
    v-model:visible="visible" :title="$t('viewFuDan.promotionalVideo')"
    :width="1314" top="150px" left="430px"
    @close="emit('close')">
    <video
      v-if="visible"
      ref="videoRef"
      class="aspect-video w-full"
      :src="`${env.VITE_HTTP_ASSETS_URL}/video/fudanTrailer.mp4`"
      controlsList="nodownload"
      controls />
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
