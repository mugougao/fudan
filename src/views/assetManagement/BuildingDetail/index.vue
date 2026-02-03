<script setup lang="tsx">
import type { IScrollTableBoardColumn } from "@/components/ScrollBoardTable/index.vue";
import GradientText from "@/components/GradientText/index.tsx";
import BuildingDetailPropertyType from "@/views/assetManagement/BuildingDetailPropertyType/index.vue";

defineOptions({ name: "BuildingDetail" });

const buildingDetail = ref(false);

function NumberText(value: string) {
  return (
    <div class="text-24px font-number">
      <GradientText deg={0} colors={{ 0: "#92C9F1", 100: "#FFFFFF" }}>
        {value}
      </GradientText>
    </div>
  );
}
function NumberText1(value: string) {
  return (
    <div class="text-22px font-number">
      <GradientText deg={0} colors={{ 0: "#92C9F1", 100: "#FFFFFF" }}>
        {value}
      </GradientText>
    </div>
  );
}
function NumberText2(value: string) {
  return (
    <div class="text-16px font-500" onClick={() => showDetails(value)}>
      <GradientText deg={0} colors={{ 0: "#92C9F1", 100: "#FFFFFF" }}>
        {value}
      </GradientText>
    </div>
  );
}
function showDetails(value: any) {
  buildingDetail.value = true;
}
const tableColumns: IScrollTableBoardColumn[] = [
  { title: "序号", field: "id", width: 80, align: "center" },
  { title: "院系/部门", field: "colleges", className: "!text-18px text-#9E9E9E", ellipsis: true },
  { title: "使用房间数量", field: "num", width: 100, align: "center", render: ({ value }) => NumberText1(`${value}间`) },
  { title: "使用面积", field: "area", width: 80, align: "center", render: ({ value }) => NumberText(`${value}m²`) },
  { title: "操作", field: "percent", className: "cursor-pointer", width: 80, align: "center", render: ({ value }) => NumberText2(`${value}`) },
];
const tableData = Array.from({ length: 10 }, (_, index) => {
  return {
    id: index + 1,
    colleges: "信息办",
    num: 100,
    area: "70",
    percent: "详情",
  };
});

const list = ["资产状态", "资产类型"];
const activeIndex = ref(0);
function clickTab(index: any) {
  activeIndex.value = index;
}

const data = ref([
  { value: 550, name: "在用" },
  { value: 635, name: "已注销" },
  { value: 580, name: "已报废" },
  { value: 484, name: "已退库" },
  { value: 444, name: "待报废" },
  { value: 384, name: "闲置" },
  { value: 284, name: "已盘亏" },
]);

const tableColumnsDetail: IScrollTableBoardColumn[] = [
  { title: "序号", field: "id", width: 80, align: "center" },
  { title: "部门", field: "colleges", width: 100, ellipsis: true, className: "!text-16px text-#AFB9C3" },
  { title: "房间号", field: "num", width: 100, align: "center", className: "!text-16px text-#AFB9C3" },
  { title: "名称", field: "name", width: 80, align: "center", className: "!text-16px text-#AFB9C3" },
  { title: "用途", field: "purpose", width: 140, align: "center", className: "!text-16px text-#AFB9C3", ellipsis: true },
  { title: "面积", field: "area", width: 80, align: "center", render: ({ value }) => NumberText(`${value}m²`), className: "!text-16px text-#AFB9C3" },
  { title: "所含资产数量", field: "propertyNum", width: 120, align: "center", render: ({ value }) => NumberText(`${value}`), className: "!text-16px text-#AFB9C3" },
  { title: "待报废数量", field: "scrap", width: 80, align: "center", render: ({ value }) => NumberText(`${value}`), className: "!text-16px text-#AFB9C3" },
];
const tableDataDetail = Array.from({ length: 10 }, (_, index) => {
  return {
    id: index + 1,
    colleges: "信息办",
    num: "1101-1",
    name: "机房",
    purpose: "学校其他辅助用房",
    area: "70",
    propertyNum: "100",
    scrap: "12",
  };
});
</script>

