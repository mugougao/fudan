<script setup lang="ts">
// 教室态势页面 - 显示教室使用率和教学楼栋使用率统计图表
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import dayjs from "dayjs";
import { CampusId } from "@/enums";
import { createEChartsLinearGradient } from "@/utils";
import buildingOccupancyRangeLayer from "@/utils/WdpMap/smartTeaching/BuildingOccupancyRangeLayer.ts";

// 校区ID - 从URL查询参数获取当前校区，默认值为邯郸校区
const campusId = useRouteQuery<string>("campusId", CampusId.HanDan) as unknown as Ref<string>;

// 模拟数据：近七天教室使用率 - 按校区区分
const mockClassroomUsageData = {
  // 邯郸校区教室使用率数据
  3: [
    { name: "2025-01-01", value: 65 },
    { name: "2025-01-02", value: 72 },
    { name: "2025-01-03", value: 58 },
    { name: "2025-01-04", value: 80 },
    { name: "2025-01-05", value: 45 },
    { name: "2025-01-06", value: 68 },
    { name: "2025-01-07", value: 75 },
  ],
  // 江湾校区教室使用率数据
  4: [
    { name: "2025-01-08", value: 70 },
    { name: "2025-01-09", value: 68 },
    { name: "2025-01-10", value: 62 },
    { name: "2025-01-11", value: 78 },
    { name: "2025-01-12", value: 55 },
    { name: "2025-01-13", value: 72 },
    { name: "2025-01-14", value: 65 },
  ],
};
// 根据当前校区ID获取对应的教室使用率数据
const state = computed(() => mockClassroomUsageData[campusId.value as "3" | "4"] || mockClassroomUsageData["3"]);

// 处理教室使用率数据，将日期格式化为月-日格式
const classroomUtilizationData = computed(() => state.value.map(({ name, value }) => ({ name: dayjs(name).format("M-D"), value })));

// 模拟数据：教学楼栋使用率 - 按校区区分
const mockBuildingUsageRate = {
  // 邯郸校区教学楼栋使用率数据
  3: [
    { id: "1", name: "光华楼", value: 85 },
    { id: "2", name: "逸夫楼", value: 72 },
    { id: "3", name: "第三教学楼", value: 68 },
    { id: "4", name: "第四教学楼", value: 45 },
    { id: "5", name: "第五教学楼", value: 60 },
    { id: "6", name: "第六教学楼", value: 78 },
    { id: "7", name: "第七教学楼", value: 52 },
  ],
  // 江湾校区教学楼栋使用率数据
  4: [
    { id: "8", name: "江湾一号楼", value: 78 },
    { id: "9", name: "江湾二号楼", value: 65 },
    { id: "10", name: "江湾三号楼", value: 82 },
    { id: "11", name: "江湾四号楼", value: 55 },
    { id: "12", name: "江湾五号楼", value: 70 },
    { id: "13", name: "江湾六号楼", value: 48 },
    { id: "14", name: "江湾七号楼", value: 62 },
  ],
};
// 根据当前校区ID获取对应的教学楼栋使用率数据
const buildingUsageRate = computed(() => mockBuildingUsageRate[campusId.value as "3" | "4"] || mockBuildingUsageRate["3"]);

// 根据教学楼栋使用率返回颜色 - 使用率分为三个等级
// 高使用率(≥66.7%): 红色 #BB2A2A
// 中等使用率(33.3%-66.7%): 橙色 #BB752A
// 低使用率(<33.3%): 绿色 #20AF78
function getColor(rank: number) {
  if (100 * (2 / 3) <= rank) return "#BB2A2A";
  else if (100 * (1 / 3) <= rank) return "#BB752A";
  return "#20AF78";
}
// 教学楼栋使用率图表配置 - 自定义水平条形图，显示各教学楼使用率排名
const option = computed(() => {
  const category: string[] = [];
  const seriesData: number[] = [];

  // 处理数据：将教学楼名称和使用率值分别存储，使用unshift确保排序正确
  buildingUsageRate.value.forEach(({ name, value }) => {
    category.unshift(name);
    seriesData.unshift(value);
  });

  return {
    // 图表布局配置
    grid: { left: 10, bottom: 20, right: 10, top: 20 },
    // X轴配置：隐藏标签和网格线
    xAxis: {
      type: "value",
      // boundaryGap: [0, 0.01],
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    // Y轴配置：显示教学楼名称，隐藏轴线标签
    yAxis: {
      type: "category",
      data: category,
      axisLine: { show: false },
      axisLabel: { show: false },
    },
    // 系列配置：使用四个系列层叠实现特殊视觉效果
    series: [
      {
        z: 2, // 显示层级
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData,
        barWidth: 9, // 条形宽度
        showBackground: true, // 显示背景
        backgroundStyle: {
          color: "rgba(255,255,255,0.1)", // 背景颜色
        },
        // 条形样式：红色渐变边框
        itemStyle: {
          color: createEChartsLinearGradient(["#CC1A1A33", "#CC1A1A"], [0, 0, 1, 0]),
          borderColor: "#CE7A7A",
          borderWidth: 1,
        },
        // 标签：显示TOP排名和教学楼名称
        label: {
          show: true,
          formatter: ({ name, dataIndex }) => `{name|TOP${seriesData.length - dataIndex} ${name}}`,
          position: "left",
          offset: [125, -22],
          rich: {
            name: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              width: 120,
            },
          },
        },
      },
      {
        z: 2,
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData,
        barWidth: 9,
        itemStyle: {
          color: "#ffffff00", // 完全透明，仅用于定位
        },
        // 标签：显示右侧红色竖线装饰
        label: {
          show: true,
          formatter: () => `{box|}`,
          position: "insideRight",
          offset: [6, 0],
          rich: {
            box: {
              width: 2,
              height: 11,
              backgroundColor: "#FFD5D5",
            },
          },
        },
      },

      {
        z: 1, // 底层
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData.map(() => 100), // 填充100%作为背景
        barWidth: 9,
        barGap: "-100%", // 与前面系列重叠
        itemStyle: { color: "#ffffff00" }, // 透明
        // 标签：显示虚线边框背景
        label: {
          show: true,
          formatter: () => `{box|}`,
          position: "insideRight",
          offset: [10, 0],
          rich: {
            box: {
              width: 313,
              height: 24,
              borderWidth: 1,
              borderColor: "#636363",
              borderType: "dashed", // 虚线边框
            },
          },
        },
      },
      {
        z: 1,
        name: "教学楼栋使用率",
        type: "bar",
        data: seriesData.map(() => 100), // 填充100%作为背景
        barWidth: 9,
        barGap: "-100%",
        itemStyle: { color: "#ffffff00" }, // 透明
        // 标签：显示使用率百分比数字，使用渐变颜色
        label: {
          show: true,
          formatter: ({ dataIndex }) => `{text|${seriesData[dataIndex]}%}`,
          position: "insideRight",
          offset: [5, -24],
          rich: {
            text: {
              fontSize: 16,
              fontFamily: "D-DIN",
              color: "url(#buildingUsageRateText)", // SVG渐变文字颜色
            },
          },
        },
      },
    ],
  } as EChartsOption;
});
;

