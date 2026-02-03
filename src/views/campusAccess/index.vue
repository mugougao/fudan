<script setup lang="ts">

</script>

<template>
  <!-- 生活服务 整体视角 -->

  <RouterLink v-slot="{ navigate }" to="/campusAccess/stadium/" custom>
    <div class="absolute left-1/2 top-1/2">
      <AButton type="primary" size="large" @click="navigate">
        进入体育场馆
      </AButton>
    </div>
  </RouterLink>
  <RouterLink v-slot="{ navigate }" to="/campusAccess/library/" custom>
    <div class="absolute left-1/2 top-1/3">
      <AButton type="primary" size="large" @click="navigate">
        进入图书馆
      </AButton>
    </div>
  </RouterLink>
</template>

<style scoped>

</style>