<template>
  <BoxPanel
    class="row-span-24"
    title="楼宇详情"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <div class="grid row-span-4 grid-cols-2">
      <div class="col-span-1 row-span-4 flex items-center justify-center">
        <div class="flex items-center justify-between">
          <div class="teachingBuilding">
            <GradientText class="ml-20px mt-10px text-20px font-500" :deg="180" :colors="{ 0: '#C0F1FF', 96: '#fff' }">
              第一教学楼
            </GradientText>
            <div class="mb-20px ml-38px mt-13px text-16px text-#929292">
              楼宇名称
            </div>
          </div>
          <div class="line ml-27px" />
        </div>
      </div>
      <div class="col-span-1 row-span-2 flex pl-12px">
        <div class="property mt-4px" />
        <div class="ml-12px">
          <GradientText class="text-18px font-500" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
            资产数
          </GradientText>
          <div class="flex">
            <GradientText class="text-24px font-bold font-number" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
              12
            </GradientText>
            <GradientText class="ml-6px mt-6px text-18px font-500" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
              个
            </GradientText>
          </div>
        </div>
      </div>
      <div class="col-span-1 row-span-2 flex pl-12px">
        <div class="colleges mt-4px" />
        <div class="ml-12px">
          <GradientText class="text-18px font-500" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
            部门/院系
          </GradientText>
          <div class="flex">
            <GradientText class="text-24px font-bold font-number" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
              12
            </GradientText>
            <GradientText class="ml-6px mt-6px text-18px font-500" :deg="180" :colors="{ 0: '#C8D7E4', 100: '#fff' }">
              个
            </GradientText>
          </div>
        </div>
      </div>
    </div>

    <div class="row-span-8">
      <ScrollBoardTableWrap :columns="tableColumns" :data="tableData" :size="4" />
    </div>

    <div class="row-span-12 flex flex-col">
      <div class="flex justify-between pt-20px">
        <SecondTitle class="ml-3">
          资产类型分布
        </SecondTitle>
        <div class="flex">
          <div
            v-for="(item, index) in list" :key="index"
            class="AssetStatus flex cursor-pointer items-center justify-center text-16px text-#A5A5A5 font-300"
            :class="activeIndex === index ? 'active' : 'AssetStatus'" @click="clickTab(index)">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="flex-auto overflow-hidden">
        <BuildingDetailPropertyType :data="data" />
      </div>
    </div>

    <!--  点击详情按钮 -->
    <DragPopup
      v-model:visible="buildingDetail" title="资源信息" :width="850" top="130px"
      left="500px">
      <div class="h-480px overflow-hidden overflow-y-auto px-10px py-16px">
        <ScrollBoardTableWrap :columns="tableColumnsDetail" :data="tableDataDetail" :size="8" />
      </div>
    </DragPopup>
  </BoxPanel>
</template>

<style scoped>
.teachingBuilding {
  width: 140px;
  height: 100px;
  border-top: 4px solid #ffffff;
  background: rgba(55, 132, 187, 0.09);
}
.line {
  width: 2px;
  height: 82px;
  background: url("@/assets/images/assetManagement/line.png");
  background-size: 100% 100%;
}
.property {
  width: 48px;
  height: 48px;
  background: url("@/assets/images/assetManagement/property.png") no-repeat;
  background-size: 48px 48px;
}
.colleges {
  width: 48px;
  height: 48px;
  background: url("@/assets/images/assetManagement/colleges.png") no-repeat;
  background-size: 48px 48px;
}

.title {
  .color {
    width: 14px;
    height: 3px;
    transform: rotate(90deg);
    background: linear-gradient(270deg, #ffb3b3 0%, #ff2626 100%);
    box-shadow: inset 0px 0px 6px 0px rgba(255, 233, 233, 0.43);
  }
}
.AssetStatus {
  width: 100px;
  background: url("@/assets/images/assetManagement/tab1.png") no-repeat;
  background-size: 100% 100%;
}
.AssetStatus:hover {
  background: url("@/assets/images/assetManagement/tab.png") no-repeat;
  background-size: 100% 100%;
}
.active {
  color: #ffffff;
  font-weight: 500;
  background: url("@/assets/images/assetManagement/tab.png") no-repeat;
  background-size: 100% 100%;
}
</style>
