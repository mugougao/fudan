<script setup lang="ts">
import type { EChartsOption } from "echarts";
import campus from "@/assets/images/assetManagement/campus.png";
import device from "@/assets/images/assetManagement/device.png";
import furniture from "@/assets/images/assetManagement/furniture.png";
import greenPlants from "@/assets/images/assetManagement/greenPlants.png";
import software from "@/assets/images/assetManagement/software.png";
import { useEChartRender } from "@/hooks";

const list = ref([
  {
    title: "设备",
    num: 10,
    icon: device,
  },
  {
    title: "家具",
    num: 10,
    icon: furniture,
  },
  {
    title: "软件",
    num: 20,
    icon: software,
  },
  {
    title: "绿植",
    num: 30,
    icon: greenPlants,
  },
]);

const CampusList = ref([
  {
    id: 1,
    child: [
      {
        title: "邯郸",
        square: 41300,
        icon: campus,
        floor: 41,
        property: 1000,
      },
    ],
  },
  {
    id: 2,
    child: [
      {
        title: "江湾",
        square: 41300,
        icon: campus,
        floor: 41,
        property: 1000,
      },
    ],
  },
  {
    id: 3,
    child: [
      {
        title: "枫林",
        square: 41300,
        icon: campus,
        floor: 41,
        property: 1000,
      },
    ],
  },
  {
    id: 4,
    child: [
      {
        title: "张江",
        square: 41300,
        icon: campus,
        floor: 41,
        property: 1000,
      },
    ],
  },
]);

const option = computed(() => {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["邯郸", "江湾", "枫林", "张江"],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "单位/栋",
      },
    ],
    series: [
      {
        name: "数量",
        type: "bar",
        data: [52, 200, 334, 390],
        barWidth: 16,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#6FCCFF" },
              { offset: 1, color: "rgba(160, 189, 220, 0) " },
            ],
            global: false,
          },
        },
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);
</script>

<template>
  <BoxPanel
    class="row-span-24"
    title="校区总览"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <div class="row-span-5 flex justify-between px-12px pt-18px">
      <div class="left mt-24px flex justify-between">
        <div>
          <div class="flex">
            <div class="text-24px text-white font-bold font-number">
              1000
            </div>
            <div class="ml-4px mt-12px text-14px text-white font-bold">
              个
            </div>
          </div>
          <div class="ml-6px mt-7px text-16px text-white">
            资产总数
          </div>
        </div>
        <div class="line" />
      </div>
      <div class="right grid grid-cols-2 grid-rows-2">
        <div v-for="(item, index) in list" :key="index" class="col-span-1 row-span-1 flex items-center justify-between">
          <img class="h-52px w-52px" :src="item.icon" alt="" sizes="" srcset="">
          <div>
            <div class="mb-4px text-16px text-white">
              {{ item.title }}
            </div>
            <div class="flex">
              <GradientText class="text-22px font-bold font-number" :deg="180" :colors="{ 0: '#fff', 96: '#CAF2FF' }">
                {{ item.num }}
              </GradientText>
              <div class="ml-4px mt-8px text-14px text-white">
                个
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row-span-9 flex flex-col">
      <SecondTitle class="ml-3">
        四校区资产数量分布
      </SecondTitle>
      <div ref="chart" class="flex-auto overflow-hidden" />
    </div>

    <div class="row-span-10 flex flex-col">
      <SecondTitle class="ml-3">
        四校区详情
      </SecondTitle>
      <div v-for="(item, index) in CampusList" :key="index" class="grid grid-cols-1 grid-rows-4 flex-auto overflow-hidden">
        <div v-for="(subItem, subIndex) in item.child" :key="subIndex" class="grid row-span-1 grid-cols-10">
          <div class="col-span-2">
            <img class="mt-14px h-52px w-78px" :src="subItem.icon" alt="" sizes="" srcset="">
          </div>
          <div class="col-span-1">
            <div class="text-22px text-#D4D4D4 font-bold">
              {{ subItem.title }}
            </div>
          </div>
          <div class="col-span-3 flex">
            <div>
              <div class="mb-10px mt-4px text-12px text-#D4D4D4">
                校区面积
              </div>
              <div class="flex">
                <GradientText class="text-24px font-bold font-number" :deg="180" :colors="{ 0: '#fff', 96: '#fff' }">
                  {{ subItem.square }}
                </GradientText>
                <div class="ml-4px mt-8px text-16px text-white font-bold">
                  m²
                </div>
              </div>
            </div>
            <div class="borderRight ml-12px" />
          </div>
          <div class="col-span-2 flex">
            <div class="mr-20px">
              <div class="mb-10px mt-4px text-12px text-#D4D4D4">
                楼宇数量
              </div>
              <div class="flex">
                <GradientText class="text-24px font-bold font-number" :deg="180" :colors="{ 0: '#fff', 96: '#fff' }">
                  {{ subItem.floor }}
                </GradientText>
                <div class="ml-4px mt-8px text-16px text-white font-bold">
                  栋
                </div>
              </div>
            </div>
            <div class="borderRight" />
          </div>
          <div class="col-span-2">
            <div>
              <div class="mb-10px mt-4px text-12px text-#D4D4D4">
                资产数量
              </div>
              <div class="flex">
                <GradientText class="text-24px font-bold font-number" :deg="180" :colors="{ 0: '#fff', 96: '#fff' }">
                  {{ subItem.property }}
                </GradientText>
                <div class="ml-4px mt-8px text-16px text-white font-bold">
                  个
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxPanel>
</template>

<style scoped>
.left {
  width: 130px;
  height: 78px;
  .line {
    width: 2px;
    height: 78px;
    background: url("@/assets/images/assetManagement/line.png");
    background-size: 100% 100%;
  }
}
.right {
  width: calc(100% - 150px);
}
.borderRight {
  width: 2px;
  height: 70px;
  background: url("@/assets/images/assetManagement/line.png");
  background-size: 100% 100%;
}
</style>
