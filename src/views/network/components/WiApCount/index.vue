<script setup lang="ts">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "WiApCount", inheritAttrs: false });

const { data } = defineProps<{
  data?: any;
}>();

const list = [
  { title: "在线AP", field: "runningap", icon: "i-svg-icon-raw-check" },
  { title: "离线AP", field: "offlineap", icon: "i-svg-icon-raw-close" },
];
</script>

<template>
  <div :class="cn('flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="network.wirelessAPStatistics" />
    <div class="chart flex-auto overflow-hidden">
      <div class="count-list relative wh-full flex items-center justify-evenly gap-5">
        <UiCountItem
          v-for="({ title, field, icon }, index) in list" :key="field"
          :name="title" :value="get(data, field, 0)" :icon="icon" unit="个"
          :type="index % 2 ? 'gray' : 'red'" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-list {
  background: linear-gradient(to bottom, rgba(#000, 0), #fff, rgba(#000, 0)) no-repeat center / 1px 50px;
}
</style>
