<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchCampusGateSituation, type IFetchCampusGateSituationResult } from "@/api/campusAccess/campusSchool";
import GradientText from "@/components/GradientText";
import { CampusId, CampusName } from "@/enums";

defineOptions({ name: "IngressSituation" });

// 校区id
const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

const { state, execute } = useAsyncState<IFetchCampusGateSituationResult>(
  async () => {
    if (campusId.value === CampusId.Overview) return {} as IFetchCampusGateSituationResult;
    const campusName = CampusName[campusId.value];
    const [err, res] = await to(fetchCampusGateSituation(`${campusName}校区`));
    if (err) return {} as IFetchCampusGateSituationResult;
    return (res?.resultData || {}) as IFetchCampusGateSituationResult;
  },
  {} as IFetchCampusGateSituationResult,
  { immediate: false, resetOnExecute: false },
);

watch(
  campusId,
  () => execute(),
  { immediate: true },
);

// 今日进总校人数
const total = computed(() => {
  const val = (state.value?.jrjx?.zrs || 0).toString();
  return val.length < 4
    ? val.padStart(3, "0").split("")
    : val.split("");
});
</script>

<template>
  <div class="row-span-6 flex flex-col">
    <div class="count-box flex shrink-0">
      <UiCountItem class="flex-1" icon="i-svg-icon-raw-enter" :name="$t('campusAccess.entranceAndExit')" :value="state.crksl" unit="个" />
      <UiCountItem class="flex-1" icon="i-svg-icon-raw-card3" :name="$t('campusAccess.swipeDevice')" :value="state.sbsl" unit="个" />
    </div>

    <div class="dot-border my-2 flex flex-col flex-auto items-center justify-center gap-3">
      <span class="flex items-center justify-center">
        <span class="text-[14px]">{{ $t("campusAccess.enterTheSchoolToday") }}:</span>
        <span class="mx-1 flex">
          <span
            v-for="(num, index) in total" :key="`${num}-${index}`"
            class="number-span ml-1 h-[32px] w-[24px] flex-center border border-[#C0DCE7]/30 from-[#CC1A1A]/60 to-[#CC1A1A]/10 bg-gradient-to-b">
            <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[28px] text-transparent font-number">{{ num }}</span>
          </span>
        </span>
        <span class="text-[12px] text-white/60">人次</span>
      </span>

      <div class="flex items-center justify-center gap-2">
        <div class="flex items-center gap-1">
          <span class="h-[28px] w-[36px] inline-flex items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 text-[14px] font-title">{{ $t("campusAccess.onCampus") }}</span>
          <span class="h-[28px] w-[105px] flex items-center justify-between border border-[#FFF3F3]/20 bg-[#000A17]/30 px-2">
            <span class="empty-number font-[20px] font-number">{{ state?.jrjx?.xn }}</span>
            <span class="text-[10px] text-white/60">人次</span>
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="h-[28px] w-[36px] inline-flex items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 text-[14px] font-title">{{ $t("campusAccess.outside") }}</span>
          <span class="h-[28px] w-[105px] flex items-center justify-between border border-[#FFF3F3]/20 bg-[#000A17]/30 px-2">
            <span class="empty-number font-[20px] font-number">{{ state?.jrjx?.xw }}</span>
            <span class="text-[10px] text-white/60">人次</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-box {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat 48% center / 1px 30px;
  & > div {
    background-size: 131px 143px;
    background-repeat: no-repeat;
    background-position: -25px center;
    &:first-child {
      background-image: url("@/assets/images_new/icon-bg-main.png");
    }
    &:last-child {
      background-image: url("@/assets/images_new/icon-bg-warn.png");
    }
  }
}

.oul {
  height: 36px;
  line-height: 36px;
  background: url("@/assets/images/campusAccess/border.png") no-repeat;
  background-size: 100% 100%;
}

.count-number span {
  background: linear-gradient(180deg, #1b324d 0%, #314c6f 99%);
  border: 2px solid;
  border-image: linear-gradient(180deg, #15598a 0%, rgba(32, 90, 126, 0) 50%, #0d5478 100%) 2;
}
</style>
