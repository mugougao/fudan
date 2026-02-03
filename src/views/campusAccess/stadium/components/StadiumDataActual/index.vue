<script setup lang="ts">
import { useState } from "@/hooks";
import StadiumDataActualCount from "../StadiumDataActualCount/index.vue";
import StadiumDataActualTrafficStatistics from "../StadiumDataActualTrafficStatistics/index.vue";
import StadiumDataActualVenueUsageChart from "../StadiumDataActualVenueUsageChart/index.vue";

// ==================== 场馆设施数据大屏 =====================
const [open] = useState(false);
const fullscreenTargetRef = useTemplateRef<HTMLDivElement>("fullscreenTarget");
const { isFullscreen, toggle } = useFullscreen(fullscreenTargetRef);
// ==================== 场馆设施数据大屏 =====================
</script>

<template>
  <UiBoxPanel class="row-span-24" title-path="venueFacilities.venueUsageData" content-class-name="flex flex-col gap-y-1">
    <template #titleSuffix>
      <UiSelectBtn v-model="open">
        {{ $t('venueFacilities.facilityScreen') }}
      </UiSelectBtn>
    </template>

    <StadiumDataActualCount />

    <UiSubTitle title-path="venueFacilities.todayAppointments" class="shrink-0" />
    <div class="h-[460px] w-full overflow-hidden font-bold">
      <StadiumDataActualVenueUsageChart />
    </div>

    <UiSubTitle title-path="venueFacilities.annualAppointments" class="shrink-0" />
    <div class="flex-auto overflow-hidden">
      <StadiumDataActualTrafficStatistics />
    </div>

    <!--  场馆设施数据大屏  -->
    <DragPopup v-model:visible="open" :width="1536" left="auto">
      <template #title>
        <div class="flex items-center justify-between">
          <span>
            {{ $t('venueFacilities.facilityScreen') }}
          </span>
          <button type="button" class="flex-center rounded bg-transparent wh-36px hover:bg-white/10" @click="toggle">
            <i :class="[isFullscreen ? 'i-ri-fullscreen-exit-line' : 'i-ri-fullscreen-line']" />
          </button>
        </div>
      </template>
      <div ref="fullscreenTarget" class="h-864px bg-gray-900">
        <iframe src="https://workspace.easyv.cloud/shareScreen/eyJzY3JlZW5JZCI6MzAzMzUwOX0=" width="100%" height="100%" />
      </div>
    </DragPopup>
  </UiBoxPanel>
</template>
