<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchCampusCardType } from "@/api/campusAccess/campusSchool";
import { CampusId, CampusName } from "@/enums";
import { largestRemainderMethod, numberToThousands } from "@/utils";

defineOptions({ name: "PercentageOfCardTypes" });

// 校区id
const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

const { state, execute } = useAsyncState<{ name: string; value: number }[]>(
  async () => {
    if (campusId.value === CampusId.Overview) return [];
    const campusName = CampusName[campusId.value];
    const [err, res] = await to(fetchCampusCardType(`${campusName}校区`));
    if (err) return [];
    return (res?.resultData || []);
  },
  [],
  { immediate: false, resetOnExecute: false },
);
watch(campusId, () => execute(), { immediate: true });

const color = ["#F37373", "#F7C998", "#778BF1", "#FFFFFF"];
const option = computed(() => {
  const percentList = largestRemainderMethod(state.value);

  return {
    color,
    tooltip: {
      trigger: "item",
      valueFormatter: val => `${val}人次`,
    },
    legend: {
      top: "center",
      right: 0,
      orient: "vertical",
      formatter: (name) => {
        const percent = percentList.find(item => item.name === name)?.percent ?? 0;
        return `{name|${name}}{percent|${numberToThousands(percent)}%}`;
      },
      data: state.value.map((item, index) => {
        const _color = color[index % color.length];
        return {
          name: item.name,
          textStyle: {
            rich: {
              name: {
                color: "#fff",
                fontSize: 12,
                fontFamily: "AlibabaPuHuiTi-3",
                width: 85,
              },
              percent: {
                color: `url(#PercentageOfCardTypes_${_color})`,
                fontSize: 14,
                fontFamily: "D-DIN",
              },
            },
          },
        };
      }),
    },
    series: [
      {
        name: "刷卡类型占比",
        type: "pie",
        radius: [62, 65],
        center: [87, "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        data: state.value,
        emphasis: { scale: false },
        z: 2,
      },
      {
        name: "刷卡类型占比",
        type: "pie",
        radius: [51, 65],
        center: [87, "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        data: state.value,
        emphasis: { scale: false },
        itemStyle: { opacity: 0.2 },
        z: 1,
      },
    ],
  } as EChartsOption;
});
</script>

<template>
  <div class="relative row-span-9 flex flex-col flex-shrink-0">
    <UiSubTitle title-path="campusAccess.percentageOfCardSwipingTypes" class="shrink-0" />
    <div class="chart-box relative flex-auto overflow-hidden">
      <svg width="0" height="0">
        <defs>
          <linearGradient
            v-for="item in color" :id="`PercentageOfCardTypes_${item}`" :key="item"
            x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="item" />
            <stop offset="100%" stop-color="#FFF" />
          </linearGradient>
        </defs>
      </svg>
      <i class="i-svg-icon-raw-user2 absolute left-[72px] top-1/2 text-[24px] -translate-y-1/2" />
      <RenderEchart :option="option" />
    </div>
  </div>
</template>

<style scoped>
.chart-box {
  background: url("@/assets/images_new/pie-bg-4.png") no-repeat 10px center / 153px 153px;
}
</style>
