<script setup lang="ts">
import get from "lodash/get";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "FinancialCategoriesCount", inheritAttrs: false });

const { data = {} } = defineProps<{
  data?: any;
}>();

const modelValue = defineModel<string | undefined>("modelValue", { default: undefined });

const columns = [
  { title: "financial.index.assetNetValue", key: "asset", field: "asset", suffix: "亿元", icon: "i-svg-icon-asset", tooltip: "年环比增长率" },
  { title: "financial.index.yearUsePower", key: "electric", field: "electric", suffix: "万元", icon: "i-svg-icon-electric", tooltip: "年环比增长率" },
  { title: "financial.index.yearUseWater", key: "waterUse", field: "waterUse", suffix: "万元", icon: "i-svg-icon-waterUse", tooltip: "年环比增长率" },
  { title: "financial.index.safetyProperty", key: "property", field: "property", suffix: "万元", icon: "i-svg-icon-property", tooltip: "年环比增长率" },
  { title: "financial.index.campusRepair", key: "repair", field: "repair", suffix: "万元", icon: "i-svg-icon-repair", tooltip: "年环比增长率" },
];

function setModelValue(value: string | undefined) {
  if (value === modelValue.value) {
    modelValue.value = undefined;
    return;
  }
  modelValue.value = value;
}
</script>

<template>
  <ul class="financial-categories-count flex flex-col gap-y-2 px-1">
    <li
      v-for="({ title, key, field, icon, suffix }) in columns" :key="field"
      class="group financial-categories-count-item h-[80px] cursor-pointer"
      :class="modelValue === key ? 'active' : ''"
      @click="setModelValue(key)">
      <div class="icon-box inline-block">
        <span class="icon-box-bg" />
        <span class="absolute left-5 top-1/2 -translate-y-1/2">
          <i
            :class="cn(
              icon,
              ' to-white bg-gradient-to-b text-4xl',
              modelValue === key ? 'from-[#FFBF7A]' : 'from-[#FFC2C2]',
            )" />
        </span>
      </div>
      <div class="content-box inline-block">
        <div class="content-box-bg" />
        <div class="pl-15">
          <span class="block h-[30px] text-base leading-[30px] font-title">{{ $t(title) }}</span>
          <span class="flex items-baseline justify-between pr-5">
            <span
              class="empty-number text-[26px] font-number"
              :class="modelValue === key ? 'from-[#F7C998] to-white bg-gradient-to-b text-transparent bg-clip-text' : 'text-white/60'">
              {{ numberToThousands(get(data, field)) }}
            </span>
            <span class="text-[14px] text-[#C6C6C6]">{{ suffix }}</span>
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.financial-categories-count {
  .financial-categories-count-item {
    .icon-box {
      width: 120px;
      height: 100%;
      position: relative;
      overflow: hidden;
      .icon-box-bg {
        position: absolute;
        inset: 0;
        display: inline-block;
        width: 120px;
        height: 100%;
        background-color: rgba(#cc1a1a, 0.6);
        border: 1px rgba(#fff3f3, 0.2) solid;
        transform: skewX(-30deg) translateX(-25px);
        mask: linear-gradient(50deg, rgba(#000, 1) 50%, rgba(#000, 0) 100%);
        & + span {
          display: inline-block;
          -webkit-box-reflect: below 1px linear-gradient(transparent, #0000001a);
        }
      }

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 2px;
        background: linear-gradient(
          to bottom,
          #ffe5e5,
          #ffe5e5 2px,
          rgba(#ffe5e5, 0.2) 2px,
          rgba(#ffe5e5, 0.2) calc(100% - 2px),
          #ffe5e5
        );
      }
    }

    .content-box {
      margin-left: -50px;
      width: calc(100% - 70px);
      height: 100%;
      position: relative;
      overflow: hidden;
      .content-box-bg {
        position: absolute;
        top: 0;
        left: 30px;
        width: calc(100% + 20px);
        height: 100%;
        background:
          linear-gradient(to right, #cc1a1a, #cc1a1a) no-repeat left top / 2px 30px,
          linear-gradient(to right, rgba(#cc1a1a, 0.3), rgba(#fff3f3, 0)) no-repeat left top / 100% 30px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left 1px / 1px calc(100% - 2px),
          linear-gradient(to right, rgba(#000a17, 0.3), transparent);
        transform: skewX(-30deg);
        z-index: 1;
        & + div {
          position: relative;
          z-index: 2;
        }
      }
    }
  }

  .financial-categories-count-item.active {
    .icon-box-bg {
      background-color: rgba(#eabc8b, 0.8);
    }
    .content-box {
      .content-box-bg {
        background:
          linear-gradient(to right, #eabc8b, #eabc8b) no-repeat left top / 2px 30px,
          linear-gradient(to right, rgba(#eabc8b, 0.3), rgba(#fff3f3, 0)) no-repeat left top / 100% 30px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left 1px / 1px calc(100% - 2px),
          linear-gradient(270deg, rgba(#000a17, 0.3), rgba(#000a17, 0.06));
      }
    }
  }
}
</style>
