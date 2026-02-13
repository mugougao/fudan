<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
// import to from "await-to-js";
// import { fetchCampusGateInOutStatistics } from "@/api/campusAccess/campusSchool";

defineOptions({ name: "GatePostStatistics" });

// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

// 模拟数据：门岗校内/校外进出统计
const mockGateInOutStatisticsData: Record<string, { xn: number; xw: number }> = {
  校门1: { xn: 125, xw: 85 },
  校门2: { xn: 98, xw: 65 },
  校门3: { xn: 78, xw: 52 },
  校门4: { xn: 65, xw: 42 },
  gate1: { xn: 120, xw: 80 },
  gate2: { xn: 95, xw: 62 },
  gate3: { xn: 75, xw: 48 },
  gate4: { xn: 60, xw: 40 },
};

const { state, execute } = useAsyncState<{ xn: number; xw: number }>(async () => {
  if (!schoolDoorId.value) return {} as { xn: number; xw: number };
  // 获取门岗数据，默认为校门1
  return mockGateInOutStatisticsData[schoolDoorId.value] || mockGateInOutStatisticsData["校门1"];
}, {} as { xn: number; xw: number }, { immediate: true, resetOnExecute: false });

watch(() => schoolDoorId.value, () => execute());
</script>

<template>
  <div class="row-span-5 overflow-hidden">
    <div class="my-3 flex items-center gap-1">
      <span class="h-[28px] inline-flex shrink-0 items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 px-2 text-[14px] font-title">{{ $t("campusAccess.theNameOfTheGate") }}</span>
      <span class="empty-text h-[28px] flex flex-auto items-center justify-center overflow-hidden truncate whitespace-nowrap border border-[#FFF3F3]/20 bg-[#000A17]/30 px-2 font-title">{{ schoolDoorId }}</span>
    </div>

    <div class="flex items-center gap-2">
      <UiCountItemBox
        class="flex-1"
        icon="i-svg-icon-user3"
        icon-text="校内"
        :name="$t('campusAccess.personnelOnCampus')"
        :value="state?.xn"
        unit="人次" />

      <UiCountItemBox
        class="flex-1"
        icon="i-svg-icon-user3"
        icon-text="校外"
        :name="$t('campusAccess.offCampusPersonnel')"
        :value="state?.xw"
        unit="人次" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon {
  background: url("@/assets/images_new/icon-bg-2.png") no-repeat center / 58px 45px;
}
</style>
