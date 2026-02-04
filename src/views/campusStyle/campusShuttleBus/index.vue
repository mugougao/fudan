<script setup lang="ts">
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import bclx from "@/assets/json/bclx.json";
import busTime from "@/assets/json/busTime.json";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";
import { useI18nStore } from "@/stores/i18n.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer.ts";
import campusShuttleBus from "@/utils/WdpMap/campusStyle/CamppusBusPathlayer.ts";
import camppusBusPoilayer from "@/utils/WdpMap/campusStyle/CamppusBusPoilayer";
import wdpMap from "@/utils/WdpMap/wdpMap";

// =========================== 时刻表 ==============================
const timeFormat = useDateFormat(useNow(), "HH:mm");
const { isChinese } = storeToRefs(useI18nStore());

const busRouteList = ref<{ label: string; value: string }[]>([]);
onMounted(() => {
  busRouteList.value = bclx.features.map((item) => {
    const { Id, mc } = item.properties;
    return { label: mc, value: Id.toString() };
  });
});

const activeBusRoute = ref<string>("");
const timetable = computed(() => {
  const target = busTime.find(item => item.Id.toString() === activeBusRoute.value);
  if (!target) return [];
  const { mc, workDay, notWorkDay } = target;
  // 获取当前日期是否为工作日
  const isWorkDay = ![0, 6].includes(dayjs().day());
  const [from, to] = mc.split("-");
  return (isWorkDay ? workDay : notWorkDay).map(({ time, direction }) => ({ from, to, time, direction })) || [];
});

const timetableTextList = [
  { label: "上午", value: "morning" },
  { label: "下午", value: "afternoon" },
  { label: "晚上", value: "evening" },
];
const timetableGroup = computed(() => {
  return timetable.value.reduce((prev, curr) => {
    // 上午：6:00~12:00  下午:12:00~6:00 晚上：18:00~24:00
    const [hour] = curr.time.split(":");
    const h = +hour;
    if (h >= 6 && h < 12) {
      prev.morning.push(curr);
    }
    else if (h >= 12 && h < 18) {
      prev.afternoon.push(curr);
    }
    else {
      prev.evening.push(curr);
    }
    return prev;
  }, { morning: [], afternoon: [], evening: [] } as { morning: any[]; afternoon: any[]; evening: any[] });
});

function timeObsolete(time: string) {
  const [currentHour, currentMinute] = timeFormat.value.split(":").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (currentHour === hour) {
    if (minute < currentMinute) {
      return true;
    }
  }
  else if (hour < currentHour) {
    return true;
  }
  return false;
}

// 当前最近班次
const getNearestBus = computed(() => {
  const [currentHour, currentMinute] = timeFormat.value.split(":").map(Number);
  return timetable.value.find(({ time }) => {
    if (timeFormat.value === time) {
      return true;
    }
    else {
      const [hour, minute] = time.split(":").map(Number);
      if (hour > currentHour) {
        return true;
      }
      else if (hour === currentHour) {
        if (minute > currentMinute) return true;
      }
      return false;
    }
  }) || {} as any;
});

const collapse = ref("morning");
onMounted(() => {
  const [h] = timeFormat.value.split(":").map(Number);
  if (h >= 6 && h < 12) {
    collapse.value = "morning";
  }
  else if (h >= 12 && h < 18) {
    collapse.value = "afternoon";
  }
  else {
    collapse.value = "evening";
  }
});

// =========================== 时刻表 ==============================

// =========================== 路线 =============================
const campusStore = useCampusStore();
wdpMap.addLayer(campusShuttleBus, camppusBusPoilayer);
wdpMap.onCreated(() => {
// 默认 邯郸校区视角
  campusStore.setActiveCampusId(CampusId.HanDan);
  campusRangeLayer.focusByCampusId(CampusId.HanDan);
});

watch(activeBusRoute, async (newValue) => {
  campusPoiLayer.hideAll();
  await Promise.allSettled([
    campusShuttleBus.removeAll(),
    camppusBusPoilayer.removeAll(),
  ]);
  await Promise.allSettled([
    campusShuttleBus.render(newValue),
    camppusBusPoilayer.render(newValue),
  ]);
  campusShuttleBus.focus(newValue, {
    rotation: { pitch: -60, yaw: -90 },
    distanceFactor: 0.6,
  });
});

