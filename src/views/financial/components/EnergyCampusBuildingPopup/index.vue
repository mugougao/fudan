<script setup lang="ts">
import to from "await-to-js";
import dayjs from "dayjs";
import { merge } from "lodash";
import { fetchBuildingPointDetail } from "@/api/financial/energy.ts";
import { replaceTemplate } from "@/utils";

defineOptions({ name: "EnergyCampusBuildingPopup", inheritAttrs: false });

const { title, id } = defineProps<{
  title: string;
  id?: string;
}>();

const emits = defineEmits<{
  close: [];
}>();

const visible = defineModel<boolean>("visible", { default: false });

const defaultState = {
  water: {
    count: [
      { yesterday: 0, month: 0, year: 0 },
      { yesterday: 0, month: 0, year: 0 },
    ],
    chartData: { day: [], month: [] },
  },
  electricity: {
    count: [
      { yesterday: 0, month: 0, year: 0 },
      { yesterday: 0, month: 0, year: 0 },
    ],
    chartData: { day: [], month: [] },
  },
};
const {
  state,
  execute,
} = useAsyncState(
  async () => {
    if (!id) return defaultState;
    const [,res] = await to(fetchBuildingPointDetail(id));
    const { ydxx = {}, rlb = [], ylb = [] } = res?.resultData || {};

    return {
      water: {
        count: [
          { yesterday: ydxx?.daywater, month: ydxx?.monthwater, year: ydxx?.yearwater },
          { yesterday: ydxx?.daywaterAmount, month: ydxx?.monthwaterAmount, year: ydxx?.yearwaterAmount },
        ],
        chartData: {
          day: (rlb ?? []).map(({ updatetime, daywater }) => ({ name: updatetime, value: daywater })),
          month: (ylb ?? []).map(({ updatetime, daywater }) => ({ name: updatetime, value: daywater })),
        },
      },
      // 电
      electricity: {
        count: [
          { yesterday: ydxx?.dayelect, month: ydxx?.monthelect, year: ydxx?.yearelect },
          { yesterday: ydxx?.dayelectAmount, month: ydxx?.monthelectAmount, year: ydxx?.yearelectAmount },
        ],
        chartData: {
          day: (rlb ?? []).map(({ updatetime, dayelect }) => ({ name: updatetime, value: dayelect })),
          month: (ylb ?? []).map(({ updatetime, dayelect }) => ({ name: updatetime, value: dayelect })),
        },
      },
    };
  },
  defaultState,
  { immediate: false, resetOnExecute: false },
);

watch(
  () => [visible.value, id],
  ([visible, id]) => {
    if (visible && id) execute();
  },
);

const headCells = [
  ["", "", "用电量（万Kwh）", "金额（万元）"],
  ["", "", "用水量（万m³）", "金额（万元）"],
];

const bodyCells = [
  ["日", "昨日用电", "{0.yesterday}", "{1.yesterday}"],
  ["月", "本月用电", "{0.month}", "{1.month}"],
  ["年", "年度用电", "{0.year}", "{1.year}"],

  ["日", "昨日用水", "{0.yesterday}", "{1.yesterday}"],
  ["月", "本月用水", "{0.month}", "{1.month}"],
  ["年", "年度用水", "{0.year}", "{1.year}"],
];

const timeType = ref({ electric: "day", water: "day" });
const timeTypeOptions = [
  { label: "日", value: "day" },
  { label: "月", value: "month" },
];

const electricData = computed(() => {
  return (
    timeType.value.electric === "day"
      ? state.value.electricity.chartData.day
      : state.value.electricity.chartData.month
  )
    ?.slice()
    ?.reverse();
});

const waterData = computed(() => {
  return (timeType.value.water === "day"
    ? state.value.water.chartData.day
    : state.value.water.chartData.month)
    ?.slice()
    ?.reverse();
});

function mergeOption1(option) {
  return merge(option, {
    xAxis: {
      axisLabel: {
        formatter: name => dayjs(name).format(timeType.value.electric === "day" ? "M/D" : "M月"),
      },
    },
  });
}

function mergeOption2(option) {
  return merge(option, {
    xAxis: {
      axisLabel: {
        formatter: name => dayjs(name).format(timeType.value.water === "day" ? "M/D" : "M月"),
      },
    },
  });
}
</script>

<template>
  <DragPopup
    v-model:visible="visible" :title="title" :width="640" :left="360" :top="100"
    @close="() => emits('close')">
    <UiThirdTitle title="用电（分项详情）" />
    <div class="chart-box mt-5 h-[160px] flex gap-5">
      <div class="w-[280px] shrink-0">
        <table class="w-full">
          <thead>
            <tr>
              <th
                v-for="(item, index) in headCells[0]" :key="index">
                <span class="text-[12px] text-white/80 font-400 font-text">
                  {{ item }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cells, rowIndex) in bodyCells.slice(0, 3)" :key="rowIndex">
              <td v-for="cell in cells" :key="`${rowIndex}-${cell}`">
                <div class="bg-[#000A17]/30">
                  <span>{{ replaceTemplate(cell, state.electricity.count) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="relative flex-auto overflow-hidden">
        <SegmentedRadioGroup v-model="timeType.electric" :options="timeTypeOptions" class="absolute right-0 top-0 z-9" />
        <UiChartLine
          :data="electricData" unit="万Kwh" color="green"
          :merge-option="mergeOption1" />
      </div>
    </div>

    <UiThirdTitle title="用水（分项详情）" />
    <div class="chart-box mt-5 h-[160px] flex gap-5">
      <div class="w-[280px] shrink-0">
        <table class="w-full">
          <thead>
            <tr>
              <th
                v-for="(item, index) in headCells[1]" :key="index">
                <span class="text-[12px] text-white/80 font-400 font-text">
                  {{ item }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cells, rowIndex) in bodyCells.slice(3)" :key="rowIndex">
              <td v-for="cell in cells" :key="`${rowIndex}-${cell}`">
                <div class="bg-[#000A17]/30">
                  <span>{{ replaceTemplate(cell, state.water.count) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="relative flex-auto overflow-hidden">
        <SegmentedRadioGroup v-model="timeType.water" :options="timeTypeOptions" class="absolute right-0 top-0 z-9" />
        <UiChartLine
          :data="waterData" unit="万m³" color="blue"
          :merge-option="mergeOption2" />
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">
.chart-box {
  background: linear-gradient(to bottom, transparent 0, #ffffff 50%, transparent 100%) no-repeat 295px center / 1px
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
