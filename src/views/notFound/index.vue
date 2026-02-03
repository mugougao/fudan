<script setup lang="ts">
import { useUserStore } from "@/stores/user.ts";

const userStore = useUserStore();
</script>

<template>
  <body class="h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="flex flex-col items-center">
      <h1 class="text-[120px] text-gray-700 font-extrabold">
        404
      </h1>
      <p class="mb-6 text-2xl text-gray-600 font-medium">
        页面未找到
      </p>
      <a
        :href="userStore.addAsyncRouted ? '/' : '/login'"
        class="rounded-md px-4 py-2 font-medium transition-all duration-200 ease-in-out !bg-indigo-500 !text-white hover:!bg-indigo-600">
        返回首页
      </a>
    </div>
  </body>
</template>

<style scoped>

</style>
