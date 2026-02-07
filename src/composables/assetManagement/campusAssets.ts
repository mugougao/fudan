import type { MaybeRefOrGetter, Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
// import {
//   fetchCampusAssets,
//   fetchCampusAssetsBuildAssets,
//   fetchCampusAssetsBuildAssetsType,
//   fetchCampusAssetsBuildAssetsYear,
//   fetchCampusAssetsBuildInfo,
//   fetchCampusAssetsDistribution,
//   fetchCampusAssetsExpireDistribution,
//   fetchCampusAssetsLargeInstrumentDistribution,
//   fetchCampusAssetsType,
// } from "@/api/assetManagement/campusAssets.ts";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";

// 校园资产 - 资产管理 - 两侧面板数据
export function useCampusAssets() {
  // 校区 ID
  const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

  // 模拟数据：各校区资产总数和金额
  const mockTotalData: Record<CampusId, { totalNumber: number; totalAmount: number }> = {
    [CampusId.Overview]: { totalNumber: 12560, totalAmount: 38500 },
    [CampusId.HanDan]: { totalNumber: 5200, totalAmount: 18500 },
    [CampusId.JiangWan]: { totalNumber: 3800, totalAmount: 12500 },
    [CampusId.FengLin]: { totalNumber: 2500, totalAmount: 5800 },
    [CampusId.ZhangJiang]: { totalNumber: 1060, totalAmount: 1700 },
  };

  // 模拟数据：各校区资产类型分布
  const mockTypeData: Record<CampusId, Record<"设备" | "家具" | "软件", [number, number]>> = {
    [CampusId.Overview]: {
      "设备": [8560, 28500],
      "家具": [3200, 8500],
      "软件": [800, 1500]
    },
    [CampusId.HanDan]: {
      "设备": [3500, 12500],
      "家具": [1200, 4500],
      "软件": [500, 1500]
    },
    [CampusId.JiangWan]: {
      "设备": [2600, 8500],
      "家具": [900, 3200],
      "软件": [300, 800]
    },
    [CampusId.FengLin]: {
      "设备": [1800, 4200],
      "家具": [500, 1200],
      "软件": [200, 400]
    },
    [CampusId.ZhangJiang]: {
      "设备": [750, 1800],
      "家具": [250, 500],
      "软件": [60, 200]
    }
  };

  // 模拟数据：资产数量分布（仅概览页面）
  const mockNumberAssetsData = [
    { name: "邯郸校区", value: 5200, value2: 18500 },
    { name: "江湾校区", value: 3800, value2: 12500 },
    { name: "枫林校区", value: 2500, value2: 5800 },
    { name: "张江校区", value: 1060, value2: 1700 }
  ];

  // 模拟数据：资产到期分布（按校区和类型）
  const mockExpireAssetsData: Record<CampusId, Record<0 | 1, { name: string; value1: number; value2: number }[]>> = {
    [CampusId.Overview]: {
      0: [
        { name: "2024年", value1: 1250, value2: 4200 },
        { name: "2025年", value1: 980, value2: 3500 },
        { name: "2026年", value1: 750, value2: 2800 },
        { name: "2027年", value1: 520, value2: 1800 },
        { name: "2028年", value1: 380, value2: 1200 }
      ],
      1: [
        { name: "3年内", value1: 2980, value2: 9500 },
        { name: "3-5年", value1: 1250, value2: 4200 },
        { name: "5-10年", value1: 750, value2: 2800 },
        { name: "10年以上", value1: 380, value2: 1200 }
      ]
    },
    [CampusId.HanDan]: {
      0: [
        { name: "2024年", value1: 520, value2: 1800 },
        { name: "2025年", value1: 420, value2: 1500 },
        { name: "2026年", value1: 320, value2: 1200 },
        { name: "2027年", value1: 220, value2: 800 },
        { name: "2028年", value1: 180, value2: 600 }
      ],
      1: [
        { name: "3年内", value1: 1240, value2: 4500 },
        { name: "3-5年", value1: 520, value2: 1800 },
        { name: "5-10年", value1: 320, value2: 1200 },
        { name: "10年以上", value1: 180, value2: 600 }
      ]
    },
    [CampusId.JiangWan]: {
      0: [
        { name: "2024年", value1: 380, value2: 1250 },
        { name: "2025年", value1: 320, value2: 1100 },
        { name: "2026年", value1: 250, value2: 900 },
        { name: "2027年", value1: 180, value2: 600 },
        { name: "2028年", value1: 150, value2: 500 }
      ],
      1: [
        { name: "3年内", value1: 950, value2: 3350 },
        { name: "3-5年", value1: 380, value2: 1250 },
        { name: "5-10年", value1: 250, value2: 900 },
        { name: "10年以上", value1: 150, value2: 500 }
      ]
    },
    [CampusId.FengLin]: {
      0: [
        { name: "2024年", value1: 250, value2: 850 },
        { name: "2025年", value1: 200, value2: 700 },
        { name: "2026年", value1: 150, value2: 500 },
        { name: "2027年", value1: 100, value2: 350 },
        { name: "2028年", value1: 80, value2: 250 }
      ],
      1: [
        { name: "3年内", value1: 630, value2: 2100 },
        { name: "3-5年", value1: 250, value2: 850 },
        { name: "5-10年", value1: 150, value2: 500 },
        { name: "10年以上", value1: 80, value2: 250 }
      ]
    },
    [CampusId.ZhangJiang]: {
      0: [
        { name: "2024年", value1: 120, value2: 400 },
        { name: "2025年", value1: 100, value2: 350 },
        { name: "2026年", value1: 80, value2: 280 },
        { name: "2027年", value1: 60, value2: 200 },
        { name: "2028年", value1: 50, value2: 180 }
      ],
      1: [
        { name: "3年内", value1: 300, value2: 1010 },
        { name: "3-5年", value1: 120, value2: 400 },
        { name: "5-10年", value1: 80, value2: 280 },
        { name: "10年以上", value1: 50, value2: 180 }
      ]
    }
  };

  // 模拟数据：大型仪器分布
  const mockLargeInstrumentData: Record<CampusId, { name: string; value: number }[]> = {
    [CampusId.Overview]: [
      { name: "扫描电子显微镜", value: 28 },
      { name: "核磁共振仪", value: 18 },
      { name: "X射线衍射仪", value: 15 },
      { name: "质谱仪", value: 12 },
      { name: "光谱分析仪", value: 10 },
      { name: "热分析仪", value: 8 },
      { name: "电化学工作站", value: 6 },
      { name: "原子力显微镜", value: 5 },
      { name: "激光共聚焦显微镜", value: 4 },
      { name: "超高速离心机", value: 3 }
    ],
    [CampusId.HanDan]: [
      { name: "扫描电子显微镜", value: 12 },
      { name: "核磁共振仪", value: 8 },
      { name: "X射线衍射仪", value: 6 },
      { name: "质谱仪", value: 5 },
      { name: "光谱分析仪", value: 4 },
      { name: "热分析仪", value: 3 },
      { name: "电化学工作站", value: 2 },
      { name: "原子力显微镜", value: 2 },
      { name: "激光共聚焦显微镜", value: 1 },
      { name: "超高速离心机", value: 1 }
    ],
    [CampusId.JiangWan]: [
      { name: "扫描电子显微镜", value: 8 },
      { name: "核磁共振仪", value: 5 },
      { name: "X射线衍射仪", value: 4 },
      { name: "质谱仪", value: 3 },
      { name: "光谱分析仪", value: 3 },
      { name: "热分析仪", value: 2 },
      { name: "电化学工作站", value: 2 },
      { name: "原子力显微镜", value: 1 },
      { name: "激光共聚焦显微镜", value: 1 },
      { name: "超高速离心机", value: 1 }
    ],
    [CampusId.FengLin]: [
      { name: "扫描电子显微镜", value: 5 },
      { name: "核磁共振仪", value: 3 },
      { name: "X射线衍射仪", value: 3 },
      { name: "质谱仪", value: 2 },
      { name: "光谱分析仪", value: 2 },
      { name: "热分析仪", value: 1 },
      { name: "电化学工作站", value: 1 },
      { name: "原子力显微镜", value: 1 },
      { name: "激光共聚焦显微镜", value: 1 },
      { name: "超高速离心机", value: 1 }
    ],
    [CampusId.ZhangJiang]: [
      { name: "扫描电子显微镜", value: 3 },
      { name: "核磁共振仪", value: 2 },
      { name: "X射线衍射仪", value: 2 },
      { name: "质谱仪", value: 2 },
      { name: "光谱分析仪", value: 1 },
      { name: "热分析仪", value: 1 },
      { name: "电化学工作站", value: 1 },
      { name: "原子力显微镜", value: 0 },
      { name: "激光共聚焦显微镜", value: 0 },
      { name: "超高速离心机", value: 0 }
    ]
  };

  const { state: totalState, execute: totalExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchCampusAssets(campusId.value));
      // if (err) return { totalNumber: 0, totalAmount: 0 };
      // const { sl = 0, je = 0 } = res?.resultData || {};
      // return { totalNumber: sl, totalAmount: je };
      return mockTotalData[campusId.value] || { totalNumber: 0, totalAmount: 0 };
    },
    { totalNumber: 0, totalAmount: 0 },
    { resetOnExecute: false },
  );

  const { state: typeState, execute: typeExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchCampusAssetsType(campusId.value));
      // if (err) return {} as Record<"设备" | "家具" | "软件", [number, number]>;
      // return (res?.resultData || [])
      //   .reduce((prev, item) => ({
      //     ...prev,
      //     [item.name]: [item.sl, item.je],
      //   }), {} as Record<"设备" | "家具" | "软件", [number, number]>);
      return mockTypeData[campusId.value] || {
        "设备": [0, 0],
        "家具": [0, 0],
        "软件": [0, 0]
      };
    },
    {} as Record<"设备" | "家具" | "软件", [number, number]>,
    { resetOnExecute: false },
  );

  // 总览
  const overviewState = computed(() => {
    return {
      totalNumber: totalState.value.totalNumber,
      totalAmount: totalState.value.totalAmount,
      typeList: typeState.value,
    };
  });

  // 资产数量分布
  const { state: numberAssetsState, execute: numberAssetsExecute } = useAsyncState(
    async () => {
      if (campusId.value !== CampusId.Overview) return [];
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchCampusAssetsDistribution());
      // if (err) return [];
      // return (res?.resultData || []).map(({ name, sl, je }) => ({ name, value: sl, value2: je }));
      return mockNumberAssetsData;
    },
    [],
    { resetOnExecute: false },
  );

  const [expireAssetsType, setExpireAssetsType] = useState<0 | 1>(0);
  // 资产到期分布
  const { state: expireAssetsState, execute: expireAssetsExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchCampusAssetsExpireDistribution(campusId.value, expireAssetsType.value));
      // if (err) return [];
      // return (res?.resultData || []).map(({ time, sl, je }) => ({ name: time, value1: sl, value2: je }));
      const campusData = mockExpireAssetsData[campusId.value];
      if (!campusData) return [];
      return campusData[expireAssetsType.value] || [];
    },
    [],
    { resetOnExecute: false },
  );

  // 大型仪器分布
  const { state: largeInstrumentState, execute: largeInstrumentExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchCampusAssetsLargeInstrumentDistribution(campusId.value));
      // if (err) return [];
      // return (res?.resultData || []);
      return mockLargeInstrumentData[campusId.value] || [];
    },
    [],
    { resetOnExecute: false },
  );

  watch(
    campusId,
    () => {
      totalExecute();
      typeExecute();
      numberAssetsExecute();
      largeInstrumentExecute();
    },
  );
  watch(
    () => [campusId.value, expireAssetsType.value],
    () => {
      expireAssetsExecute();
    },
  );

  return {
    overviewState,
    numberAssetsState,
    expireAssetsState,
    expireAssetsType,
    setExpireAssetsType,
    largeInstrumentState,
  };
}

