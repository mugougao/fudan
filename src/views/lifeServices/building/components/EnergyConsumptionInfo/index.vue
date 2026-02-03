<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { getBuildTop5Room } from "@/api/lifeServices";
import { createEChartsLinearGradient } from "@/utils";
import dormitoryAreaBuildTop5RoomLayer from "@/utils/WdpMap/lifeServices/DormitoryAreaBuildTop5RoomLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";

defineOptions({ name: "EnergyConsumptionInfo" });

const {
  statistics = { use: 0, purchase: 0 },
  list = [],
} = defineProps<{
  statistics?: { use: number; purchase: number };
  list?: { name: string; value1: number; value2: number }[];
}>();

const emits = defineEmits<{
  top5RoomOpen: [];
}>();

// 楼栋 ID
const buildId = useRouteQuery("buildId") as unknown as Ref<string>;

// 用电量Top5房间
const top5RoomOpen = ref(false);
const top5RoomDetailVisible = ref(false);
const top5RoomDetail = ref<any>({});
watch(top5RoomOpen, (val) => {
  if (val) {
    dormitoryAreaBuildTop5RoomLayer.render(buildId.value);
    emits("top5RoomOpen");
    return;
  }
  dormitoryAreaBuildTop5RoomLayer.remove();
  top5RoomDetailVisible.value = false;
});
function closeTop5Room() {
  top5RoomOpen.value = false;
}

function openTop5RoomDetail(event: any) {
  const { args: { roomId } } = event;
  if (!dormitoryAreaBuildTop5RoomLayer.hasData(roomId)) return;
  const res = dormitoryAreaBuildTop5RoomLayer.getData(roomId);
  top5RoomDetailVisible.value = true;
  top5RoomDetail.value = res;
}

onMounted(() => {
  // const prevRoomId = "";
  wdpMap.addLayer(dormitoryAreaBuildTop5RoomLayer);
  wdpMap.onCreated(() => {
    // dormitoryAreaBuildTop5RoomLayer.on("OnRangeHover", debounce(async (data) => {
    //   if (prevRoomId === data.sourceId) return;
    //   if (prevRoomId) {
    //     const res = dormitoryAreaBuildTop5RoomLayer.renderedRangeMap.get(prevRoomId);
    //     cloudMap.SuperAPI("UpdateRangeStyle", res);
    //   }
    //   prevRoomId = data.sourceId;
    //   const res = dormitoryAreaBuildTop5RoomLayer.renderedRangeMap.get(data.sourceId);
    //   cloudMap.SuperAPI("UpdateRangeStyle", { ...res, color: "3498db80" });
    // }));
    // dormitoryAreaBuildTop5RoomLayer.on("OnRangeClick", (data) => {
    //   const res = dormitoryAreaBuildTop5RoomLayer.rangeServiceData.get(data.sourceId);
    //   top5RoomDetailVisible.value = true;
    //   top5RoomDetail.value = res;
    // });
    // cloudMap.on("elementClick", openTop5RoomDetail);
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(dormitoryAreaBuildTop5RoomLayer);
  // cloudMap.off("elementClick", openTop5RoomDetail);
  top5RoomDetailVisible.value = false;
});

const countList = [
  { name: "dormitory.build.yesterdayUsePower", field: "use", icon: "" },
  { name: "dormitory.build.yesterdayBuyPower", field: "purchase", icon: "" },
];

const energyConsumptionData = computed(() => list.map(({ name, value1, value2 }) => ({ name: `${Number(name)}月`, value1, value2 })));

const { state: top5RoomData, execute: getTop5RoomData } = useAsyncState(async () => {
  const [err, res] = await to(getBuildTop5Room(buildId.value));
  if (err) return [];
  return res?.resultData || [];
}, [], { resetOnExecute: false, immediate: false });

const top5ChartOption = computed(() => {
  const category: string[] = [];
  const values: number[] = [];
  [...top5RoomData.value]
    .sort(({ value: a }, { value: b }) => a - b)
    .forEach(({ fjmc, value }) => {
      category.push(fjmc);
      values.push(value);
    });

  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: value => `${value}KWh` },
    grid: { left: 5, top: 10, right: 20, bottom: 0, containLabel: true },
    xAxis: [{ type: "value", axisLine: { show: false } }],
    yAxis: [{ type: "category", data: category, axisLine: { show: false }, axisTick: { alignWithLabel: true }, axisLabel: { fontFamily: "D-DIN" } }],
    series: [{
      name: "用电量",
      type: "bar",
      barWidth: 6,
      data: values,
      itemStyle: {
        color: createEChartsLinearGradient(["rgba(204,26,26,0.15)", "rgba(204,26,26,0.8)"], [0, 0, 1, 0]),
        borderColor: "#CE7A7A",
        borderWidth: 1,
      },
      label: {
        show: true,
        position: "right",
        formatter: "{dot|}",
        offset: [-10, 0],
        rich: {
          dot: {
            width: 8,
            height: 8,
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
          },
        },
      },
    }],
  } as EChartsOption;
});

whenever(
  () => top5RoomOpen.value,
  () => {
    buildId.value && getTop5RoomData();
  },
);

defineExpose({
  closeTop5Room,
});
</script>

<template>
  <UiBoxPanel
    :title="$t('dormitory.build.energyConsumptionInformation')"
    class="row-span-9"
    content-class-name="flex flex-col">
    <template #titleSuffix>
      <UiSelectBtn v-model="top5RoomOpen" class="mx-2">
        {{ $t('dormitory.build.top5RoomsElectric') }}
      </UiSelectBtn>
    </template>

    <div class="count-box grid grid-cols-2 mx-2 shrink-0 gap-x-2 gap-y-0.5 overflow-hidden">
      <UiCountItemBox
        v-for="({ name, field }, index) in countList" :key="index"
        icon="i-svg-icon-bolt" :name="$t(name)" :value="$_.get(statistics, field, 0)" unit="Kwh" value-vertical />
    </div>

    <div class="flex-auto overflow-hidden">
      <UiChartBarWithLine :data="energyConsumptionData" :legend="['用电量', '同比增长率']" :unit="['Kwh', '%']" />
    </div>
    <!--  房间详情  -->
    <DragPopup
      v-model:visible="top5RoomDetailVisible"
      :title="$t('dormitory.build.top5RoomsDetails')"
      width="340px" top="200px" left="calc(100% - 1150px)"
      :auto-prev-popup="false">
      <ul class="text-16px space-y-2">
        <li>
          <span class="mr-2">{{ $tm('dormitory.build.top5RoomsDetailsField')[0] }}:</span>
          <span>{{ top5RoomDetail?.fjmc }}</span>
        </li>
        <li>
          <span class="mr-2">{{ $tm('dormitory.build.top5RoomsDetailsField')[1] }}:</span>
          <span>{{ top5RoomDetail?.value }}KWh</span>
        </li>
      </ul>
    </DragPopup>
    <!--  top5 弹窗  -->
    <DragPopup v-model:visible="top5RoomOpen" :title="$t('dormitory.build.top5RoomsElectric')" width="340px" top="100px" left="calc(100% - 700px)">
      <RenderEchart :option="top5ChartOption" :height="200" />
    </DragPopup>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count-box {
  li {
    .icon {
      background: url("@/assets/images_new/icon-bg-2.png") no-repeat center;
    }
  }
}
</style>
