import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";

// import to from "await-to-js";
// import {
//   fetchAssetsBuilding,
//   fetchAssetsCollege,
//   fetchAssetsDistribution,
//   fetchAssetsList,
//   fetchAssetsTerminalInstalled,
//   fetchAssetsTotal,
//   fetchAssetsUseDirection,
//   fetchBuildingDetail,
//   fetchBuildingDeviceDistribution,
//   fetchBuildingTerminalDetail,
// } from "@/api/assetManagement/instrument_etl.ts";
import { CampusId } from "@/enums";
import type { IFetchBuildingDetailResult } from "@/api/assetManagement/instrument_etl.ts";

interface IInstrumentOverviewResult {
  totalStatisticsData: { number: number; amount: number };
  useDirectionsData: { name: string; value: number }[];
  instrumentDistributionData: {
    devicesNumber: { name: string; value: number }[];
    amount: { name: string; value: number }[];
  };
  installedTerminal: { count: number; data: { name: string; value: number }[] };
  instrumentListData: { name: string; numberOfDevices: number; money: number; numberOfTerminals: number }[];
}

// 大型仪器总览 面板
export function useInstrumentOverview() {
  // 模拟数据：大型仪器总览数据
  const mockInstrumentOverviewData: IInstrumentOverviewResult = {
    totalStatisticsData: { number: 1250, amount: 28500 }, // 数量：1250台，金额：2.85亿元
    useDirectionsData: [
      { name: "教学实验", value: 520 },
      { name: "科学研究", value: 380 },
      { name: "社会服务", value: 220 },
      { name: "生产测试", value: 130 }
    ],
    instrumentDistributionData: {
      devicesNumber: [
        { name: "邯郸校区", value: 450 },
        { name: "江湾校区", value: 320 },
        { name: "枫林校区", value: 280 },
        { name: "张江校区", value: 200 }
      ],
      amount: [
        { name: "邯郸校区", value: 12500 },
        { name: "江湾校区", value: 8500 },
        { name: "枫林校区", value: 5200 },
        { name: "张江校区", value: 2300 }
      ]
    },
    installedTerminal: {
      count: 185,
      data: [
        { name: "邯郸", value: 75 },
        { name: "江湾", value: 52 },
        { name: "枫林", value: 38 },
        { name: "张江", value: 20 }
      ]
    },
    instrumentListData: [
      { name: "物理学院", numberOfDevices: 125, money: 2850, numberOfTerminals: 28 },
      { name: "化学学院", numberOfDevices: 98, money: 2250, numberOfTerminals: 22 },
      { name: "生命科学学院", numberOfDevices: 85, money: 1950, numberOfTerminals: 18 },
      { name: "信息科学与工程学院", numberOfDevices: 78, money: 1850, numberOfTerminals: 16 },
      { name: "材料科学学院", numberOfDevices: 65, money: 1550, numberOfTerminals: 15 },
      { name: "环境科学与工程学院", numberOfDevices: 58, money: 1250, numberOfTerminals: 12 },
      { name: "医学院", numberOfDevices: 52, money: 1150, numberOfTerminals: 10 },
      { name: "药学院", numberOfDevices: 45, money: 950, numberOfTerminals: 8 },
      { name: "管理学院", numberOfDevices: 38, money: 750, numberOfTerminals: 6 },
      { name: "法学院", numberOfDevices: 32, money: 650, numberOfTerminals: 5 }
    ]
  };

  const service = async () => {
    return mockInstrumentOverviewData;
  };

  const { state } = useAsyncState<IInstrumentOverviewResult>(
    service,
    {
      totalStatisticsData: { number: 0, amount: 0 },
      useDirectionsData: [],
      instrumentDistributionData: {
        devicesNumber: [],
        amount: [],
      },
      installedTerminal: { count: 0, data: [] },
      instrumentListData: [],
    } as IInstrumentOverviewResult,
    {
      immediate: true,
    },
  );

  // 院系查询
  // 模拟数据：院系查询数据
  const mockFacultiesQueryData = [
    { name: "邯郸", number: 450, amount: 12500 },
    { name: "江湾", number: 320, amount: 8500 },
    { name: "枫林", number: 280, amount: 5200 },
    { name: "张江", number: 200, amount: 2300 },
    { name: "物理学院", number: 125, amount: 2850 },
    { name: "化学学院", number: 98, amount: 2250 },
    { name: "生命科学学院", number: 85, amount: 1950 },
    { name: "信息科学与工程学院", number: 78, amount: 1850 },
    { name: "材料科学学院", number: 65, amount: 1550 },
    { name: "环境科学与工程学院", number: 58, amount: 1250 },
    { name: "医学院", number: 52, amount: 1150 },
    { name: "药学院", number: 45, amount: 950 },
    { name: "管理学院", number: 38, amount: 750 },
    { name: "法学院", number: 32, amount: 650 }
  ];

  const { state: facultiesQueryStats, execute: executeFacultiesQueryStats } = useAsyncState(
    async (collegeName?: string) => {
      // 如果有查询条件，则过滤数据
      if (collegeName && collegeName.trim() !== "") {
        return mockFacultiesQueryData.filter(item => 
          item.name.includes(collegeName) || item.name.toLowerCase().includes(collegeName.toLowerCase())
        );
      }
      // 默认返回前4个校区数据
      return mockFacultiesQueryData.slice(0, 4);
    },
    mockFacultiesQueryData.slice(0, 4),
    {
      immediate: true,
      resetOnExecute: false,
    },
  );

  return {
    state,
    facultiesQueryStats,
    executeFacultiesStats: (collegeName?: string) => executeFacultiesQueryStats(0, collegeName),
  };
}

