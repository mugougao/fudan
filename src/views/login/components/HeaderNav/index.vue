<script setup lang="ts">
defineOptions({ name: "HeaderNav" });
</script>

<template>
  <header class="login-header-nav absolute left-0 right-0 top-0">
    <div class="logo h-80px w-450px flex items-center justify-start">
      <img src="@/assets/images/logo.png" alt="logo" class="mx-2.5 wh-50px">
      <GradientText
        class="leading-none font-title text-shadow-[0px_13px_12px_#3F447542]"
        :deg="0"
        :colors="{ 17: 'rgba(157, 164, 221, 0.01)', 47: 'rgba(157, 164, 221, 0.49)', 76: 'rgba(157, 164, 221, 0.01)', 100: '#fff' }">
        <span class="mb-1 block text-32px tracking-widest">复旦大学数智孪生校园</span>
        <span class="block text-14px">Fudan University Digital Twin Campus</span>
      </GradientText>
    </div>
  </header>
</template>

<style scoped lang="scss">
.login-header-nav {
  background:
    url("@/assets/images/red/layout/header-left.png") no-repeat left top,
    url("@/assets/images/red/layout/header-right.png") no-repeat right top;
  background-size:
    425px 83px,
    calc(100% - 420px) 83px;
  .login {
    width: 36px;
    height: 36px;
    background: url("@/assets/images/login.png") no-repeat;
  }
}
</style>
