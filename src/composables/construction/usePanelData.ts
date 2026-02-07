import { useRouteQuery } from "@vueuse/router";
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
        { name: "管道疏通", value: 6 }
      ],
      xqfb: [
        { name: "邯郸", value: 68 },
        { name: "江湾", value: 42 },
        { name: "枫林", value: 28 },
        { name: "张江", value: 18 }
      ]
    },
    [CampusId.HanDan]: {
      zzxs: 12,
      xszs: 68,
      lxfb: [
        { name: "防水维修", value: 32 },
        { name: "电气维修", value: 18 },
        { name: "结构加固", value: 10 },
        { name: "装饰装修", value: 6 },
        { name: "管道疏通", value: 2 }
      ],
      xqfb: [] // 校区页面不需要校区分布
    },
    [CampusId.JiangWan]: {
      zzxs: 8,
      xszs: 42,
      lxfb: [
        { name: "防水维修", value: 18 },
        { name: "电气维修", value: 12 },
        { name: "结构加固", value: 7 },
        { name: "装饰装修", value: 4 },
        { name: "管道疏通", value: 1 }
      ],
      xqfb: []
    },
    [CampusId.FengLin]: {
      zzxs: 6,
      xszs: 28,
      lxfb: [
        { name: "防水维修", value: 12 },
        { name: "电气维修", value: 8 },
        { name: "结构加固", value: 5 },
        { name: "装饰装修", value: 2 },
        { name: "管道疏通", value: 1 }
      ],
      xqfb: []
    },
    [CampusId.ZhangJiang]: {
      zzxs: 4,
      xszs: 18,
      lxfb: [
        { name: "防水维修", value: 8 },
        { name: "电气维修", value: 5 },
        { name: "结构加固", value: 3 },
        { name: "装饰装修", value: 2 },
        { name: "管道疏通", value: 0 }
      ],
      xqfb: []
    }
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

  // 模拟数据：楼宇修缮列表
  const mockRepairListData: Record<CampusId, { count: number; name: string; lyid: string }[]> = {
    [CampusId.Overview]: [],
    [CampusId.HanDan]: [
      { count: 8, name: "物理实验楼", lyid: "hd-wlsyl" },
      { count: 7, name: "化学实验楼", lyid: "hd-hxsyl" },
      { count: 6, name: "生命科学楼", lyid: "hd-smkxl" },
      { count: 5, name: "信息科学楼", lyid: "hd-xxkxl" },
      { count: 4, name: "材料科学楼", lyid: "hd-clkxl" },
      { count: 3, name: "环境科学楼", lyid: "hd-hjkxl" },
      { count: 2, name: "医学实验楼", lyid: "hd-yxsyl" },
      { count: 1, name: "图书馆", lyid: "hd-tsg" }
    ],
    [CampusId.JiangWan]: [
      { count: 6, name: "物理楼", lyid: "jw-wll" },
      { count: 5, name: "化学楼", lyid: "jw-hxl" },
      { count: 4, name: "生命科学楼", lyid: "jw-smkxl" },
      { count: 3, name: "信息楼", lyid: "jw-xxl" },
      { count: 3, name: "材料楼", lyid: "jw-cll" },
      { count: 2, name: "环境楼", lyid: "jw-hjl" },
      { count: 1, name: "医学楼", lyid: "jw-yxl" }
    ],
    [CampusId.FengLin]: [
      { count: 7, name: "医学实验中心", lyid: "fl-yxsyzx" },
      { count: 6, name: "药学实验中心", lyid: "fl-yxsyzx" },
      { count: 5, name: "护理实验中心", lyid: "fl-hlsyzx" },
      { count: 4, name: "公共卫生楼", lyid: "fl-ggwsl" },
      { count: 3, name: "基础医学楼", lyid: "fl-jcyxl" },
      { count: 2, name: "临床医学楼", lyid: "fl-lcyxl" },
      { count: 1, name: "医学研究楼", lyid: "fl-yxyjl" }
    ],
    [CampusId.ZhangJiang]: [
      { count: 5, name: "信息科学楼", lyid: "zj-xxkxl" },
      { count: 4, name: "软件工程楼", lyid: "zj-rjgcl" },
      { count: 4, name: "计算机科学楼", lyid: "zj-jsjkxl" },
      { count: 3, name: "电子工程楼", lyid: "zj-dzgcl" },
      { count: 2, name: "微电子楼", lyid: "zj-wdzl" },
      { count: 1, name: "通信工程楼", lyid: "zj-txgcl" },
      { count: 1, name: "网络安全楼", lyid: "zj-wlaql" }
    ]
  };

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

  watch(campusId, () => {
    executeRepairList();
  });

  return {
    repairCount,
    repairingCount,
    campusRepairCount,
    statusCount,
    repairList,
  };
}
