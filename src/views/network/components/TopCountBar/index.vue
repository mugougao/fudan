<script setup lang="ts">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "TopCountBar", inheritAttrs: false });

const { data = {} } = defineProps<{ data?: any }>();

const list = [
  {
    icon: "i-svg-icon-ac",
    children: [
      { label: "在线AC", field: "runningac" },
    ],
  },
  {
    icon: "i-svg-icon-ap",
    children: [
      { label: "在线AP", field: "runningap" },
      { label: "离线AP", field: "offlineap" },
    ],
  },
  {
    icon: "i-svg-icon-terminal",
    children: [
      { label: "终端设备", field: "countac" },
      { label: "用户设备", field: "userac" },
    ],
  },
  {
    icon: "i-svg-icon-traffic",
    children: [
      { label: "上行流量", field: "sumrx", suffix: "Gbps" },
      { label: "下行流量", field: "sumtx", suffix: "Gbps" },
    ],
  },
] as any;
//
</script>

<template>
  <ul :class="cn('top-count-bar inline-flex gap-x-8 whitespace-nowrap items-center', $attrs.class ?? '')">
    <li v-for="(item, index) in list" :key="index" class="top-count-bar-item flex">
      <div class="icon size-[50px] flex-center">
        <i :class="item.icon" class="mb-1 from-[#FFC2C2] to-white bg-gradient-to-b text-[20px]" />
      </div>
      <div class="content ml-1 h-[50px] px-1 py-1 leading-none">
        <div class="h-full flex gap-5 bg-[#000A17]/40 px-5 backdrop-blur">
          <div
            v-for="(child) in item.children" :key="child.field"
            class="flex flex-col items-center justify-center text-white">
            <span class="mb-[2px] text-[12px] font-text-medium">{{ child.label }}</span>
            <span class="font-bold font-number">
              <span class="text-[18px]">{{ get(data, child.field, 0) }}</span>
              <span v-if="child?.suffix" class="text-[12px]">{{ child?.suffix }}</span>
            </span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.top-count-bar {
  .top-count-bar-item {
    .icon {
      background-image: url("@/assets/images_new/icon-bg.png");
      background-repeat: no-repeat;
      background-size: 64px 54px;
      background-position: -7px 0px;
    }
    .content {
      position: relative;
      &::after,
      &::before {
        content: "";
        position: absolute;
        top: 0;
        width: 6px;
        height: 100%;
        border: 2px #ff6363 solid;
      }
      &::after {
        right: 0px;
        border-left: none;
      }
      &::before {
        left: 0px;
        border-right: none;
      }
    }
  }
}
</style>
