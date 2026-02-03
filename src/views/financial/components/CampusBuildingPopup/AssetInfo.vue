<script setup lang="ts">
import { useState } from "@/hooks";
import AssetInfoDetailPopup from "./AssetInfoDetailPopup.vue";
import { getOption } from "./assetsInfoChartOption.ts";

defineOptions({ name: "AssetsInfo", inheritAttrs: false });

const { total, money, id } = defineProps<{
  total: { name: string;value: number }[];
  money: { name: string;value: number }[];
  id?: string;
}>();

const colors = ["#D45F5F", "#778BF1", "#FFFFFF", "#D45F5F", "#F7C998", "#FFFFFF"];

const option1 = computed(() => getOption({ data: total, unit: "万个", colors: colors.slice(0, 3), title: "资产数量分布", subTitle: "资产总数" }));
const option2 = computed(() => getOption({ data: money, unit: "亿元", colors: colors.slice(3), title: "资产金额分布", subTitle: "资产总额" }));

const [visible, setVisible] = useState(false);
</script>

<template>
  <div class="assets-info relative pt-3">
    <UiThirdTitle title="资产信息" />
    <button class="absolute right-0 top-3 rounded bg-transparent px-1 py-0.5 text-[12px] text-red hover:bg-red/10" @click="setVisible(true)">
      详情
    </button>
    <div class="chart-box h-[150px] flex">
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="assetsInfo_title" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#FFC2C2" />
            <stop offset="100%" stop-color="#ffffff" />
          </linearGradient>
          <linearGradient
            v-for="(color) in colors" :id="`assetsInfo_${color}`"
            :key="color" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" :stop-color="color" />
          </linearGradient>
        </defs>
      </svg>
      <div class="flex-1">
        <RenderEchart :option="option1" />
      </div>
      <div class="flex-1">
        <RenderEchart :option="option2" />
      </div>
    </div>

    <AssetInfoDetailPopup v-model:visible="visible" :building-id="id" />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background:
    url("@/assets/images_new/pie-bg.png") no-repeat 10px center / 108px 115px,
    url("@/assets/images_new/pie-bg.png") no-repeat calc(50% + 54px + 10px) center / 108px 115px,
    linear-gradient(to bottom, transparent 0, #ffffff 50%, transparent 100%) no-repeat center center / 1px 120px;
}
</style>
