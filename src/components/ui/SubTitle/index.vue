<script setup lang="ts">
defineOptions({ name: "SubTitle", inheritAttrs: false });
const { title, titlePath } = defineProps<{
  titlePath?: string;
  title?: string;
}>();
</script>

<template>
  <h3 class="sub-title relative h-[30px] flex items-start border-b border-white pl-1 pt-1 leading-none" :class="$attrs.class">
    <span class="sub-title-text flex flex-auto items-center overflow-hidden truncate text-[16px] text-white font-text-medium">
      {{ titlePath ? $t(titlePath) : title }}
      <span v-if="$slots.titleSuffix">
        <slot name="titleSuffix" />
      </span>
    </span>
    <span v-if="$slots.extra" class="sub-title-extra inline-block shrink-0 pb-1">
      <slot name="extra" />
    </span>
    <span class="line" />
  </h3>
</template>

<style scoped lang="scss">
.sub-title {
  background:
    linear-gradient(to bottom, #3a0707 0%, #3a0707 100%) no-repeat left top / 1px 24px,
    linear-gradient(to right, #3a0707 0%, #f04d4d00 100%) no-repeat left top / 230px 1px,
    linear-gradient(to right, #3a0707 0%, #f04d4d00 100%) no-repeat left bottom / 220px 1px,
    linear-gradient(270deg, #3d3d3d00 0%, #262626b3 100%) no-repeat left top / 230px 24px,
    linear-gradient(270deg, rgba(58, 7, 7, 0) 0%, #f04d4d 100%) no-repeat left 24px / 230px 2px;

  span.line {
    display: block;
    position: absolute;
    top: 24px;
    right: 0;
    width: 94px;
    height: 2px;
    background:
      linear-gradient(270deg, #d8d8d8 0%, #d8d8d8 100%) no-repeat left top / 80px 100%,
      linear-gradient(270deg, #d8d8d8 0px, #d8d8d8 2px, transparent 2px, transparent 4px) repeat-x left top / 4px 2px;
    transform: skewX(-30deg);
  }
}
</style>
