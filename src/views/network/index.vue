<script setup lang="ts">
import usePanelCountData from "@/composables/network/usePanelCountData.ts";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute";
import APNumberDistribution from "./components/APNumberDistribution/index.vue";
import DeviceNumberStats from "./components/DeviceNumberStats/index.vue";
import HealthDistribution from "./components/HealthDistribution/index.vue";
import OnlineUsersTerminals from "./components/OnlineUsersTerminals/index.vue";
import SideToolBar from "./components/SideToolBar/index.vue";
import SSIDDistribution from "./components/SSIDDistribution/index.vue";
import TopCountBar from "./components/TopCountBar/index.vue";
import TrafficComparison from "./components/TrafficComparison/index.vue";
import UserTerminalTrends from "./components/UserTerminalTrends/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "network.index",
  campusRouteName: "network.campus",
});

const {
  topCountState,
  APData,
  userAndTerminalData,
  deviceCountState,
  healthCountState,
  ssidCountState,

  userOrTerminalStateType,
  trafficDataType,
  userOrTerminalState,
  trafficData,
} = usePanelCountData();
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title-path="network.campusOverview" class="row-span-24" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
        <!-- 四校区AP数量分布 -->
        <APNumberDistribution class="row-span-6" :data="APData" />
        <!-- 设备数量统计 -->
        <DeviceNumberStats class="row-span-6" :title="$t('network.deviceNumberCount')" sub-title="AP数量" :data="deviceCountState" />
        <!-- 健康度分布 -->
        <HealthDistribution class="row-span-5 [&>.chart]:py-1" :data="healthCountState" />
        <!-- SSID信道分布 -->
        <SSIDDistribution class="row-span-7" :data="ssidCountState.data" :rate5g="ssidCountState.rate5G" />
      </UiBoxPanel>
    </template>
    <template #right>
      <UiBoxPanel title-path="network.campusUserStatistics" class="row-span-24" content-class-name="grid grid-cols-1 grid-rows-24 px-3">
        <!-- 四校区在线用户&终端分布 -->
        <OnlineUsersTerminals class="row-span-8" :data="userAndTerminalData" />
        <!-- 用户/终端变化趋势 -->
        <UserTerminalTrends v-model:time-type="userOrTerminalStateType" class="row-span-8" :data="userOrTerminalState" />
        <!-- 流量对比 -->
        <TrafficComparison v-model:time-type="trafficDataType" class="row-span-8" :data="trafficData" />
      </UiBoxPanel>
    </template>

    <TopCountBar class="absolute left-1/2 top-0 -translate-x-1/2" :data="topCountState" />
    <SideToolBar class="absolute bottom-20 left-5" />
  </UiViewPanel>
</template>

<style scoped lang="scss">

</style>
