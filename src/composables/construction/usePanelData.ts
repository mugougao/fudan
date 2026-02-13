import { useRouteQuery } from "@vueuse/router";
import layerPoint from "@/assets/json/layer-dianwei.json";
// import to from "await-to-js";
// import { fetchRepairList, fetchRepairPanelData } from "@/api/construction/repair";
import { CampusId } from "@/enums";

export function usePanelData() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview);

  // 模拟数据：修缮面板数据
  const mockRepairPanelData: Record<CampusId, {
    zzxs: number; // 正在修缮数
    xszs: number; // 修缮总数
    lxfb: { name: string; value: number }[]; // 类型分布
    xqfb: { name: string; value: number }[]; // 校区分布
  }> = {
    [CampusId.Overview]: {
      zzxs: 28, // 全校正在修缮数
      xszs: 156, // 全校修缮总数
      lxfb: [
        { name: "防水维修", value: 65 },
        { name: "电气维修", value: 42 },
        { name: "结构加固", value: 25 },
        { name: "装饰装修", value: 18 },
        { name: "管道疏通", value: 6 },
      ],
      xqfb: [
        { name: "邯郸", value: 68 },
        { name: "江湾", value: 42 },
        { name: "枫林", value: 28 },
        { name: "张江", value: 18 },
      ],
    },
    [CampusId.HanDan]: {
      zzxs: 12,
      xszs: 68,
      lxfb: [
        { name: "防水维修", value: 32 },
        { name: "电气维修", value: 18 },
        { name: "结构加固", value: 10 },
        { name: "装饰装修", value: 6 },
        { name: "管道疏通", value: 2 },
      ],
      xqfb: [], // 校区页面不需要校区分布
    },
    [CampusId.JiangWan]: {
      zzxs: 8,
      xszs: 42,
      lxfb: [
        { name: "防水维修", value: 18 },
        { name: "电气维修", value: 12 },
        { name: "结构加固", value: 7 },
        { name: "装饰装修", value: 4 },
        { name: "管道疏通", value: 1 },
      ],
      xqfb: [],
    },
    [CampusId.FengLin]: {
      zzxs: 6,
      xszs: 28,
      lxfb: [
        { name: "防水维修", value: 12 },
        { name: "电气维修", value: 8 },
        { name: "结构加固", value: 5 },
        { name: "装饰装修", value: 2 },
        { name: "管道疏通", value: 1 },
      ],
      xqfb: [],
    },
    [CampusId.ZhangJiang]: {
      zzxs: 4,
      xszs: 18,
      lxfb: [
        { name: "防水维修", value: 8 },
        { name: "电气维修", value: 5 },
        { name: "结构加固", value: 3 },
        { name: "装饰装修", value: 2 },
        { name: "管道疏通", value: 0 },
      ],
      xqfb: [],
    },
  };

  const { state: panelData, execute: fetchPanelData } = useAsyncState(
    async () => {
      const data = mockRepairPanelData[campusId.value] || mockRepairPanelData[CampusId.Overview];
      return {
        repairCount: data.xszs,
        repairingCount: data.zzxs,
        campusRepairCount: data.xqfb,
        statusCount: data.lxfb,
      };
    },
    {
      repairCount: 0,
      repairingCount: 0,
      campusRepairCount: [],
      statusCount: [],
    },
    { immediate: true, resetOnExecute: false },
  );

  watch(campusId, () => {
    fetchPanelData();
  });

  return toRefs(toReactive(panelData));
}