onBeforeUnmount(() => {
  campusPoiLayer.showAll();
  wdpMap.removeLayer(campusShuttleBus, camppusBusPoilayer);
});
// =========================== 路线 =============================
</script>

<template>
  <UiViewPanel :show-return="false" :left-grid="false">
    <template v-if="busRouteList.length" #left>
      <div class="navigation-menu relative mt-[100px]">
        <div class="absolute left-[5px] top-1/2 z-2 flex items-center gap-2 -translate-y-1/2">
          <span class="block size-[10px] border-2 border-white rounded-full bg-[#CC1A1A]" />
          <span>
            <img src="@/assets/images_new/arrow-2.png" alt="arrow">
          </span>
        </div>
        <ul class="navigation-menu-list absolute top-1/2 ml-12 -mt-2">
          <li>
            <LargeScreenPreview
              :screen-title="$t('campusBus.dataScreen')"
              screen-url="https://workspace.easyv.cloud/shareScreen/eyJzY3JlZW5JZCI6Mjk0MDkyM30=">
              <template #trigger="{ open }">
                <button class="screen-btn h-[36px] w-full bg-transparent text-[16px] font-title" :class="open && 'active'">
                  {{ $t('campusBus.dataScreen') }}
                </button>
              </template>
            </LargeScreenPreview>
          </li>
          <li
            v-for="item in busRouteList" :key="item.value"
            class="navigation-menu-list-item mt-3 flex items-center justify-center gap-1 py-0.5"
            :class="activeBusRoute === item.value ? 'active text-white' : 'text-white/80 hover:text-white'"
            @click="activeBusRoute = item.value">
            <span class="flex items-center text-[14px] font-title">
              {{ item.label.split("-").map(item => $t(`campusName.${item}`)).join("-") }}
            </span>
          </li>
        </ul>
      </div>
    </template>

    <template v-if="activeBusRoute" #right>
      <UiBoxPanel
        class="row-span-20"
        content-class-name="flex flex-col"
        :title="$t('campusBus.rightTitle')">
        <header class="time-header dot-border mb-1 flex flex-shrink-0 items-center justify-center p-2">
          <div class="h-[68px] w-[72px] flex flex-col items-center justify-center border border-[#FFF3F3]/20 bg-[#000A17]/30">
            <i class="i-ri-bus-2-fill text-[#FFC2C2]" />
            <span class="text-[#FFE5E5] font-title">{{ $t('campusBus.rightSubTitle') }}</span>
          </div>

          <div class="ml-1 h-[68px] flex flex-auto items-center justify-center overflow-hidden border border-[#FFF3F3]/20 bg-[#000A17]/30">
            <span class="flex items-center">
              <span class="text-[14px] text-white font-title">{{ $t(`campusName.${getNearestBus.from}`) }}</span>
              <span class="ml-1 size-[16px] inline-flex items-center justify-center border border-[#7FC7A7] bg-[#7FC7A7]/20 text-[10px] text-white">始</span>
            </span>

            <span class="mx-2 flex flex-col">
              <span class="px-1 text-[18px] text-[18px] font-number">{{ getNearestBus.time }}</span>
              <span class="line inline-block h-[5px] w-full skew-x-30 border-b border-r border-red -mt-1" />
            </span>

            <span class="flex items-center">
              <span class="text-[14px] text-white font-title">{{ $t(`campusName.${getNearestBus.to}`) }}</span>
              <span class="ml-1 size-[16px] inline-flex items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 text-[10px] text-white">终</span>
            </span>
          </div>
        </header>

        <div class="flex-auto overflow-hidden">
          <div v-for="({ label, value }) in timetableTextList" :key="value" class="time-table-list-group relative">
            <label
              class="header h-[30px] flex cursor-pointer items-center justify-between pb-[5px] pl-3"
              :class="collapse === value && 'active'">
              <input :id="`collapse-${value}`" v-model="collapse" type="radio" :value="value" class="hidden">
              <span class="text-[16px] font-text-medium" :class="collapse === value && 'active'">
                {{ isChinese ? label : value }}
              </span>
              <i class="i-ri-arrow-down-s-line text-24px" :class="collapse !== value && 'rotate-180'" />
            </label>

            <div class="time-table-list-group-content my-2 overflow-y-auto transition-all" :class="collapse === value ? 'h-400px' : 'h-0px'">
              <ul class="time-table-list">
                <!-- :class="timeObsolete(time) && 'opacity-30'" -->
                <li
                  v-for="({ time }) in timetableGroup[value]" :key="time"
                  class="time-table-list-item mx-1 mt-1 flex items-center border border-[#FFF3F3]/20 bg-[#000A17]/30 px-3 py-1">
                  <span class="text-[14px] font-text">{{ time }}</span>
                  <span class="line ml-2 inline-block h-[5px] w-[35px] skew-x-30 border-b border-r border-red" />
                  <span
                    class="ml-auto inline-block h-[16px] w-[40px] border text-center text-[10px] text-white"
                    :class="timeObsolete(time) ? 'bg-[#B3B3B3]/30  border-[#727272]' : 'bg-[#7FC7A7]/30  border-[#7FC7A7]'">
                    {{ timeObsolete(time) ? '已过' : '待发车' }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </UiBoxPanel>
    </template>
  </UiViewPanel>
</template>

<style scoped lang="scss">
.navigation-menu {
  height: 160px;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 160px;
    color: transparent;
    background: radial-gradient(#fff 0%, #fff 2px, transparent 2px);
    background-size: 20px 20px;
    background-color: rgba(#cc1a1a, 0.4);
    mask: linear-gradient(to bottom, transparent -20%, #000 50%, transparent 120%);
    z-index: 1;
  }

  .navigation-menu-list {
    width: 160px;
    height: 278px;
    background: url("@/assets/images_new/nemu-bg.png") no-repeat center / cover;
    .navigation-menu-list-item {
      &.active {
        background:
          radial-gradient(ellipse 50px 30px at 50% 30px, #cc1a1a, transparent),
          linear-gradient(to right, transparent, #cc1a1a, transparent) no-repeat left bottom / 100% 1px;
      }
    }
  }

  .screen-btn {
    &.active {
      background: url("@/assets/images_new/btn-bg-active.png") no-repeat center / cover;
    }
  }
}

.time-table-list-group {
  .header {
    background:
      linear-gradient(to right, red, red) no-repeat left bottom / 100% 1px,
      linear-gradient(to right, red, red) no-repeat left top / 1px 25px,
      linear-gradient(to right, red, transparent) no-repeat left top / 100% 1px,
      linear-gradient(to right, red, transparent) no-repeat left 25px / 100% 1px,
      linear-gradient(to right, rgba(#262626, 0.7), rgba(#262626, 0)) no-repeat left top / 100% 25px;
    &.active {
      background:
        linear-gradient(to right, red, red) no-repeat left bottom / 100% 1px,
        linear-gradient(to right, red, red) no-repeat left top / 1px 25px,
        linear-gradient(to right, red, transparent) no-repeat left top / 100% 1px,
        linear-gradient(to right, red, transparent) no-repeat left 25px / 100% 1px,
        linear-gradient(to right, rgba(#f04d4d, 0.7), rgba(#f04d4d, 0)) no-repeat left top / 100% 25px;
    }
  }
}

.time-table-list-group-content {
  background:
    linear-gradient(to right, red, red) no-repeat left bottom / 100% 1px,
    linear-gradient(to right, red, red) no-repeat left top / 1px 100%,
    linear-gradient(to right, red, transparent) no-repeat left top / 100% 1px,
    linear-gradient(to right, red, transparent) no-repeat left bottom / 100% 1px,
    linear-gradient(to right, rgba(#f04d4d, 0.3), rgba(#f04d4d, 0)) no-repeat left top / 100% 100%;
}
</style>
