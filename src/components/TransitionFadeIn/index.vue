<script setup lang="ts">
defineOptions({ name: "TransitionFadeIn" });
const { appear = true } = defineProps<{
  appear?: boolean;
}>();
</script>

<template>
  <Transition
    v-bind="$attrs"
    :appear="appear"
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut">
    <slot />
  </Transition>
</template>

<style>

</style>
