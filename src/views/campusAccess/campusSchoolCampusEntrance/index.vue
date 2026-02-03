<script setup lang="tsx">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import CrowdDistributionChart
  from "@/views/campusAccess/campusSchoolCampusEntrance/components/CrowdDistributionChart/index.vue";
import IngressSituation from "@/views/campusAccess/campusSchoolCampusEntrance/components/IngressSituation/index.vue";
import PercentageOfCardTypes from "@/views/campusAccess/campusSchoolCampusEntrance/components/PercentageOfCardTypes/index.vue";

// 校区id
const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
</script>

<template>
  <UiBoxPanel
    class="row-span-20"
    :title="$t('campusAccess.entranceAndExitSituation')"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <!-- 入口态势 -->
    <IngressSituation />
    <!-- 人流量分布   -->
    <CrowdDistributionChart />
    <!--  刷卡类型占比  -->
    <PercentageOfCardTypes />
  </UiBoxPanel>
</template>

<style scoped>

</style>
