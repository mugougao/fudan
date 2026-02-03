<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    img?: any;
  }>(),
  {},
);
const img = computed(() => props.img);
</script>

<template>
  <UiBoxPanel class="row-span-7 overflow-hidden overflow-y-auto" title="校园文化宣传">
    <EmptyWrapper :is-empty="!img.length" description="暂无图片" />
    <div v-if="img.length" class="mt-3 px-2">
      <a-carousel autoplay draggable>
        <img
          v-for="(item, index) in img" :key="index"
          :src="item" alt=""
          class="aspect-video object-cover object-center">
      </a-carousel>
    </div>
  </UiBoxPanel>
</template>

<style scoped>

</style>
