<script setup lang="ts">
import type { EChartsOption } from "echarts";
import round from "lodash/round";
import area from "@/assets/images/assetManagement/area.png";
import building from "@/assets/images/assetManagement/building.png";
import CampusName from "@/assets/images/assetManagement/campusName.png";
import img from "@/assets/images/assetManagement/circle.png";
import department from "@/assets/images/assetManagement/department.png";
import { useEChartRender } from "@/hooks";
import CampusTypeAssetStatus from "@/views/assetManagement/CampusTypeAssetStatus/index.vue";

const list = ref([
  {
    title: "校区",
    num: "邯郸",
    icon: CampusName,
  },
  {
    title: "面积",
    num: 1000,
    icon: area,
  },
  {
    title: "楼宇",
    num: 21,
    icon: building,
  },
  {
    title: "部门/院系",
    num: 20,
    icon: department,
  },
]);

const state = shallowRef([
  { value: 1048, name: "设备" },
  { value: 735, name: "家具" },
  { value: 580, name: "软件" },
  { value: 484, name: "绿植" },
]);
const color = ["#DE4B47", "#FFD1A4", "#FFFF5A", "#3F9ECD"];
// 资产类型分布
const option = computed(() => {
  const total = state.value.reduce((acc, cur) => acc + cur.value, 0);
  return {
    color,
    tooltip: {
      trigger: "item",
    },
    backgroundColor: {
      // 这里设置背景图片，图片宽高为 200px
      image: img, // 背景图片的URL
      repeat: "no-repeat", // 背景图片不重复
      size: "220px 220px", // 背景图片的大小
      // position: "center center", // 背景图片居中显示
      // padding: [20, 0, 0, 20], // 背景图片的边距
    },
    title: {
      text: `${total}`, // 饼图中间的标题
      subtext: "资产总数", // 饼图中间的副标题
      top: "24%",
      right: "0%",
      left: "22%",
      bottom: 0,
      textStyle: { // 标题样式
        color: "#fff",
        fontSize: 28,
        fontFamily: "D-DIN",
      },
      subtextStyle: { // 副标题样式
        color: "#FFFFFF",
        fontSize: 20,
      },
    },
    legend: {
      orientation: "vertical",
      padding: [20, 0, 0, 0],
      // top: "center",
      right: 30,
      itemGap: 20,
      itemWidth: 12,
      itemHeight: 12,
      height: 200,
      width: 100,
      icon: "circle",
      formatter: (name) => {
        const value = state.value.find(item => item.name === name)?.value || 0;
        const percent = round((value / total) * 100, 2);
        return ` {name|${name}} {percent|${percent}} {symbol|%}`;
      },
      data: state.value.map(({ name, value }, index) => {
        return {
          name,
          itemStyle: {
            color: color[index],
          },
        };
      }),
      textStyle: {
        rich: {
          name: {
            color: "#fff",
            fontSize: 16,
          },
          percent: {
            color: "#fff",
            fontSize: 24,
            fontFamily: "D-DIN",
            padding: [0, 0, 0, 20],
          },
          symbol: {
            width: 8,
            height: 8,
            fontSize: 16,
            fontFamily: "D-DIN",
            color: "#fff",
          },
        },
      },
    },
    series: [
      {
        name: "资产类型分布",
        type: "pie",
        radius: ["50%", "55%"],
        center: ["23%", "37%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 4,
        },
        label: {
          show: false,
          // position: "center",
        },
        labelLine: {
          show: false,
        },
        data: state.value,
      },
    ],
  } as EChartsOption;
});
const chartRef = useTemplateRef<HTMLElement>("chart");
useEChartRender(chartRef, option);

const data = ref([
  { value: 550, name: "在用" },
  { value: 635, name: "已注销" },
  { value: 580, name: "已报废" },
  { value: 484, name: "已退库" },
  { value: 444, name: "待报废" },
  { value: 384, name: "闲置" },
  { value: 284, name: "已盘亏" },
]);
</script>

<template>
  <BoxPanel
    class="row-span-24"
    title="校区概览"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <div class="grid row-span-4 grid-cols-2">
      <div v-for="(item, index) in list" :key="index" class="col-span-1 row-span-3 flex items-center">
        <img class="ml-30px h-52px w-52px" :src="item.icon" alt="" sizes="" srcset="">
        <div class="ml-12px">
          <div class="mb-4px text-18px text-white">
            {{ item.title }}
          </div>
          <div class="flex">
            <GradientText class="text-22px font-bold font-number" :deg="180" :colors="{ 0: '#C8D7E4', 96: '#fff' }">
              {{ item.num }}
            </GradientText>
            <div v-if="index !== 0" class="ml-4px mt-8px text-14px text-white">
              个
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row-span-8 flex flex-col">
      <SecondTitle class="ml-3 mt-2">
        资产类型分布
      </SecondTitle>
      <div class="flex-auto overflow-hidden">
        <div ref="chart" class="ml-14px mt-20px h-240px" />
      </div>
    </div>

    <div class="row-span-12">
      <CampusTypeAssetStatus :data="data" />
    </div>
  </BoxPanel>
</template>

<style scoped>
.title {
  .color {
    width: 14px;
    height: 3px;
    transform: rotate(90deg);
    background: linear-gradient(270deg, #ffb3b3 0%, #ff2626 100%);
    box-shadow: inset 0px 0px 6px 0px rgba(255, 233, 233, 0.43);
  }
}
</style>
