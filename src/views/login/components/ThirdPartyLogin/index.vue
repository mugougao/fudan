<script setup lang="ts">
import { env } from "@/utils/env.ts";

defineOptions({ name: "ThirdPartyLogin" });

const emits = defineEmits<{
  changeLoginType: [loginType: "local"];
}>();

const loginUrl = env.VITE_THIRD_PARTY_LOGIN_URL;
</script>

<template>
  <section class="third-party-login flex flex-col items-center pt-5 space-y-10">
    <a
      class="third-party-button h-55px w-487px flex-center text-26px leading-none font-text-medium !text-white hover:!text-red-200"
      :href="loginUrl">
      统一认证身份登录
    </a>
    <button
      type="button" class="bg-transparent text-22px text-#FFD779 font-text-medium hover:text-#FFD779/80"
      @click="emits('changeLoginType', 'local')">
      用户口令登录
    </button>
  </section>
</template>

<style scoped lang="scss">
.third-party-login {
  .third-party-button {
    background-image: url("@/assets/images/login/login-btn.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>
