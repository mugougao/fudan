<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import get from "lodash/get";
import { useStatusFlag } from "@/composables/assetManagement/instrument.ts";
import { CampusId, campusIdFormat } from "@/enums";
import campusWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/instrument/CampusWithCollegePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";

defineOptions({ name: "NumberOfAnnualTargets" });
const props = defineProps<IProps>();

export interface IProps {
  numberOfTargets: number;
  attainmentRate: number;
}

const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
const { nextLevelNumberOfAnnualTargetsFlag, isLoading, waitForLoadingEnd, resetOtherFlag } = useStatusFlag();
watch(
  nextLevelNumberOfAnnualTargetsFlag,
  async (val) => {
    resetOtherFlag("nextLevelNumberOfAnnualTargetsFlag");
    await waitForLoadingEnd();
    if (val) {
      await campusPoiLayer.hideAll();
      await campusWithCollegePoiLayer.removeAll();
      await campusWithCollegePoiLayer.renderCampus(campusIdFormat(campusId.value).replace("校区", ""));
    }
    else {
      await campusPoiLayer.showAll();
      await campusWithCollegePoiLayer.removeAll();
    }
  },
);

const columns = [
  { title: "机时达标数", field: "numberOfTargets", suffix: "台" },
  { title: "机时达标率", field: "attainmentRate", suffix: "%" },
];

onBeforeUnmount(() => {
  campusWithCollegePoiLayer.removeAll();
});
</script>

<template>
  <div class="row-span-5 flex flex-col pt-3">
    <SecondTitle>
      上一年度机时达标数
      <template #extra>
        <CustomSwitch v-model="nextLevelNumberOfAnnualTargetsFlag">
          点位分布
        </CustomSwitch>
      </template>
    </SecondTitle>
    <div class="flex flex-auto items-center justify-around overflow-hidden">
      <div
        v-for="(item, index) in columns" :key="index"
        class="flex flex-col items-center"
        :class="index === columns.length - 1 && 'order-last'">
        <span class="font-title">
          <span class="empty-number mr-1 text-36px text-#9EFFFF">{{ get(props, item.field) }}</span>
          <span class="text-24px">{{ item.suffix }}</span>
        </span>
        <span class="text-16px font-text-medium">{{ item.title }}</span>
      </div>
      <LightLine type="vertical" color="white" height="64px" width="1px" />
    </div>
  </div>
</template>

<style scoped>

</style>
