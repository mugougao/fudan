<script setup lang="ts">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "AssetOverview", inheritAttrs: false });

const props = defineProps<{
  totalCount?: [300, number, number]; // [总金额, 资产净值, 总资产数]
  typeCount?: {
    device: [number, number, number]; // [总金额, 资产净值, 总资产数]
    furniture: [number, number, number];
    software: [number, number, number];
    animal: [number, number, number];
  };
}>();

const headerList = [
  { title: "financial.index.device" },
  { title: "financial.index.furniture" },
  { title: "financial.index.software" },
  { title: "financial.index.animal" },
  { title: "financial.index.total" },
];
const rowList = [
  [["financial.index.amount", "(亿元)"], "typeCount.device[0]", "typeCount.furniture[0]", "typeCount.software[0]", "typeCount.animal[0]", "totalCount[0]"],
  [["financial.index.netAssets", "(亿元)"], "typeCount.device[1]", "typeCount.furniture[1]", "typeCount.software[1]", "typeCount.animal[1]", "totalCount[1]"],
  [["financial.index.totalNumber", "(万个)"], "typeCount.device[2]", "typeCount.furniture[2]", "typeCount.software[2]", "typeCount.animal[2]", "totalCount[2]"],
];
</script>

<template>
  <div :class="cn('asset-overview', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.electricityUseOverview" />
    <div class="table-box mt-2 px-1">
      <table class="w-full whitespace-nowrap text-center">
        <thead>
          <tr>
            <th>
              <i class="i-svg-icon-menu-block text-[12px]" />
            </th>
            <th v-for="(item, index) in headerList" :key="index">
              <span class="text-[12px] font-title">{{ $t(item.title) }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rowList" :key="rowIndex">
            <td
              v-for="(cell, cellIndex) in row" :key="cellIndex"
              class="pt-1 children:bg-[#000A17]/30">
              <div class="h-[38px] flex items-center justify-center">
                <template v-if="cellIndex === 0">
                  <span class="flex flex-col text-[12px]">
                    <span class="text-[12px] text-white leading-none">{{ $t(cell[0]) }}</span>
                    <span class="text-[10px] text-white/60 leading-none">{{ cell[1] }}</span>
                  </span>
                </template>
                <template v-else>
                  <span
                    :class="cn(
                      'text-[14px] font-number',
                      cellIndex === row.length - 1 ? ' bg-gradient-to-b from-[#D45F5F] to-white text-transparent bg-clip-text' : 'text-white',
                    )">
                    {{ get(props, cell, 0) }}
                  </span>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.asset-overview {
  .table-box {
    position: relative;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      width: 1px;
      height: 28px;
      background: linear-gradient(
        to bottom,
        #ffd5d5 0%,
        #ffd5d5 3px,
        transparent 3px,
        transparent calc(100% - 3px),
        #ffd5d5 calc(100% - 3px),
        #ffd5d5
      );
    }
    &::before {
      left: 4px;
    }
    &::after {
      right: 4px;
    }
    table {
      thead {
        border-top: 1px #ffd5d5 solid;
        border-bottom: 1px #ffd5d5 solid;
        background: linear-gradient(
          180deg,
          rgba(220, 47, 47, 0.24) 0%,
          rgba(198, 35, 35, 0.73) 77%,
          rgba(220, 47, 47, 0) 109%,
          rgba(220, 47, 47, 0) 169%
        );
      }
    }
  }
}
</style>
