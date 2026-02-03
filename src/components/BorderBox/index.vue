<script setup lang="ts"></script>

<template>
  <section class="BorderBox1" v-bind="$attrs">
    <slot />
  </section>
</template>

<style scoped lang="scss">
.BorderBox1 {
  border: 1px solid #77d7ff33;
  background: #00000099;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translate(8px, 5px);
    pointer-events: none;
    // border: 1px solid #77d7ff33;
  }
}
</style>
