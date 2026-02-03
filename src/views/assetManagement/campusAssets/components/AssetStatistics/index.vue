<script setup lang="ts">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "AssetStatistics" });
const props = defineProps<IProps>();

export interface IProps {
  totalNumber: number;
  totalAmount: number;
  list: Record<"设备" | "家具" | "软件", [number, number]>;
}

const countColumns = [
  { title: "assetMgr.totalAssets", field: "totalNumber", suffix: "万个" },
  { title: "assetMgr.totalAmount", field: "totalAmount", suffix: "亿元" },
];
const typeCountList = [
  { title: "设备", fields: ["设备.0", "设备.1"], icon: "i-svg-icon-equipment" },
  { title: "家具", fields: ["家具.0", "家具.1"], icon: "i-svg-icon-furniture" },
  { title: "软件", fields: ["软件.0", "软件.1"], icon: "i-svg-icon-software" },
];
</script>

<template>
  <div :class="cn('asset-statistics row-span-4', $attrs?.class || '')">
    <ul class="count-top mb-2 h-[25px] flex gap-5 px-2">
      <li
        v-for="item in countColumns" :key="item.field"
        class="flex flex-1 items-center">
        <span class="text-[12px] font-text-bold">{{ $t(item.title) }}</span>
        <span class="empty-number ml-auto text-[16px] font-number">{{ get(props, item.field) }}</span>
        <span class="ml-0.5 text-[12px] text-[#C6C6C6] font-text">{{ item.suffix }}</span>
      </li>
    </ul>

    <ul class="type-counts flex items-center justify-evenly">
      <li
        v-for="({ title, fields, icon }) in typeCountList" :key="title"
        class="flex flex-col items-center">
        <span class="icon h-[60px] w-[80px] flex flex-col inline-flex items-center justify-center">
          <i :class="icon" class="mt-3" />
          <span class="text-[12px] font-title">{{ title }}</span>
        </span>
        <span class="text-[12px] text-white/80">
          <span class="from-red to-white bg-gradient-to-b bg-clip-text text-transparent font-number">{{ get(list, fields[0], 0) }}</span>
          <span>万个</span>
        </span>
        <span class="text-[12px] text-white/80">
          <span class="from-[#F7C998] to-white bg-gradient-to-b bg-clip-text text-transparent font-number">{{ get(list, fields[0], 0) }}</span>
          <span>亿元</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.count-top {
  background: url("@/assets/images_new/count-bg-3.png") no-repeat center / 100% 100%;
}
.type-counts .icon {
  background:
    url("@/assets/images_new/icon-bg-main.png") no-repeat -35px -40px / 131px 143px,
    url("@/assets/images_new/icon-bg-main.png") no-repeat -35px -40px / 131px 143px,
    url("@/assets/images_new/icon-bg-main.png") no-repeat -35px -40px / 131px 143px;
}
</style>
