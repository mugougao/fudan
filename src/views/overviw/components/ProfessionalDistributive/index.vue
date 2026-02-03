<script setup lang="tsx">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "ProfessionalDistributive", inheritAttrs: false });

const data = {
  oneTeachingCollegeMasterPoint: 47,
  oneTeachingCollegeDoctoralPoint: 44,
  masterDegreeAuthorizedPoint: 40,
  doctoralDegreeAuthorizedPoint: 7,
};
</script>

<template>
  <div :class="cn('professional-distributive', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.majorDistribution" />
    <UiCountItemStrip :name="$t('overviw.undergraduateMajor')" value="83" unit="个" icon="i-svg-icon-book2" />

    <div class="count-box mb-3 mt-2 flex items-center justify-between px-2 leading-none">
      <span class="flex flex-col">
        <span class="text-[12px] text-white">{{ $t('overviw.firstLevelMaster') }}</span>
        <span>
          <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[20px] text-transparent font-number">{{ get(data, 'oneTeachingCollegeMasterPoint') }}</span>
          <span class="text-[12px] text-white/60">个</span>
        </span>
      </span>

      <span class="block size-[62px] flex items-end justify-center text-[14px]">
        <span>硕士</span>
      </span>
      <span class="flex flex-col items-end">
        <span class="text-[12px] text-white">{{ $t('overviw.masterMajor') }}</span>
        <span>
          <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[20px] text-transparent font-number">{{ get(data, 'masterDegreeAuthorizedPoint') }}</span>
          <span class="text-[12px] text-white/60">个</span>
        </span>
      </span>
    </div>

    <div class="count-box flex items-center justify-between px-2 leading-none">
      <span class="flex flex-col">
        <span class="text-[12px] text-white">{{ $t('overviw.firstLevelDoctor') }}</span>
        <span>
          <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[20px] text-transparent font-number">{{ get(data, 'oneTeachingCollegeDoctoralPoint') }}</span>
          <span class="text-[12px] text-white/60">个</span>
        </span>
      </span>

      <span class="block size-[62px] flex items-end justify-center text-[14px]">
        <span>博士</span>
      </span>

      <span class="flex flex-col items-end">
        <span class="text-[12px] text-white">{{ $t('overviw.doctorMajor') }}</span>
        <span>
          <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[20px] text-transparent font-number">{{ get(data, 'doctoralDegreeAuthorizedPoint') }}</span>
          <span class="text-[12px] text-white/60">个</span>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-box {
  height: 62px;
  background: url("@/assets/images_new/count-bg-5.png") no-repeat center / 360px 62px;
}
</style>
