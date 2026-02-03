<script setup lang="ts">
defineOptions({ name: "TransitionFadeInLeft" });

const { appear = true } = defineProps<{
  appear?: boolean;
}>();
</script>

<template>
  <Transition
    v-bind="$attrs"
    :appear="appear"
    enter-active-class="animate__animated animate__fadeInLeft"
    leave-active-class="animate__animated animate__fadeOutLeft">
    <slot />
  </Transition>
</template>

<style>

</style>
