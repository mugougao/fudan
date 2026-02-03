<script setup lang="ts">
import { replaceTemplate } from "@/utils";

defineOptions({ name: "ElectricInfo", inheritAttrs: false });
const { chartData = [], total = [] } = defineProps<{ sa; chartData?: { name: string; value: number }[]; total?: { yesterday: number; month: number; year: number }[] }>();

const headCells = ["", "", "用水量（万m³）", "金额（万元）"];

const bodyCells = [
  ["日", "昨日用水", "{0.yesterday}", "{1.yesterday}"],
  ["月", "本月用水", "{0.month}", "{1.month}"],
  ["年", "年度用水", "{0.year}", "{1.year}"],
];
</script>

<template>
  <div class="electric-info pt-3">
    <UiThirdTitle title="用水信息" />
    <div class="chart-box mt-2 flex gap-3">
      <div class="w-1/2 pr-2">
        <table class="w-full">
          <thead>
            <tr>
              <th
                v-for="(item, index) in headCells" :key="index">
                <span class="text-[12px] text-white/80 font-400 font-text">
                  {{ item }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cells, rowIndex) in bodyCells" :key="rowIndex">
              <td v-for="cell in cells" :key="`${rowIndex}-${cell}`">
                <div class="bg-[#000A17]/30">
                  <span>{{ replaceTemplate(cell, total) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="h-[170px] w-1/2">
        <UiChartLine :data="chartData" unit="万m³" color="blue" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: linear-gradient(to bottom, transparent 0, #ffffff 50%, transparent 100%) no-repeat center center / 1px
    120px;
  table {
    text-align: center;
    thead {
      tr {
        th {
          line-height: 30px;
        }
      }
    }
    tbody {
      tr {
        td {
          font-family: "D-DIN";
          font-size: 14px;
          line-height: 30px;
          div {
            height: 30px;
            margin-bottom: 4px;
          }
          &:first-child {
            div {
              span {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                line-height: 20px;
                width: 20px;
                height: 20px;
                background: linear-gradient(0deg, rgba(97, 16, 16, 0.12) 0%, rgba(204, 26, 26, 0.6) 100%);
                border-radius: 50%;
                margin-left: 5px;
                border: 1px solid rgba(#c5eefd, 0.3);
              }
            }
          }
          &:nth-child(2) {
            font-family: "AlibabaPuHuiTi-3";
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
