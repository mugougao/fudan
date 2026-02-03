<script setup lang="ts">
import anniversaryCustomLayer from "@/utils/WdpMap/AnniversaryCustomLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";

defineOptions({ name: "AnniversaryBtn" });

onMounted(() => {
  wdpMap.addLayer(anniversaryCustomLayer);
});
const start = ref(false);
function open() {
  start.value = true;
  anniversaryCustomLayer.render();
}

function close() {
  start.value = false;
  anniversaryCustomLayer.close();
}
</script>

<template>
  <div v-if="!start" class="SchoolCelebration mt-4px cursor-pointer" :title="$t('headerToolbar.openAnniversary')" @click="open">
    <img src="@/assets/images/SchoolCelebrationLogoClose.png" alt="icon">
  </div>
  <div v-else class="SchoolCelebration mt-4px cursor-pointer" :title="$t('headerToolbar.closeAnniversary')" @click="close">
    <img src="@/assets/images/SchoolCelebrationLogo.png" alt="icon">
  </div>
</template>

<style scoped>

</style>
