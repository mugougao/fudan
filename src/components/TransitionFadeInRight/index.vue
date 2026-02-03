<script setup lang="ts">
defineOptions({ name: "TransitionFadeInRight" });

const { appear = true } = defineProps<{
  appear?: boolean;
}>();
</script>

<template>
  <Transition
    v-bind="$attrs"
    :appear="appear"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight">
    <slot />
  </Transition>
</template>

<style>

</style>
