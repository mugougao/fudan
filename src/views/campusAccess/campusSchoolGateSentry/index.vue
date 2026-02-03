<script setup lang="tsx">
import FootTrafficDistribution
  from "@/views/campusAccess/campusSchoolGateSentry/components/FootTrafficDistribution/index.vue";
import GatePostStatistics from "@/views/campusAccess/campusSchoolGateSentry/components/GatePostStatistics/index.vue";
import NumberOfSchoolAttendances
  from "@/views/campusAccess/campusSchoolGateSentry/components/NumberOfSchoolAttendances/index.vue";
</script>

<template>
  <UiBoxPanel
    class="row-span-20"
    title-path="campusAccess.gatePostSituation"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <!--  门岗统计  -->
    <GatePostStatistics />
    <!--    人流量分布 -->
    <FootTrafficDistribution />
    <!--  进校人次  -->
    <NumberOfSchoolAttendances />
  </UiBoxPanel>
</template>

<style scoped>

</style>