interface IInstrumentCampusResult {
  totalStatisticsData: { number: number; amount: number };
  useDirectionsData: { name: string; value: number }[];
  buildDistributionData: { name: string; numberOfDevices: number; money: number; numberOfTerminals: number }[];
}
// 大型仪器校区 面板
export function useInstrumentCampus() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

  // 模拟数据：各校区大型仪器数据
  const mockCampusInstrumentData: Record<CampusId, IInstrumentCampusResult> = {
    [CampusId.HanDan]: {
      totalStatisticsData: { number: 450, amount: 12500 },
      useDirectionsData: [
        { name: "教学实验", value: 180 },
        { name: "科学研究", value: 150 },
        { name: "社会服务", value: 80 },
        { name: "生产测试", value: 40 }
      ],
      buildDistributionData: [
        { name: "物理实验楼", numberOfDevices: 65, money: 1850, numberOfTerminals: 12 },
        { name: "化学实验楼", numberOfDevices: 58, money: 1650, numberOfTerminals: 10 },
        { name: "生命科学楼", numberOfDevices: 52, money: 1450, numberOfTerminals: 9 },
        { name: "信息科学楼", numberOfDevices: 48, money: 1250, numberOfTerminals: 8 },
        { name: "材料科学楼", numberOfDevices: 42, money: 1150, numberOfTerminals: 7 },
        { name: "环境科学楼", numberOfDevices: 38, money: 950, numberOfTerminals: 6 },
        { name: "医学实验楼", numberOfDevices: 35, money: 850, numberOfTerminals: 5 },
        { name: "药学研究楼", numberOfDevices: 32, money: 750, numberOfTerminals: 4 },
        { name: "管理实验楼", numberOfDevices: 28, money: 650, numberOfTerminals: 3 },
        { name: "法学实验楼", numberOfDevices: 25, money: 550, numberOfTerminals: 2 }
      ]
    },
    [CampusId.JiangWan]: {
      totalStatisticsData: { number: 320, amount: 8500 },
      useDirectionsData: [
        { name: "教学实验", value: 125 },
        { name: "科学研究", value: 110 },
        { name: "社会服务", value: 60 },
        { name: "生产测试", value: 25 }
      ],
      buildDistributionData: [
        { name: "物理楼", numberOfDevices: 48, money: 1250, numberOfTerminals: 9 },
        { name: "化学楼", numberOfDevices: 42, money: 1150, numberOfTerminals: 8 },
        { name: "生命科学楼", numberOfDevices: 38, money: 950, numberOfTerminals: 7 },
        { name: "信息楼", numberOfDevices: 35, money: 850, numberOfTerminals: 6 },
        { name: "材料楼", numberOfDevices: 32, money: 750, numberOfTerminals: 5 },
        { name: "环境楼", numberOfDevices: 28, money: 650, numberOfTerminals: 4 },
        { name: "医学楼", numberOfDevices: 25, money: 550, numberOfTerminals: 3 },
        { name: "药学楼", numberOfDevices: 22, money: 450, numberOfTerminals: 2 },
        { name: "管理楼", numberOfDevices: 18, money: 350, numberOfTerminals: 2 },
        { name: "法学楼", numberOfDevices: 15, money: 250, numberOfTerminals: 1 }
      ]
    },
    [CampusId.FengLin]: {
      totalStatisticsData: { number: 280, amount: 5200 },
      useDirectionsData: [
        { name: "教学实验", value: 105 },
        { name: "科学研究", value: 95 },
        { name: "社会服务", value: 55 },
        { name: "生产测试", value: 25 }
      ],
      buildDistributionData: [
        { name: "医学实验中心", numberOfDevices: 52, money: 1250, numberOfTerminals: 10 },
        { name: "药学实验中心", numberOfDevices: 45, money: 1150, numberOfTerminals: 9 },
        { name: "护理实验中心", numberOfDevices: 38, money: 850, numberOfTerminals: 7 },
        { name: "公共卫生楼", numberOfDevices: 32, money: 750, numberOfTerminals: 6 },
        { name: "基础医学楼", numberOfDevices: 28, money: 650, numberOfTerminals: 5 },
        { name: "临床医学楼", numberOfDevices: 25, money: 550, numberOfTerminals: 4 },
        { name: "医学研究楼", numberOfDevices: 22, money: 450, numberOfTerminals: 3 },
        { name: "医学图书馆", numberOfDevices: 18, money: 350, numberOfTerminals: 2 },
        { name: "医学教学楼", numberOfDevices: 15, money: 250, numberOfTerminals: 1 },
        { name: "医学行政楼", numberOfDevices: 12, money: 150, numberOfTerminals: 1 }
      ]
    },
    [CampusId.ZhangJiang]: {
      totalStatisticsData: { number: 200, amount: 2300 },
      useDirectionsData: [
        { name: "教学实验", value: 75 },
        { name: "科学研究", value: 70 },
        { name: "社会服务", value: 40 },
        { name: "生产测试", value: 15 }
      ],
      buildDistributionData: [
        { name: "信息科学楼", numberOfDevices: 42, money: 850, numberOfTerminals: 8 },
        { name: "软件工程楼", numberOfDevices: 38, money: 750, numberOfTerminals: 7 },
        { name: "计算机科学楼", numberOfDevices: 35, money: 650, numberOfTerminals: 6 },
        { name: "电子工程楼", numberOfDevices: 32, money: 550, numberOfTerminals: 5 },
        { name: "微电子楼", numberOfDevices: 28, money: 450, numberOfTerminals: 4 },
        { name: "通信工程楼", numberOfDevices: 25, money: 350, numberOfTerminals: 3 },
        { name: "网络安全楼", numberOfDevices: 22, money: 250, numberOfTerminals: 2 },
        { name: "人工智能楼", numberOfDevices: 18, money: 150, numberOfTerminals: 2 },
        { name: "数据科学楼", numberOfDevices: 15, money: 100, numberOfTerminals: 1 },
        { name: "信息行政楼", numberOfDevices: 12, money: 80, numberOfTerminals: 1 }
      ]
    }
  } as Record<CampusId, IInstrumentCampusResult>;

  const { state, execute } = useAsyncState(
    async () => {
      if (campusId.value === CampusId.Overview) {
        return {
          totalStatisticsData: { number: 0, amount: 0 },
          useDirectionsData: [],
          buildDistributionData: [],
        };
      }
      return mockCampusInstrumentData[campusId.value] || {
        totalStatisticsData: { number: 0, amount: 0 },
        useDirectionsData: [],
        buildDistributionData: [],
      };
    },
    {
      totalStatisticsData: { number: 0, amount: 0 },
      useDirectionsData: [],
      buildDistributionData: [],
    },
    {
      immediate: false,
      resetOnExecute: false,
    },
  );

  watch(
    campusId,
    () => {
      if (campusId.value === CampusId.Overview) return;
      execute();
    },
    {
      immediate: true,
    },
  );

  return {
    state,
  };
}

