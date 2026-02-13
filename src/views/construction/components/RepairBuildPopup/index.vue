<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
// import to from "await-to-js";
// import { fetchBuildingRepairingHistory, fetchBuildingRepairingInfo } from "@/api/construction/repair.ts";
import DailyRepairsInfo from "./DailyRepairsInfo.vue";
import LargeScaleRepairs from "./LargeScaleRepairs.vue";
import RepairHistoryDetailPopup from "./RepairHistoryDetailPopup.vue";

defineOptions({ name: "RepairBuildPopup", inheritAttrs: false });

const { id, title, defaultType = "1" } = defineProps<{
  id: string;
  title: string;
  defaultType?: "1" | "2";
}>();

const visible = defineModel<boolean>("visible", { default: false });

// 基于id生成确定性的随机数种子
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 生成正在修缮信息
function generateRepairingInfo(buildingId: string) {
  const seed = hashString(buildingId);
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const projectNames = [
    "楼宇外墙防水维修工程",
    "电气系统升级改造",
    "结构安全加固项目",
    "室内装饰装修工程",
    "给排水管道疏通维修",
    "消防设施更新改造",
    "电梯维护保养工程",
    "屋顶防水隔热工程",
    "门窗更换维修项目",
    "地面修复平整工程",
  ];

  const departments = ["总务处", "后勤保障部", "校园规划处", "基建处", "资产管理处"];
  const constructionUnits = ["上海建工集团", "中建三局", "浙江建工", "北京城建", "广东建工"];
  const repairParts = ["外墙", "屋顶", "电气系统", "给排水", "消防设施", "结构梁柱", "室内装修", "门窗"];
  const workContents = [
    "对楼宇外墙进行防水处理，修补裂缝，涂刷防水涂料",
    "升级电气线路，更换老旧开关插座，安装漏电保护装置",
    "对结构进行加固，增加抗震支撑，修补混凝土裂缝",
    "更新室内装修，更换地板、墙面涂料，改善照明系统",
    "疏通排水管道，更换老旧水管，修复漏水点",
  ];

  const projectIndex = Math.floor(random(1) * projectNames.length);
  const deptIndex = Math.floor(random(2) * departments.length);
  const unitIndex = Math.floor(random(3) * constructionUnits.length);
  const partIndex = Math.floor(random(4) * repairParts.length);
  const workIndex = Math.floor(random(5) * workContents.length);

  // 生成日期（最近3个月内）
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - Math.floor(random(6) * 3));
  const startDate = new Date(baseDate);
  startDate.setDate(startDate.getDate() + Math.floor(random(7) * 15));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30 + Math.floor(random(8) * 60));

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    "项目名称": projectNames[projectIndex],
    "申请单位": departments[deptIndex],
    "立项编号": `LX${String(seed).slice(0, 6)}`,
    "立项金额（万元）": (10 + random(9) * 90).toFixed(2),
    "施工单位": constructionUnits[unitIndex],
    "修缮部位": repairParts[partIndex],
    "主要工作内容": workContents[workIndex],
    "开工时间": formatDate(startDate),
    "竣工时间": formatDate(endDate),
    // 规模修缮额外字段
    "设计单位": ["华东建筑设计院", "上海建筑设计院", "北京建筑设计院"][Math.floor(random(10) * 3)],
    "监理单位": ["上海建科监理", "中咨监理", "北京赛瑞斯监理"][Math.floor(random(11) * 3)],
    "projectApproval": "点击查看",
    "constructionPermits": "点击查看",
    "completionAcceptanceCertificate": "点击查看",
  };
}

