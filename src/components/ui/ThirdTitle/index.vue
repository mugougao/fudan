<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "ThirdTitle", inheritAttrs: false });
const { title, titlePath } = defineProps<{
  titlePath?: string;
  title?: string;
}>();
</script>

<template>
  <h4 class="third-title flex items-center justify-center" :class="$attrs.class">
    <span class="third-title-prefix" />
    <span :class="cn('third-title-text mx-2 from-[#FFFFFF] to-[#FFC2C2] bg-gradient-to-b bg-clip-text text-[16px] text-transparent font-text-medium', $attrs.class ?? '')">
      {{ titlePath ? $t(titlePath) : title }}
    </span>
    <span class="third-title-suffix" />
  </h4>
</template>

<style scoped lang="scss">
.third-title {
  .third-title-prefix,
  .third-title-suffix {
    display: inline-block;
    width: 26px;
    height: 4px;
    background: linear-gradient(
      to right,
      #f04d4d 0px,
      #f04d4d 6px,
      transparent 6px,
      transparent 10px,
      rgba(#f04d4d, 0.75) 10px,
      rgba(#f04d4d, 0.75) 16px,
      transparent 16px,
      transparent 20px,
      rgba(#f04d4d, 0.5) 20px,
      rgba(#f04d4d, 0.5) 26px
    );
  }

  .third-title-prefix {
    transform: skewX(45deg);
  }
  .third-title-text {
  }
  .third-title-suffix {
    transform: skewX(-45deg) scale(-1);
  }
}
</style>
