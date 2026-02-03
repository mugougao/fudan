<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import dayjs from "dayjs";
import { fetchCampusGateFlowDistribution } from "@/api/campusAccess/campusSchool";
import { useDataSlice, useEChartRender } from "@/hooks";
import { cn } from "@/utils";

defineOptions({ name: "FootTrafficDistribution" });

// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

const active = ref(0);
const list = ["campusAccess.personnelOnCampusDistribution", "campusAccess.offCampusPersonnelDistribution"];

const { state, execute } = useAsyncState<{ name: string;value1: number;value2: number }[]>(async () => {
  if (!schoolDoorId.value) return [];
  const [err, res] = await to(fetchCampusGateFlowDistribution(schoolDoorId.value));
  if (err) return [];
  return res?.resultData || [];
}, [], { immediate: true, resetOnExecute: false });

watch(() => schoolDoorId.value, () => execute());

const chartData = computed(() => {
  const currentHour = Number(dayjs().format("HH"));
  return state.value
    .filter(({ name }) => Number(name) <= currentHour)
    .map(({ name, value1, value2 }) => ({
      name: name.endsWith(":00") ? name : `${name}:00`,
      value: active.value === 0 ? value1 : value2,
    }));
});

function btnClick(index: number) {
  active.value = index;
}
</script>

<template>
  <div class="row-span-9 flex flex-col flex-shrink-0">
    <UiSubTitle title-path="campusAccess.footTrafficDistribution" class="mb-2 shrink-0" />

    <ul class="mx-3 mb-2 flex gap-3">
      <li
        v-for="(item, index) in list" :key="index"
        :class="cn(
          'px-3 relative cursor-pointer whitespace-nowrap flex-1 text-center py-0.5',
          'border border-white/60',
          'bg-gradient-to-b bg-[#000A17]/60 from-white/10 via-white/30 to-transparent',
          'text-[16px] text-white/60 text-[14px]',
          active === index && 'text-white border-[#CC1A1A] from-[#DC2F2F]/25 via-[#DC2F2F]/75 via-90% bg-[#000A17]/40',
        )"
        @click="btnClick(index)">
        <span :class="cn('absolute left-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', active === index && 'bg-[#EABC8B]')" />
        <span :class="cn('absolute right-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', active === index && 'bg-[#EABC8B]')" />
        <span>{{ $t(item) }}</span>
      </li>
    </ul>

    <div class="flex-auto overflow-hidden">
      <UiChartLine :data="chartData" unit="人" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.inSchool {
  width: 132px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  height: 36px;
  line-height: 36px;
  background: url("@/assets/images/campusAccess/border.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0px 0px 10px 0px rgba(24, 254, 254, 0.3);
  &:hover,
  &.active {
    color: #48c2c2;
  }
}
</style>