// 楼顶详情
export function useInstrumentBuildingDetail() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

  // 模拟数据：楼栋详情数据
  const mockBuildingDetailData: IFetchBuildingDetailResult = {
    dxyqsl: { sl: 65, zd: 12, je: 1850 },
    syfx: [
      { name: "教学实验", value: 35 },
      { name: "科学研究", value: 20 },
      { name: "社会服务", value: 8 },
      { name: "生产测试", value: 2 }
    ],
    sbfb: [
      { name: "物理实验室", value: 18, value1: 520 },
      { name: "化学实验室", value: 15, value1: 450 },
      { name: "生物实验室", value: 12, value1: 380 },
      { name: "材料实验室", value: 10, value1: 320 },
      { name: "电子实验室", value: 8, value1: 280 },
      { name: "计算机实验室", value: 6, value1: 220 },
      { name: "分析测试室", value: 5, value1: 180 },
      { name: "仪器共享室", value: 4, value1: 150 }
    ]
  };

  // 模拟数据：终端设备详情
  const mockTerminalDeviceDetailData = [
    { name: "扫描电子显微镜", status: "在线", lastMaintenance: "2024-01-15" },
    { name: "核磁共振仪", status: "在线", lastMaintenance: "2024-01-10" },
    { name: "X射线衍射仪", status: "维护中", lastMaintenance: "2024-01-05" },
    { name: "质谱仪", status: "在线", lastMaintenance: "2023-12-28" },
    { name: "光谱分析仪", status: "在线", lastMaintenance: "2023-12-20" },
    { name: "热分析仪", status: "在线", lastMaintenance: "2023-12-15" },
    { name: "电化学工作站", status: "在线", lastMaintenance: "2023-12-10" },
    { name: "原子力显微镜", status: "在线", lastMaintenance: "2023-12-05" },
    { name: "激光共聚焦显微镜", status: "在线", lastMaintenance: "2023-11-30" },
    { name: "超高速离心机", status: "在线", lastMaintenance: "2023-11-25" },
    { name: "高压灭菌器", status: "在线", lastMaintenance: "2023-11-20" },
    { name: "培养箱", status: "在线", lastMaintenance: "2023-11-15" }
  ];

  // 模拟数据：设备分布详情
  const mockDeviceDistributionDetailData = [
    { floor: "1层", room: "101", device: "扫描电子显微镜", status: "正常" },
    { floor: "1层", room: "102", device: "核磁共振仪", status: "正常" },
    { floor: "1层", room: "103", device: "X射线衍射仪", status: "维护中" },
    { floor: "2层", room: "201", device: "质谱仪", status: "正常" },
    { floor: "2层", room: "202", device: "光谱分析仪", status: "正常" },
    { floor: "2层", room: "203", device: "热分析仪", status: "正常" },
    { floor: "3层", room: "301", device: "电化学工作站", status: "正常" },
    { floor: "3层", room: "302", device: "原子力显微镜", status: "正常" },
    { floor: "4层", room: "401", device: "激光共聚焦显微镜", status: "正常" },
    { floor: "4层", room: "402", device: "超高速离心机", status: "正常" },
    { floor: "5层", room: "501", device: "高压灭菌器", status: "正常" },
    { floor: "5层", room: "502", device: "培养箱", status: "正常" }
  ];

  const { state, execute } = useAsyncState(
    async (buildName: string, buildId: string) => {
      // 根据楼栋名称返回不同的模拟数据
      const buildingData = {
        ...mockBuildingDetailData,
        dxyqsl: {
          sl: Math.floor(Math.random() * 100) + 30, // 30-130台
          zd: Math.floor(Math.random() * 20) + 5,   // 5-25个终端
          je: Math.floor(Math.random() * 3000) + 1000 // 1000-4000万元
        }
      };
      return buildingData;
    },
    {} as IFetchBuildingDetailResult,
    { resetOnExecute: false, immediate: false },
  );

  // 使用方向
  const useDirectionsData = computed(() => {
    return state.value?.syfx || mockBuildingDetailData.syfx;
  });

  // 设备分布
  const deviceDistributionData = computed(() => {
    return state.value?.sbfb || mockBuildingDetailData.sbfb;
  });

  // 终端设备详情
  const {
    state: terminalDeviceDetailData,
    execute: executeTerminalDeviceDetailData,
  } = useAsyncState(
    async (buildName: string, buildId: string) => {
      return mockTerminalDeviceDetailData;
    },
    mockTerminalDeviceDetailData,
    { resetOnExecute: false, immediate: false },
  );

  // 设备分布详情
  const {
    state: deviceDistributionDetailData,
    execute: executeDeviceDistributionDetailData,
  } = useAsyncState(
    async (buildName: string, buildId: string) => {
      return mockDeviceDistributionDetailData;
    },
    mockDeviceDistributionDetailData,
    { resetOnExecute: false, immediate: false },
  );

  // 大型仪器数
  const largeInstrumentData = computed(() => {
    const { sl = 0, zd = 0, je = 0 } = state.value?.dxyqsl || mockBuildingDetailData.dxyqsl;
    return { sl, zd, je, zdazzs: terminalDeviceDetailData.value?.length };
  });

  const run = (buildName: string, buildId: string) => {
    execute(0, buildName, buildId);
    executeTerminalDeviceDetailData(0, buildName, buildId);
    executeDeviceDistributionDetailData(0, buildName, buildId);
  };

  return {
    run,
    largeInstrumentData,
    useDirectionsData,
    deviceDistributionData,
    terminalDeviceDetailData,
    deviceDistributionDetailData,
  };
}