export function usePanelCampusData() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview);

  const { repairCount, repairingCount, campusRepairCount, statusCount } = usePanelData();

  // 模拟数据：楼宇修缮列表 - 从layer-dianwei.json中获取真实楼宇数据
  const mockRepairListData: Record<CampusId, { count: number; name: string; lyid: string }[]> = {
    [CampusId.Overview]: [],
    [CampusId.HanDan]: getCampusBuildingData("3", 8), // 邯郸校区 sid=3
    [CampusId.JiangWan]: getCampusBuildingData("4", 6), // 江湾校区 sid=4
    [CampusId.FengLin]: getCampusBuildingData("1", 7), // 枫林校区 sid=1
    [CampusId.ZhangJiang]: getCampusBuildingData("2", 5), // 张江校区 sid=2
  };

  // 模拟数据：规模修缮列表 - 从layer-dianwei.json中获取真实楼宇数据
  const mockScaleRepairListData: Record<CampusId, { name: string; time: string; lyid: string }[]> = {
    [CampusId.Overview]: [],
    [CampusId.HanDan]: getCampusScaleRepairData("3"), // 邯郸校区 sid=3
    [CampusId.JiangWan]: getCampusScaleRepairData("4"), // 江湾校区 sid=4
    [CampusId.FengLin]: getCampusScaleRepairData("1"), // 枫林校区 sid=1
    [CampusId.ZhangJiang]: getCampusScaleRepairData("2"), // 张江校区 sid=2
  };

  // 辅助函数：从layer-dianwei.json中获取校区楼宇数据
  function getCampusBuildingData(sid: string, startCount: number) {
    // 筛选对应校区且lx2为"楼宇建筑"的数据
    const campusBuildings = layerPoint.features.filter((feature) => {
      const featureSid = feature.properties.sid?.toString();
      const lx2 = feature.properties.lx2;
      return featureSid === sid && lx2 === "楼宇建筑";
    });

    // 取前10条数据
    const selectedBuildings = campusBuildings.slice(0, 10);

    // 生成修缮列表数据，count从startCount递减
    return selectedBuildings.map((feature, index) => {
      const { id, name } = feature.properties as { id?: number | string; name: string };
      // 计算count值，确保递减，最小为1
      const count = Math.max(startCount - index, 1);
      return {
        count,
        name,
        lyid: id?.toString() || name, // 使用楼宇ID作为lyid
      };
    });
  }

  // 辅助函数：从layer-dianwei.json中获取校区楼宇数据用于规模修缮面板
  function getCampusScaleRepairData(sid: string) {
    // 筛选对应校区且lx2为"楼宇建筑"的数据
    const campusBuildings = layerPoint.features.filter((feature) => {
      const featureSid = feature.properties.sid?.toString();
      const lx2 = feature.properties.lx2;
      return featureSid === sid && lx2 === "楼宇建筑";
    });

    // 取第10-19条数据，避免与日常修缮重复
    // 如果数据不足20条，从第10条开始取剩余的数据
    const startIndex = Math.min(10, campusBuildings.length);
    const endIndex = Math.min(20, campusBuildings.length);
    const selectedBuildings = campusBuildings.slice(startIndex, endIndex);

    // 生成规模修缮列表数据，包含name和time字段
    return selectedBuildings.map((feature, index) => {
      const { id, name } = feature.properties as { id?: number | string; name: string };
      // 基于楼宇ID生成确定性的随机开工时间（最近6个月内）
      const seed = id ? Number(id) : index;
      const random = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
      };

      // 生成最近6个月内的随机日期
      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() - Math.floor(random(1) * 6));
      const startDate = new Date(baseDate);
      startDate.setDate(startDate.getDate() + Math.floor(random(2) * 30));

      // 格式化为YYYY-MM-DD
      const time = startDate.toISOString().split("T")[0];

      return {
        name,
        time,
        lyid: id?.toString() || name, // 保留lyid用于可能的交互
      };
    });
  }

  const {
    state: repairList,
    execute: executeRepairList,
  } = useAsyncState(
    async () => {
      return mockRepairListData[campusId.value] || [];
    },
    [] as any[],
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: scaleRepairList,
    execute: executeScaleRepairList,
  } = useAsyncState(
    async () => {
      return mockScaleRepairListData[campusId.value] || [];
    },
    [] as any[],
    { immediate: true, resetOnExecute: false },
  );

  watch(campusId, () => {
    executeRepairList();
    executeScaleRepairList();
  });

  return {
    repairCount,
    repairingCount,
    campusRepairCount,
    statusCount,
    repairList,
    scaleRepairList,
  };
}
