<script setup lang="ts">
import { env, isDev } from "@/utils/env.ts";
import HeaderNav from "./components/HeaderNav/index.vue";
import LocalLogin from "./components/LocalLogin/index.vue";
import ThirdPartyLogin from "./components/ThirdPartyLogin/index.vue";

onBeforeMount(() => {
  if (isDev) return;
  window.location.href = env.VITE_THIRD_PARTY_LOGIN_URL;
});

const loginComponent = ref<"local" | "thirdParty">(isDev ? "local" : "thirdParty");
// const loginComponent = ref<"local" | "thirdParty">("thirdParty");
function changeLoginComponent(type: "local" | "thirdParty") {
  loginComponent.value = type;
}
</script>

<template>
  <div class="login-view relative h-screen w-full flex-center">
    <HeaderNav />
    <div class="login-form-wrapper h-525px w-820px text-center">
      <h1 class="my-10 text-36px text-white font-text-bold">
        欢迎登录
      </h1>
      <Component
        :is="loginComponent === 'local' ? LocalLogin : ThirdPartyLogin"
        @change-login-type="changeLoginComponent" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-view {
  background-image: url("@/assets/images/login/login-bg.jpg");
  @apply bg-no-repeat bg-cover bg-center;
  &::before {
    content: "";
    @apply wh-full bg-black/40 absolute inset-0 backdrop-blur-xs;
  }
  .login-form-wrapper {
    @apply z-999;
    background-image: url("@/assets/images/login/login-form-bg.png");
    @apply bg-no-repeat bg-cover bg-center;
  }
}
</style>
