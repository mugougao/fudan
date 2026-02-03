<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "RenderImage", inheritAttrs: false });
</script>

<template>
  <div :class="cn('render-image', $attrs.class ?? '')">
    <UiSubTitle title-path="construction.index.effectPicture" />
    <div class="img-box h-[180px] overflow-hidden p-1.5">
      <img src="@/assets/images/RenderImage.png" alt="" class="wh-full object-cover">
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-box {
  background: url("src/assets/images_new/popup-bg.png") no-repeat center;
  background-size: cover;
}
</style>
