<script setup lang="ts">
import { themeAdmin } from "@/plugins/antd/theme.ts";
import AsideNav from "./components/AsideNav/index.vue";
import HeaderNav from "./components/HeaderNav/index.vue";

defineOptions({ name: "LayoutAdmin" });
</script>

<template>
  <AConfigProvider :theme="themeAdmin">
    <div class="layout-admin relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gray-200">
      <HeaderNav />
      <AsideNav />
      <main class="ml-300px mt-70px w-[calc(100%-300px)] p-5">
        <Transition
          appear mode="out-in"
          enter-active-class="animate__animated animate__fadeInRight"
          leave-active-class="animate__animated animate__fadeOutRight">
          <div :key="$route.fullPath">
            <router-view />
          </div>
        </Transition>
      </main>
    </div>
  </AConfigProvider>
</template>

<style scoped>

</style>
