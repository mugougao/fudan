<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "BumpButton", inheritAttrs: false });
</script>

<template>
  <button v-bind="$attrs" :class="cn('bump-button font-title', $attrs.class ?? '')">
    <span class="bump" />
    <span class="bump-block" />
    <slot />
  </button>
</template>

<style scoped lang="scss">
.bump-button {
  --bg-color: rgba(63, 63, 63, 0.3);
  --border-color: rgba(255, 255, 255, 0.4);
  --text-Color: #5b5a5a;

  color: var(--text-Color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-left: none;
  border-radius: 0 4px 4px 0;
  font-size: 18px;
  padding: 0 5px 0 0;
  position: relative;
  &:before,
  &:after {
    content: "";
    position: absolute;
    left: -5px;
    width: 5px;
    height: 6px;
    background-color: var(--bg-color);
    border-left: 1px solid var(--border-color);
  }
  &:before {
    top: -1px;
    border-top: 1px solid var(--border-color);
    border-radius: 4px 0 0 0;
  }
  &:after {
    bottom: -1px;
    border-bottom: 1px solid var(--border-color);
    border-radius: 0 0 0 4px;
  }

  .bump-block {
    display: block;
    width: 5px;
    height: calc(100% - 10px);
    background-color: var(--bg-color);
    position: absolute;
    top: 5px;
    left: -5px;
  }
  .bump {
    display: block;
    width: 10px;
    height: calc(100% - 8px);
    position: absolute;
    right: calc(100% + 5px);
    top: 4px;
    background-color: var(--bg-color);
    border: 1px var(--border-color) solid;
    border-right: none;
    border-radius: 3px 0 0 3px;
    transform-style: preserve-3d;
    transform: perspective(25px) rotateY(-50deg);
    transform-origin: right center;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 3px;
      height: 3px;
      border: 1px var(--border-color) solid;
      border-radius: 3px;
    }
    &:before {
      top: -3px;
      right: 0;
      border-left: none;
      border-top: none;
      border-radius: 0 0 3px 0;
    }
    &:after {
      bottom: -3px;
      right: 0;
      border-left: none;
      border-bottom: none;
      border-radius: 0 3px 0 0;
    }
  }

  &:hover {
    --bg-color: rgba(77, 241, 227, 0.4);
    --border-color: rgba(15, 58, 55, 0.5);
    --text-Color: #fff;
  }
}
</style>
