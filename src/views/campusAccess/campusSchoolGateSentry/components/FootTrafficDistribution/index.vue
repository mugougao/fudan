<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
// import to from "await-to-js";
import dayjs from "dayjs";
// import { fetchCampusGateFlowDistribution } from "@/api/campusAccess/campusSchool";
import { cn } from "@/utils";

defineOptions({ name: "FootTrafficDistribution" });

// 校门
const schoolDoorId = useRouteQuery("schoolDoorId", "") as unknown as Ref<string>;

const active = ref(0);
const list = ["campusAccess.personnelOnCampusDistribution", "campusAccess.offCampusPersonnelDistribution"];

// 模拟数据：门岗人流量分布
const mockGateFlowDistributionData: Record<string, { name: string; value1: number; value2: number }[]> = {
  校门1: [
    { name: "6", value1: 25, value2: 15 },
    { name: "7", value1: 38, value2: 22 },
    { name: "8", value1: 65, value2: 40 },
    { name: "9", value1: 72, value2: 45 },
    { name: "10", value1: 78, value2: 50 },
    { name: "11", value1: 82, value2: 52 },
    { name: "12", value1: 75, value2: 48 },
    { name: "13", value1: 72, value2: 45 },
    { name: "14", value1: 75, value2: 48 },
    { name: "15", value1: 78, value2: 50 },
    { name: "16", value1: 82, value2: 52 },
    { name: "17", value1: 85, value2: 55 },
    { name: "18", value1: 82, value2: 52 },
    { name: "19", value1: 75, value2: 48 },
    { name: "20", value1: 65, value2: 40 },
    { name: "21", value1: 48, value2: 30 },
    { name: "22", value1: 35, value2: 22 },
    { name: "23", value1: 25, value2: 15 },
  ],
  校门2: [
    { name: "6", value1: 20, value2: 12 },
    { name: "7", value1: 30, value2: 18 },
    { name: "8", value1: 52, value2: 32 },
    { name: "9", value1: 58, value2: 35 },
    { name: "10", value1: 62, value2: 38 },
    { name: "11", value1: 65, value2: 40 },
    { name: "12", value1: 60, value2: 38 },
    { name: "13", value1: 58, value2: 35 },
    { name: "14", value1: 60, value2: 38 },
    { name: "15", value1: 62, value2: 40 },
    { name: "16", value1: 65, value2: 42 },
    { name: "17", value1: 68, value2: 45 },
    { name: "18", value1: 65, value2: 42 },
    { name: "19", value1: 60, value2: 38 },
    { name: "20", value1: 52, value2: 32 },
    { name: "21", value1: 38, value2: 25 },
    { name: "22", value1: 28, value2: 18 },
    { name: "23", value1: 20, value2: 12 },
  ],
  校门3: [
    { name: "6", value1: 15, value2: 10 },
    { name: "7", value1: 25, value2: 15 },
    { name: "8", value1: 42, value2: 25 },
    { name: "9", value1: 48, value2: 28 },
    { name: "10", value1: 52, value2: 32 },
    { name: "11", value1: 55, value2: 35 },
    { name: "12", value1: 50, value2: 32 },
    { name: "13", value1: 48, value2: 30 },
    { name: "14", value1: 50, value2: 32 },
    { name: "15", value1: 52, value2: 35 },
    { name: "16", value1: 55, value2: 38 },
    { name: "17", value1: 58, value2: 40 },
    { name: "18", value1: 55, value2: 38 },
    { name: "19", value1: 50, value2: 32 },
    { name: "20", value1: 42, value2: 25 },
    { name: "21", value1: 32, value2: 20 },
    { name: "22", value1: 22, value2: 15 },
    { name: "23", value1: 15, value2: 10 },
  ],
  校门4: [
    { name: "6", value1: 12, value2: 8 },
    { name: "7", value1: 20, value2: 12 },
    { name: "8", value1: 35, value2: 20 },
    { name: "9", value1: 40, value2: 22 },
    { name: "10", value1: 42, value2: 25 },
    { name: "11", value1: 45, value2: 28 },
    { name: "12", value1: 40, value2: 25 },
    { name: "13", value1: 38, value2: 22 },
    { name: "14", value1: 40, value2: 25 },
    { name: "15", value1: 42, value2: 28 },
    { name: "16", value1: 45, value2: 30 },
    { name: "17", value1: 48, value2: 32 },
    { name: "18", value1: 45, value2: 30 },
    { name: "19", value1: 40, value2: 25 },
    { name: "20", value1: 35, value2: 20 },
    { name: "21", value1: 25, value2: 15 },
    { name: "22", value1: 18, value2: 12 },
    { name: "23", value1: 12, value2: 8 },
  ],
};

const { state, execute } = useAsyncState<{ name: string; value1: number; value2: number }[]>(async () => {
  if (!schoolDoorId.value) return [];
  // 获取门岗数据，默认为校门1
  return mockGateFlowDistributionData[schoolDoorId.value] || mockGateFlowDistributionData["校门1"];
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
