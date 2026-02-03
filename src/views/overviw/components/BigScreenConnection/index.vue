<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "BigScreenConnection", inheritAttrs: false });
</script>

<template>
  <div :class="cn('big-screen-connection', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.bigScreenLink" />
    <div class="mt-2 flex items-center gap-2 px-1 children:flex-1">
      <LargeScreenPreview screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/1873c3a8b89543f296701217f783c220/view?entryType=7" screen-title="资产管理驾驶舱">
        <template #trigger>
          <button
            type="button"
            :class="cn(
              'group w-full px-3 relative cursor-pointer whitespace-nowrap flex-1 text-center py-0.5',
              'border border-white/60',
              'bg-gradient-to-b bg-[#000A17]/60 from-white/10 via-white/30 to-transparent',
              'text-[16px] text-white/60 text-[14px]',
              'hover:text-white hover:bg-gradient-to-b hover:border-[#CC1A1A] hover:from-[#DC2F2F]/25 hover:via-[#DC2F2F]/75 hover:via-90% hover:bg-[#000A17]/40',
            )">
            <span :class="cn('absolute left-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', 'group-hover:bg-[#EABC8B]')" />
            <span :class="cn('absolute right-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', 'group-hover:bg-[#EABC8B]')" />
            <span>资产管理驾驶舱</span>
          </button>
        </template>
      </LargeScreenPreview>
      <LargeScreenPreview screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/4ed0aaba16cd43d485a2bdf10f7ad277/view?entryType=7" screen-title="能源能耗分析大屏">
        <template #trigger>
          <button
            type="button"
            :class="cn(
              'group w-full  px-3 relative cursor-pointer whitespace-nowrap flex-1 text-center py-0.5',
              'border border-white/60',
              'bg-gradient-to-b bg-[#000A17]/60 from-white/10 via-white/30 to-transparent',
              'text-[16px] text-white/60 text-[14px]',
              'hover:text-white hover:bg-gradient-to-b hover:border-[#CC1A1A] hover:from-[#DC2F2F]/25 hover:via-[#DC2F2F]/75 hover:via-90% hover:bg-[#000A17]/40',
            )">
            <span :class="cn('absolute left-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', 'group-hover:bg-[#EABC8B]')" />
            <span :class="cn('absolute right-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', 'group-hover:bg-[#EABC8B]')" />
            <span>能源能耗分析大屏</span>
          </button>
        </template>
      </LargeScreenPreview>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
