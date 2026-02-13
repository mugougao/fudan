import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import {
  getApprove,
  getAreaSupervisorCount,
  getDormitoryAreaData,
  getDormitoryAreaEnergy,
} from "@/api/lifeServices";
import usePersonnelInformationData from "@/composables/lifeServices/usePersonnelInformationData.ts";

export function useCampusParkData() {
  // 宿舍区 ID
  const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

  // 默认园区概况数据
  const defaultOverviewData = {
    gl: {
      lys: 45, // 楼栋数
      fjs: 1580, // 房间数
      cws: 3200, // 床位数
      yrzfj: 1420, // 已入住房间
      wrzfj: 160, // 未入住房间
      yrzcw: 2850, // 已入住床位
      wrzcw: 350, // 未入住床位
      rzl: 89.2, // 入住率
      fjrzl: 89.9, // 房间入住率
      cwrzl: 89.1, // 床位入住率
    },
    tj: {
      count: 2850, // 总人数
      xlfb: [ // 学历分布
        { name: "本科生", value: 1950 },
        { name: "硕士研究生", value: 720 },
        { name: "博士研究生", value: 180 },
      ],
      xbfb: [ // 性别分布
        { name: "男", value: 1620 },
        { name: "女", value: 1230 },
      ],
      yxfb: [ // 院系分布
        { name: "计算机科学技术学院", value: 450 },
        { name: "数学科学学院", value: 380 },
        { name: "物理学系", value: 320 },
        { name: "化学系", value: 290 },
        { name: "生命科学学院", value: 410 },
        { name: "其他", value: 1000 },
      ],
      rjsjfb: [ // 入住时间分布
        { name: "2024级", value: 950 },
        { name: "2023级", value: 860 },
        { name: "2022级", value: 670 },
        { name: "2021级及之前", value: 370 },
      ],
    },
  };

  // 园区基本概况
  const { state, execute } = useAsyncState(async () => {
    console.log("🏫 [园区数据] 🚫 API调用已注释，使用默认园区概况数据");
    
    // 🚫 注释掉API调用，直接返回默认数据
    return defaultOverviewData;

    /* // 原API调用逻辑已注释
    console.log("🏫 [园区数据] 开始获取园区概况数据:", { dormitoryAreaId: dormitoryAreaId.value });
    const [err, res] = await to(getDormitoryAreaData(dormitoryAreaId.value));
    if (err) {
      console.warn("⚠️ [园区数据] 园区概况数据获取失败，使用默认数据:", err);
      return defaultOverviewData;
    }
    const resultData = res?.resultData || defaultOverviewData;
    console.log("✅ [园区数据] 园区概况数据获取成功:", resultData);
    return resultData;
    */
  }, defaultOverviewData, { resetOnExecute: false });
  
  // 宿舍区面板-督导员数量
  const { state: totalSupervisor, execute: supervisorExecute } = useAsyncState(async () => {
    console.log("👥 [园区数据] 🚫 API调用已注释，使用默认督导员数量");
    
    // 🚫 注释掉API调用，直接返回默认数据
    return 8;

    /* // 原API调用逻辑已注释
    console.log("👥 [园区数据] 开始获取督导员数量:", { dormitoryAreaId: dormitoryAreaId.value });
    const [err, res] = await to(getAreaSupervisorCount(dormitoryAreaId.value));
    if (err) {
      console.warn("⚠️ [园区数据] 督导员数量获取失败，使用默认值:", err);
      return 8;
    }
    const count = res?.resultData || 8;
    console.log("✅ [园区数据] 督导员数量获取成功:", count);
    return count;
    */
  }, 8, { resetOnExecute: false });

  // 人员基本信息
  const personnelInformationData = usePersonnelInformationData(computed(() => state.value.tj));

  // 默认审批数据
  const defaultApprovalData = {
    countnum: 156, // 总审批数
    checknum: 142, // 已审核数
  };

  // 审批数据
  const { state: approvalData, execute: approvalExecute } = useAsyncState(async () => {
    console.log("📋 [园区数据] 🚫 API调用已注释，使用默认审批数据");
    
    // 🚫 注释掉API调用，直接返回默认数据
    return defaultApprovalData;

    /* // 原API调用逻辑已注释
    console.log("📋 [园区数据] 开始获取审批数据:", { dormitoryAreaId: dormitoryAreaId.value });
    const [err, res] = await to(getApprove(dormitoryAreaId.value));
    if (err) {
      console.warn("⚠️ [园区数据] 审批数据获取失败，使用默认数据:", err);
      return defaultApprovalData;
    }
    const data = res?.resultData || defaultApprovalData;
    console.log("✅ [园区数据] 审批数据获取成功:", data);
    return data;
    */
  }, defaultApprovalData, { resetOnExecute: false });

  const defaultEnergyInfo = {
    energyUseData: {
      count: 12580,
      data: [
        { name: "1", value: 1050 },
        { name: "2", value: 1150 },
        { name: "3", value: 1200 },
        { name: "4", value: 980 },
        { name: "5", value: 890 },
        { name: "6", value: 760 },
        { name: "7", value: 850 },
        { name: "8", value: 1100 },
        { name: "9", value: 1080 },
        { name: "10", value: 1150 },
        { name: "11", value: 1180 },
        { name: "12", value: 1190 },
      ],
    },
    energyPurchaseData: {
      count: 13200,
      data: [
        { name: "1", value: 1100 },
        { name: "2", value: 1200 },
        { name: "3", value: 1250 },
        { name: "4", value: 1020 },
        { name: "5", value: 950 },
        { name: "6", value: 800 },
        { name: "7", value: 900 },
        { name: "8", value: 1150 },
        { name: "9", value: 1130 },
        { name: "10", value: 1200 },
        { name: "11", value: 1250 },
        { name: "12", value: 1250 },
      ],
    },
  };

  // 能耗情况
  const { state: energyInfo, execute: energyInfoExecute } = useAsyncState(
    async () => {
      console.log("⚡ [园区数据] 🚫 API调用已注释，使用默认能耗数据");
      
      // 🚫 注释掉API调用，直接返回默认数据
      return defaultEnergyInfo;

      /* // 原API调用逻辑已注释
      console.log("⚡ [园区数据] 开始获取能耗数据:", { dormitoryAreaId: dormitoryAreaId.value });
      const [err, res] = await to(getDormitoryAreaEnergy(dormitoryAreaId.value));
      if (err) {
        console.warn("⚠️ [园区数据] 能耗数据获取失败，使用默认数据:", err);
        return defaultEnergyInfo;
      }
      const { ndgdl = [], zrydl = 0, ndydl = [], zrgdl = 0 } = (res?.resultData || {});
      
      // 如果后端数据为空，使用默认数据
      if (!ndgdl.length && !ndydl.length) {
        console.warn("⚠️ [园区数据] 能耗数据为空，使用默认数据");
        return defaultEnergyInfo;
      }
      
      const energyData = {
        energyUseData: {
          count: zrydl || defaultEnergyInfo.energyUseData.count,
          data: ndydl.length ? (ndydl as { name: string; value: number }[]) : defaultEnergyInfo.energyUseData.data,
        },
        energyPurchaseData: {
          count: zrgdl || defaultEnergyInfo.energyPurchaseData.count,
          data: ndgdl.length ? (ndgdl as { name: string; value: number }[]) : defaultEnergyInfo.energyPurchaseData.data,
        },
      };
      console.log("✅ [园区数据] 能耗数据获取成功:", energyData);
      return energyData;
      */
    },
    defaultEnergyInfo,
    { resetOnExecute: false },
  );

  // 🚫 注释掉watch自动刷新逻辑
  /*
  watch(dormitoryAreaId, () => {
    execute();
    energyInfoExecute();
    approvalExecute();
    supervisorExecute();
  });
  */

  return {
    // 园区基本概况
    state,
    totalSupervisor,
    // 人员基本信息
    personnelInformationData,
    // 审批数据
    approvalData,
    // 能耗情况
    energyInfo,
  };
}
