<script setup lang="ts">
import useWatchCampusIdForSwitchPages from "@/composables/lifeServices/useWatchCampusId.ts";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";

const campusStore = useCampusStore();

useWatchCampusIdForSwitchPages();

onMounted(() => {
  wdpMap.onCreated(async () => {
    campusStore.setActiveCampusId(CampusId.Overview);
    campusRangeLayer.focusByCampusId(CampusId.Overview);
  });
});
</script>

<template>
  <div class="pointer-events-none" />
  <!-- 宿舍管理 整体视角 -->
<!--  <RouterLink v-slot="{ navigate }" to="/lifeServices/campus/" custom>
    <div class="pointer-events-auto absolute left-1/2 top-1/2">
      <AButton type="primary" size="large" @click="navigate">
        进入指定校区
      </AButton>
    </div>
  </RouterLink> -->
</template>

<style scoped>

</style>
