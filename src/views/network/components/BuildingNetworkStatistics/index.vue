<script setup lang="ts">
import type { EChartsOption } from "echarts";
import to from "await-to-js";
import { merge } from "lodash";
import get from "lodash/get";
import { fetchUserDistributionTop5MoreDetails } from "@/api/network/campus";

defineOptions({ name: "BuildingNetworkStatistics", inheritAttrs: false });

const {
  count = [0, 0],
  id,
} = defineProps<{ count?: number[]; id?: string }>();

const list = [
  { title: "在线终端", field: "0", icon: "i-svg-icon-raw-check" },
  { title: "在线人数", field: "1", icon: "i-svg-icon-raw-close" },
];

const { state, execute } = useAsyncState<{ name: string; value1: number;value2: number }[]>(
  async () => {
    if (!id) return [];
    const [err, res] = await to(fetchUserDistributionTop5MoreDetails(id));
    if (err) return [];
    return (res.resultData || []) as { name: string; value1: number;value2: number }[];
  },
  [],
  { immediate: false, resetOnExecute: false },
);

watch(
  () => id,
  (id) => {
    if (id) execute();
  },
);

function mergeOption(option: EChartsOption) {
  return merge(
    option,
    {
      series: [
        {
          tooltip: {
            valueFormatter: (val: any) => `${val}人`,
          },
        },
        {
          tooltip: {
            valueFormatter: (val: any) => `${val}台`,
          },
        },
      ],
    },
  );
}
</script>

<template>
  <UiBoxPanel title="楼宇网络统计" class="row-span-11" content-class-name="px-3 flex flex-col">
    <ul class="count-list relative flex items-center justify-evenly gap-5 py-3">
      <li
        v-for="({ title, field, icon }) in list" :key="field"
        class="flex items-center">
        <span class="icon relative h-[62px] w-[60px]"><i class="absolute left-[15px] top-[8px] text-2xl" :class="icon" /></span>
        <div class="ml-2 flex flex-col">
          <span class="text-[14px]">{{ title }}</span>
          <span>
            <span class="text-[18px] font-number">{{ get(count, field, 0) }}</span>
            <span class="ml-1 text-[12px] font-number">个</span>
          </span>
        </div>
      </li>
    </ul>
    <UiSubTitle title="用户/终端变化趋势" />
    <div class="flex-auto overflow-hidden">
      <UiChartSmoothDoubleLine :data="state" :legend="['用户数', '终端数']" unit="个" :merge-option="mergeOption" />
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count-list {
  background:
    url("@/assets/images_new/icon-bg-main.png") no-repeat -25px center / 131px 143px,
    url("@/assets/images_new/icon-bg-info.png") no-repeat 130px center / 131px 143px,
    linear-gradient(to bottom, rgba(#000, 0), #fff, rgba(#000, 0)) no-repeat center / 1px 50px;
}
</style>
