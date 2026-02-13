<script setup lang="ts">
import { useI18nStore } from "@/stores/i18n.ts";
import { cn } from "@/utils";

defineOptions({ name: "EquipmentTerminalStatistics" });

const {
  // lastYear,
  installedTerminal,
} = defineProps<IProps>();

const emit = defineEmits<{
  // prevYearChange: [event: { checked: boolean;campus: string }];
  installedChange: [event: { checked: boolean;campus: string }];
}>();

export interface IProps {
  // lastYear: { count: number;data: { name: string;value: number }[] };
  installedTerminal: { count: number;data: { name: string;value: number }[] };
}

const { isChinese } = storeToRefs(useI18nStore());
</script>

<template>
  <div class="row-span-6 flex flex-col">
    <!--
     <div class="flex flex-col flex-1">
      <SecondTitle>上一年度机时达标数</SecondTitle>
      <div class="flex flex-auto items-center">
        <div class="flex flex-col items-center pl-5 text-30px font-title">
          <span class="text-#BDF6FF">{{ lastYear.count }}</span>
          <span>设备数</span>
        </div>
        <LightLine class="mx-5" type="vertical" height="64px" width="2px" />
        <ul class="grid grid-cols-2 grid-rows-2 h-full flex-auto gap-3 py-3 pr-5">
          <li
            v-for="(item, index) in lastYear.data" :key="index"
            class="region-item" :class="item.name === numberOfAnnualTargetsFlag && 'active'"
            @click="setNumberOfAnnualTargetsFlag(item.name)">
            <span class="text-20px font-text-bold">{{ item.name }}</span>
            <span class="flex items-center">
              <span class="mb-1 text-24px font-number">{{ item.value }}</span>
              <span class="text-12px font-text-medium">台</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
     -->

    <div class="flex flex-col flex-1">
      <UiSubTitle title-path="largeInstruments.terminalInstrumentsAreInstalled" class="shrink-0" />
      <div class="chart-box relative flex-auto">
        <div class="absolute left-1/2 top-1/2 size-[110px] flex flex-col items-center justify-center text-[12px] leading-none -translate-x-1/2 -translate-y-1/2">
          <span class="mb-1 text-[22px] font-number">{{ installedTerminal.count }}</span>
          <span class="text-white/60">(台)</span>
          <i class="i-ri-arrow-up-s-fill" />
          <span>{{ $t('largeInstruments.TerminalsNumber') }}</span>
        </div>

        <ul class="absolute top-1/2 h-[135px] w-full flex flex-wrap -translate-y-1/2">
          <li
            v-for="(item, index) in installedTerminal.data" :key="index"
            :class="cn(
              'w-1/2 flex flex-col py-1',
              'even:items-end even:pr-2',
              'odd:item-start odd:pl-2',
              '[&:nth-child(n+3)]:flex-col-reverse',
            )">
            <span class="text-[14px] font-text-bold font-title">{{ item.name }}校区</span>
            <span class="flex items-center">
              <span class="from-[#F7C998] to-white bg-gradient-to-b bg-clip-text text-[22px] text-transparent font-number">{{ item.value }}</span>
              <span class="ml-1 text-[12px] text-[#C6C6C6]">台</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: url("@/assets/images_new/chart-bg-4.png") no-repeat center / 320px 130px;
}
</style>