// 校园资产 - 资产管理 - 建筑楼栋信息
export function useCampusAssetsBuildInfo(buildId: MaybeRefOrGetter<string>) {
  const { state: propertyInfo, execute: propertyInfoExecute } = useAsyncState(async () => {
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchCampusAssetsBuildInfo(toValue(buildId)));
    // if (err) return {};
    // return res?.resultData || {};
    return {
      buildingName: "光华楼",
      buildingArea: 28500,
      constructionYear: 2010,
      usage: "教学科研",
      manager: "资产管理处",
      contact: "021-5566xxxx"
    };
  }, {
    buildingName: "",
    buildingArea: 0,
    constructionYear: 0,
    usage: "",
    manager: "",
    contact: ""
  }, { immediate: false, resetOnExecute: false });

  const { state: assetsInfo, execute: assetsInfoExecute } = useAsyncState(async () => {
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchCampusAssetsBuildAssets(toValue(buildId)));
    // if (err) return {};
    // return res?.resultData || {};
    return {
      totalNumber: 1250,
      totalAmount: 3850,
      deviceCount: 850,
      furnitureCount: 320,
      softwareCount: 80
    };
  }, {
    totalNumber: 0,
    totalAmount: 0,
    deviceCount: 0,
    furnitureCount: 0,
    softwareCount: 0
  }, { immediate: false, resetOnExecute: false });

  const { state: assetsTypeInfo, execute: assetsTypeInfoExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchCampusAssetsBuildAssetsType(toValue(buildId)));
      // if (err) {
      //   return { number: [], amount: [] };
      // }
      // const number: { name: string;value: number }[] = [];
      // const amount: { name: string;value: number }[] = [];
      // (res?.resultData || []).forEach(({ name, value1, value2 }) => {
      //   number.push({ name, value: value1 });
      //   amount.push({ name, value: value2 });
      // });
      // return { number, amount };
      return {
        number: [
          { name: "教学设备", value: 420 },
          { name: "实验仪器", value: 280 },
          { name: "办公家具", value: 120 },
          { name: "计算机", value: 180 },
          { name: "软件系统", value: 80 }
        ],
        amount: [
          { name: "教学设备", value: 1850 },
          { name: "实验仪器", value: 1250 },
          { name: "办公家具", value: 450 },
          { name: "计算机", value: 200 },
          { name: "软件系统", value: 100 }
        ]
      };
    },
    { number: [], amount: [] },
    { immediate: false, resetOnExecute: false },
  );

  const [expireAssetsType, setExpireAssetsType] = useState<0 | 1>(0);
  const { state: assetsYearInfo, execute: assetsYearInfoExecute } = useAsyncState(async () => {
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchCampusAssetsBuildAssetsYear(toValue(buildId), expireAssetsType.value));
    // if (err) return [];
    // return (res?.resultData || []).map(({ time, sl, je }) => ({ name: time, value1: sl, value2: je }));
    // 根据到期类型返回不同的模拟数据
    if (expireAssetsType.value === 0) {
      return [
        { name: "2024年", value1: 120, value2: 420 },
        { name: "2025年", value1: 85, value2: 320 },
        { name: "2026年", value1: 65, value2: 250 },
        { name: "2027年", value1: 45, value2: 180 },
        { name: "2028年", value1: 30, value2: 120 }
      ];
    } else {
      return [
        { name: "3年内", value1: 310, value2: 1070 },
        { name: "3-5年", value1: 120, value2: 420 },
        { name: "5-10年", value1: 65, value2: 250 },
        { name: "10年以上", value1: 30, value2: 120 }
      ];
    }
  }, [], { immediate: false, resetOnExecute: false });

  function run() {
    propertyInfoExecute();
    assetsInfoExecute();
    assetsTypeInfoExecute();
    assetsYearInfoExecute();
  }

  watch(
    () => [buildId, expireAssetsType.value],
    () => {
      assetsYearInfoExecute();
    },
  );

  return {
    propertyInfo,
    assetsInfo,
    assetsTypeInfo,
    assetsYearInfo,
    setExpireAssetsType,
    run,
  };
}
