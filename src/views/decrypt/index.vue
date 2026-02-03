<script setup lang="ts">
import { aesDecrypt } from "@/utils/request/interceptors";

const beforeText = ref("");
const afterText = ref("");

function click() {
  afterText.value = JSON.stringify(JSON.parse(aesDecrypt(beforeText.value)), null, 2).trim();
}
</script>

<template>
  <div class="h-screen w-full flex items-center gap-x-3 bg-gray-900 p-5 text-white">
    <textarea v-model="beforeText" class="h-full flex-1 border border-gray-500 rounded bg-gray-900 p-5" />
    <button class="rounded bg-gray-500 p-2" @click="click">
      解码
    </button>
    <div class="h-full flex-1 overflow-auto border border-gray-500 rounded p-5">
      <pre>{{ afterText }}</pre>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
