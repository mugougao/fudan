<script setup lang="ts">
// import to from "await-to-js";
// import { fetchCampusOverview, type IFetchCampusOverviewResult } from "@/api/campusAccess/campusSchool";
import CampusSchoolCampusOverviewSwipeNum from "@/views/campusAccess/campusSchoolCampusOverviewSwipeNum/index.vue";
import TodaysSituation from "@/views/campusAccess/todaysSituation/index.vue";

// 模拟数据：校园概览
const mockCampusOverviewData = {
  jxrsfb: [
    { name: "邯郸校区", value: 1250 },
    { name: "江湾校区", value: 980 },
    { name: "枫林校区", value: 750 },
    { name: "张江校区", value: 520 },
  ],
  skjxsl: [
    {
      name: "邯郸校区",
      value: [
        { name: "校门1", value: 320 },
        { name: "校门2", value: 280 },
        { name: "校门3", value: 240 },
        { name: "校门4", value: 180 },
      ],
    },
    {
      name: "江湾校区",
      value: [
        { name: "校门1", value: 250 },
        { name: "校门2", value: 220 },
        { name: "校门3", value: 190 },
        { name: "校门4", value: 150 },
      ],
    },
    {
      name: "枫林校区",
      value: [
        { name: "校门1", value: 200 },
        { name: "校门2", value: 180 },
        { name: "校门3", value: 160 },
        { name: "校门4", value: 120 },
      ],
    },
    {
      name: "张江校区",
      value: [
        { name: "校门1", value: 150 },
        { name: "校门2", value: 130 },
        { name: "校门3", value: 110 },
        { name: "校门4", value: 90 },
      ],
    },
  ],
  crksl: [
    { name: "邯郸校区", value: 8 },
    { name: "江湾校区", value: 6 },
    { name: "枫林校区", value: 5 },
    { name: "张江校区", value: 4 },
  ],
};

const { state } = useAsyncState<typeof mockCampusOverviewData>(
  async () => {
    return mockCampusOverviewData;
  },
  mockCampusOverviewData,
  { immediate: true, resetOnExecute: false },
);

// 今日进校总人数
const todayEnterTheSchoolTotal = computed(() => (state.value.jxrsfb || []).reduce((pre, cur) => pre + cur.value, 0));

// 四校区出入口数量
const numberOfEntrancesAndExits = computed(() => {
  const sortIndex = ["邯郸校区", "江湾校区", "枫林校区", "张江校区"];
  return (state.value?.crksl || []).sort(({ name: a }, { name: b }) => sortIndex.indexOf(a) - sortIndex.indexOf(b));
});
</script>

<template>
  <UiBoxPanel
    class="row-span-24"
    title-path="campusAccess.campusOverview"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <div class="row-span-6 flex flex-col">
      <UiSubTitle title-path="campusAccess.entranceAndExitNumber" class="shrink-0" />
      <div class="grid grid-cols-2 mx-1 flex-auto place-content-center gap-x-3 gap-y-2 overflow-hidden">
        <UiCountItemBox
          v-for="({ name, value }, index) in numberOfEntrancesAndExits" :key="`${name}-${index}`"
          class="col-span-1"
          icon="i-svg-icon-build" :name="name" :value="value" unit="个">
          <template #name>
            <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[14px] text-transparent font-title">{{ name }}</span>
          </template>
        </UiCountItemBox>
      </div>
    </div>

    <div class="row-span-9 flex flex-col">
      <UiSubTitle title-path="campusAccess.numberOfEntriesByCard" class="shrink-0" />
      <div class="flex-auto overflow-hidden">
        <CampusSchoolCampusOverviewSwipeNum :data="state.skjxsl || []" />
      </div>
    </div>

    <div class="row-span-9 flex flex-col">
      <UiSubTitle title-path="campusAccess.todayEnterTheSchoolDistribution" class="shrink-0" />
      <UiCountItemStrip icon="i-svg-icon-raw-userChart" :name="$t('campusAccess.todayEnterTheSchoolTotal')" :value="todayEnterTheSchoolTotal" unit="人次" />
      <div class="flex-auto overflow-hidden">
        <TodaysSituation :data="state.jxrsfb || []" />
      </div>
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
</style>