// 热图显示控制 - 切换是否在地图上显示教学楼使用率热力图
const showHeatMap = ref(false);
// 监听热图开关变化
watch(showHeatMap, (val) => {
  if (val) {
    // 开启热图：根据教学楼使用率生成颜色列表，添加透明度4D
    const list = buildingUsageRate.value.map(({ id, value }) => ({ id, color: `${getColor(value)?.replace("#", "")}4D` }));
    console.warn(list);
    buildingOccupancyRangeLayer.render(list); // 在地图上渲染热力图
  }
  else {
    // 关闭热图：清除所有热图图层
    buildingOccupancyRangeLayer.removeAll();
  }
});
// 监听校区变化，当热图开启时重新渲染热图
watch(campusId, () => {
  if (showHeatMap.value) {
    const list = buildingUsageRate.value.map(({ id, value }) => ({ id, color: `${getColor(value)?.replace("#", "")}4D` }));
    buildingOccupancyRangeLayer.removeAll();
    buildingOccupancyRangeLayer.render(list);
  }
});
// 组件卸载时清理热图图层，避免内存泄漏
onBeforeUnmount(() => {
  buildingOccupancyRangeLayer.removeAll();
});
</script>

<template>
  <!-- 教室态势主容器 -->
  <UiBoxPanel
    title-path="smartsTeaching.classroomPosture"
    class="row-span-24"
    content-class-name="grid grid-cols-1 grid-rows-24">
    <!-- 标题后缀：教室使用率计算公式提示 -->
    <template #titleSuffix>
      <HelpTipIcon>
        <span class="flex items-center whitespace-nowrap">
          <span>教室使用率</span>
          <span class="mx-1"> = </span>
          <span class="flex flex-col text-center">
            <span class="border-b"> 每天每个教室的排课总和 </span>
            <span> 教室总数x14(一天有14节课) </span>
          </span>
        </span>
      </HelpTipIcon>
    </template>

    <!-- 第一部分：教室使用率统计图表（近7天趋势） -->
    <div class="row-span-8 flex flex-col flex-shrink-0">
      <UiSubTitle title-path="smartsTeaching.classroomOccupancy" class="shrink-0" />
      <!-- <div ref="chart" class="echarts flex-auto overflow-hidden" /> -->
      <div class="flex-auto overflow-hidden pt-2">
        <!-- 教室使用率柱状图：显示近七天教室使用率变化 -->
        <UiChartBar :data="classroomUtilizationData" legend="使用率" unit="%" />
      </div>
    </div>

    <!-- 第二部分：教学楼栋使用率统计图表（排名+热图） -->
    <div class="row-span-16 flex flex-col flex-shrink-0">
      <UiSubTitle title-path="smartsTeaching.buildingOccupancy">
        <!-- 标题后缀：教学楼使用率计算公式提示 -->
        <template #titleSuffix>
          <HelpTipIcon>
            教学楼使用率=当天该教学楼被占用的教室数量/该教学楼的教室总数。
          </HelpTipIcon>
        </template>
        <!-- 右侧额外内容：热图切换开关 -->
        <template #extra>
          <UiSwitch v-model="showHeatMap">
            {{ $t('smartsTeaching.heatmap') }}
          </UiSwitch>
        </template>
      </UiSubTitle>

      <div class="flex-auto overflow-hidden">
        <!-- SVG渐变定义：用于图表文字渐变效果 -->
        <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="buildingUsageRateText" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#F37373" />
            </linearGradient>
          </defs>
        </svg>
        <!-- 教学楼栋使用率图表：自定义水平条形图 -->
        <RenderEchart :option="option" />
      </div>
    </div>
  </UiBoxPanel>
</template>

<style scoped>

</style>