// 生成修缮历史列表
function generateRepairingHistory(buildingId: string) {
  const seed = hashString(buildingId);
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const projectNames = [
    "年度常规维护",
    "应急抢修工程",
    "专项改造项目",
    "设施更新工程",
    "环境整治项目",
    "节能改造工程",
    "安全整改项目",
    "功能升级项目",
  ];

  const historyCount = 3 + Math.floor(random(100) * 5); // 3-7条历史记录
  const historyList: any[] = [];

  for (let i = 0; i < historyCount; i++) {
    const projectIndex = Math.floor(random(i * 10) * projectNames.length);
    const baseDate = new Date();
    baseDate.setFullYear(baseDate.getFullYear() - (i + 1));
    const startDate = new Date(baseDate);
    startDate.setMonth(startDate.getMonth() + Math.floor(random(i * 20) * 6));

    historyList.push({
      "开工时间": startDate.toISOString().split("T")[0],
      "项目名称": projectNames[projectIndex],
      "申请部门": ["总务处", "后勤保障部", "校园规划处"][Math.floor(random(i * 30) * 3)],
      "立项编号": `LX${String(seed + i).slice(0, 6)}`,
      "立项金额（万元）": (5 + random(i * 40) * 45).toFixed(2),
      "主要工作内容": `对楼宇进行${projectNames[projectIndex]}，完成相关施工任务`,
      "施工单位": ["上海建工集团", "中建三局", "浙江建工"][Math.floor(random(i * 50) * 3)],
      "竣工时间": new Date(startDate.getTime() + (30 + Math.floor(random(i * 60) * 60)) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  }

  return historyList;
}

const { state, execute } = useAsyncState(
  async () => {
    return {
      info: generateRepairingInfo(id),
      history: generateRepairingHistory(id),
    };
  },
  { info: generateRepairingInfo(""), history: [] },
  { immediate: false, resetOnExecute: false },
);

watch(
  () => [visible.value, id],
  ([visible, id]) => {
    if (visible && id) execute();
  },
);

const type = ref(defaultType);
const DescriptionComponentMap = {
  1: DailyRepairsInfo,
  2: LargeScaleRepairs,
};

function StatusTag({ status }: { status: "立项" | "合同" | "开工" }) {
  const color = { 立项: "#38FFF8", 合同: "#2FA1FF", 开工: "#DCE978" }[status];
  return (
    <span
      style={{ "--color": color }}
      class="border border-$color rounded-full bg-[#D8D8D8]/10 px-2 py-[1px] text-[12px] text-$color"
    >
      {status}
    </span>
  );
}

const showRepairHistoryDetailPopup = ref(false);
const showRepairHistoryDetail = ref<any>({});

const tableColumns: IEasyTableProps["columns"] = [
  { title: "时间", field: "开工时间", align: "center" },
  { title: "项目名称", field: "项目名称", align: "center" },
  {
    title: "详情",
    field: "action",
    align: "center",
    render: ({ row }) => (
      <span
        class="cursor-pointer border border-[#CC1A1A] rounded-full bg-[#CC1A1A]/25 px-2 py-0.5 text-[12px] text-white/80 hover:bg-[#CC1A1A]/60 hover:text-white"
        onClick={() => {
          showRepairHistoryDetailPopup.value = true;
          showRepairHistoryDetail.value = row;
        }}
      >
        详情
      </span>
    ),
  },
];
</script>

<template>
  <DragPopup v-model:visible="visible" :width="570" left="300px" :top="100" @close="() => showRepairHistoryDetailPopup = false ">
    <template #title>
      <div class="flex items-center justify-between">
        <span>{{ title }}</span>
        <div class="type-select">
          <label>
            <input v-model="type" name="RepairBuildPopupType" type="radio" class="hidden" value="1">
            <span>日常修缮</span>
          </label>
          <label>
            <input v-model="type" name="RepairBuildPopupType" type="radio" class="hidden" value="2">
            <span>规模修缮</span>
          </label>
        </div>
      </div>
    </template>
    <div class="px-10 space-y-2">
      <UiThirdTitle title="正在修缮项目信息" />
      <!-- <template #extra>
          <StatusTag status="立项" />
        </template> -->
      <component :is="DescriptionComponentMap[type]" :data="state.info" />
      <UiThirdTitle title="修缮历史列表" />
      <UiEasyTable
        :columns="tableColumns" :data="state.history" height="200" />
    </div>

    <RepairHistoryDetailPopup v-model:visible="showRepairHistoryDetailPopup" :title="title" :data="showRepairHistoryDetail" />
  </DragPopup>
</template>

<style scoped lang="scss">
.type-select {
  label {
    color: #9e9e9e;
    font-size: 12px;
    cursor: pointer;
    font-family: AlibabaPuHuiTi-3-medium;
    padding: 3px 8px;
    &:hover {
      color: #ffd1b0;
    }

    & + label {
      margin-left: 8px;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        width: 1px;
        height: 10px;
        background: #b1b1b1;
        top: calc(50% - 5px);
        left: -4px;
      }
    }

    &:has(input:checked) {
      color: #ffd1b0;
      --border-color: #ff9a3b;
      background:
        linear-gradient(to right, var(--border-color), var(--border-color)) no-repeat left top / 100% 1px,
        linear-gradient(
            to bottom,
            var(--border-color),
            var(--border-color) calc(50% - 2px),
            transparent calc(50% - 2px),
            transparent calc(50% + 2px),
            var(--border-color) calc(50% + 2px),
            var(--border-color)
          )
          no-repeat left top / 1px 100%,
        linear-gradient(
            to bottom,
            var(--border-color),
            var(--border-color) calc(50% - 2px),
            transparent calc(50% - 2px),
            transparent calc(50% + 2px),
            var(--border-color) calc(50% + 2px),
            var(--border-color)
          )
          no-repeat right top / 1px 100%,
        linear-gradient(to right, var(--border-color), var(--border-color)) no-repeat left bottom / 100% 1px,
        rgba(#000000, 0.3);
    }
  }
}
</style>
