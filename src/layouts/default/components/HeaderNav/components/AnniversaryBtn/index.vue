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
  <button
    class="anniversary-btn mx-3 bg-transparent text-xl"
    @click="() => start ? close() : open()">
    <i
      class="i-svg-icon-anniversary"
      :class="start ? 'bg-gradient-to-r from-[#C9A063] via-[#D9281E] to-[#C9A063]' : 'bg-gradient-to-b from-[#F7EFEF] via-[#E8D1D1] to-[#975555]'" />
  </button>
</template>

<style scoped>

</style>
