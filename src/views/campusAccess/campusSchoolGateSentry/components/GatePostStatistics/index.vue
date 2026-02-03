<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchCampusGateInOutStatistics } from "@/api/campusAccess/campusSchool";
import GradientText from "@/components/GradientText";

defineOptions({ name: "GatePostStatistics" });

// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

const { state, execute } = useAsyncState<{ xn: number; xw: number }>(async () => {
  if (!schoolDoorId.value) return {} as { xn: number; xw: number };
  const [err, res] = await to(fetchCampusGateInOutStatistics(schoolDoorId.value));
  if (err) return {} as { xn: number; xw: number };
  return res?.resultData || {} as { xn: number; xw: number };
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
