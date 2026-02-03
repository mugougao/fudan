<script setup lang="ts">
import get from "lodash/get";
import { cn, replaceTemplate } from "@/utils";

defineOptions({ name: "UsageData", inheritAttrs: false });

const data = {
  durationIn: 718.66,
  appointmentIn: 327,
  chargesIn: 287683.76,
  durationOut: 4.98,
  appointmentOut: 3,
  chargesOut: 5050,
};

 

const columns = [
  ["", "校内", "校外"],
  ["<i class='i-svg-icon-clock text-[12px] bg-gradient-to-b from-[#FFC2C2] to-white'></i>时长", "{durationIn}<span class='text-[12px] text-white/60'>小时</span>", "{durationOut}<span class='text-[12px] text-white/60'>小时</span>"],
  ["<i class='i-svg-icon-clock text-[12px] bg-gradient-to-b from-[#FFC2C2] to-white'></i>预约", "{appointmentIn}<span class='text-[12px] text-white/60'>次</span>", "{appointmentOut}<span class='text-[12px] text-white/60'>次</span>"],
  ["<i class='i-svg-icon-moneybox text-[12px] bg-gradient-to-b from-[#FFC2C2] to-white'></i>收费", "{chargesIn}<span class='text-[12px] text-white/60'>元</span>", "{chargesOut}<span class='text-[12px] text-white/60'>元</span>"],
];
</script>

<template>
  <div :class="cn('usage-data overflow-hidden', $attrs.class ?? '')">
    <UiSubTitle title="使用数据" />
    <div class="count-box my-2 flex items-center gap-1">
      <div class="dot-border">
        <div>
          <span>723.64</span>
          <span>小时</span>
          <span>使用时长</span>
        </div>
      </div>
      <div class="dot-border">
        <div>
          <span>330</span>
          <span>次</span>
          <span>预约次数</span>
        </div>
      </div>
      <div class="dot-border">
        <div>
          <span>292733.76</span>
          <span>元</span>
          <span>收费</span>
        </div>
      </div>
    </div>

    <div class="count-table text-center mt-5">
      <div class="row flex">
        <div
          v-for="(item, index) in columns[0]" :key="index"
          class="cell text-[14px] text-white font-title first:w-[70px] first:shrink-0 not-first:grow">
          {{ item }}
        </div>
      </div>
      <div v-for="(column, index) in columns.slice(1)" :key="index" class="row body mt-2 h-[42px] flex leading-[42px]">
        <div
          v-for="col in column" :key="col"
          class="cell text-[16px] text-white flex items-center gap-0.5 justify-center font-text-medium first:w-[70px] first:shrink-0 not-first:grow first:text-[14px] first:text-white first:font-title"
          v-html="replaceTemplate(col, data)">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-box {
  & > div {
    flex: 1;
    padding: 5px;
    & > div {
      border: 1px rgba(#fff3f3, 0.1) solid;
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 5px;
      span {
        line-height: 1;
        &:last-child {
          font-size: 14px;
          display: block;
          width: 100%;
          text-align: center;
          padding: 2px 0;
          background: linear-gradient(
            90deg,
            rgba(204, 26, 26, 0.04) 0%,
            rgba(204, 26, 26, 0.4) 50%,
            rgba(204, 26, 26, 0) 100%
          );
          border: 1px solid;
          border-image: linear-gradient(270deg, rgba(255, 243, 243, 0) 0%, #fff3f3 49%, rgba(255, 243, 243, 0) 100%) 0.4;
        }
        &:nth-child(2) {
          font-size: 12px;
          color: rgba(#fff, 0.6);
        }
        &:first-child {
          font-size: 22px;
          font-family: "D-DIN";
        }
      }
    }
  }
}

.count-table {
  .body {
    background: url("@/assets/images_new/list-bg-4.png") no-repeat center;
  }
}
</style>
