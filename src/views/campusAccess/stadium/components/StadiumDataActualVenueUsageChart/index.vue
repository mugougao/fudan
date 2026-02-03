<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchVenueUsageRate, type IFetchVenueUsageRateResult } from "@/api/campusAccess/stadium";
import badminton from "@/assets/images/campusAccess/badminton.png";
import basketball from "@/assets/images/campusAccess/basketball.png";
import tableTennis from "@/assets/images/campusAccess/TableTennis.png";
import tennis from "@/assets/images/campusAccess/tennis.png";
import volleyball from "@/assets/images/campusAccess/volleyball.png";
import { cn } from "@/utils";
import gymnasiumSplitBuild from "@/utils/WdpMap/campusAccess/stadium/GymnasiumSplitBuild.ts";

defineOptions({ name: "StadiumDataActualVenueUsageChart", inheritAttrs: true });

// 室内场馆 房间名称
const publishname = useRouteQuery("publishname", "") as unknown as Ref<string>;

onBeforeUnmount(() => {
  publishname.value = "";
});

const { state } = useAsyncState<IFetchVenueUsageRateResult[]>(async () => {
  const [err, res] = await to(fetchVenueUsageRate());
  if (err) return [];
  return res?.resultData || [];
}, [], { immediate: true, resetOnExecute: false });

const iconMap = {
  网球: "i-svg-icon-tennis",
  羽毛球: "i-svg-icon-basketball",
  篮球: "i-svg-icon-badminton",
  排球: "i-svg-icon-volleyball",
  乒乓球: "i-svg-icon-volleyball",
};
function getIcon(name: string) {
  const target = Object.entries(iconMap).find(([key]) => name.includes(key));
  return target?.[1] || "i-svg-icon-volleyball";
}

function getIconType(name: string) {
  return getIcon(name).split("-").slice(-1)[0];
}

let denominator: number | null = null;
function getProgress(val: number) {
  if (denominator == null) denominator = state.value.reduce((acc, cur) => acc + Number(cur.num), 0);
  if (val === 0 || denominator === 0) return 0;
  return Math.floor(val / denominator * 100);
}

function handleClick(name: string) {
  publishname.value = name;
  gymnasiumSplitBuild.splitRoom(name);
}
</script>

<template>
  <ul class="stadium-data-actual-venue-usage-chart h-full w-full overflow-y-auto px-1 space-y-0.5">
    <li
      v-for="({ name, num, sttime, entime }, index) in state" :key="index"
      class="dot-border h-80px flex cursor-pointer gap-1 p-1.5"
      @click="handleClick(name)">
      <div
        class="h-full w-[68px] flex-col shrink-0 items-center justify-center border text-[16px] leading-none children:font-400"
        :class="publishname === name ? 'border-[#FFF3F3]/30 bg-[#000A17]/30' : 'border-[#FFF3F3]/30 bg-[#000A17]/30'">
        <span>{{ sttime }}</span>
        <span>~</span>
        <span>{{ entime }}</span>
      </div>
      <div
        class="flex flex-auto items-center overflow-hidden border pr-1 leading-none"
        :class="publishname === name ? 'border-[#FFF3F3]/30 bg-[#000A17]/30' : 'border-[#FFF3F3]/30 bg-[#000A17]/30'">
        <span class="icon size-[56px] flex shrink-0 items-center justify-center">
          <i :class="cn(getIcon(name), 'text-2xl bg-gradient-to-b from-[#FFC2C2] to-white')" />
        </span>
        <div class="flex-auto" :title="name">
          <div class="flex items-center">
            <span class="block flex-auto truncate text-[14px] text-[#FFE5E5]">{{ name?.replace("江湾体育馆", "") }}</span>
            <span class="ml-5 block shrink-0 text-24px font-number">
              {{ num }}
            </span>
          </div>
          <div class="progress relative h-28px flex items-center overflow-hidden" :class="getIconType(name)" :style="{ '--width': `${getProgress(num)}%` }">
            <span v-for="i in num" :key="i" class="size-[17px] flex items-center justify-center">
              <i :class="cn(getIcon(name), 'text-[17px] shrink-0')" />
            </span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.stadium-data-actual-venue-usage-chart {
  .icon {
    background: url("@/assets/images_new/icon-bg-2.png") no-repeat center;
  }

  .progress {
    background-repeat: repeat-x;
    background-position: left center;
    background-size: 17px 17px;
    &.tennis {
      background-image: icon("i-svg-icon-tennis", "#ffffff66");
    }
    &.basketball {
      background-image: icon("i-svg-icon-basketball", "#ffffff66");
    }
    &.badminton {
      background-image: icon("i-svg-icon-badminton", "#ffffff66");
    }
    &.volleyball {
      background-image: icon("i-svg-icon-volleyball", "#ffffff66");
    }
  }
}
</style>
