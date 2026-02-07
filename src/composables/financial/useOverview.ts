import type { MaybeRefOrGetter } from "@vueuse/core";
import { useAsyncState } from "@vueuse/core";
import to from "await-to-js";
// import { fetchCampusEnergyConsumption } from "@/api/financial/energy.ts";
// import { fetchCampusAssetsDistribution, fetchCampusAssetsType, fetchCampusUseWaterWithElectricityCount, fetchOverview } from "@/api/financial/index.ts";

async function useAssetProps() {
  // 模拟数据：资产总览
  const totalCount = [300, 12500, 8500] as [300, number, number]; // [总金额（亿元）, 资产净值（亿元）, 总资产数（个）]
  
  // 模拟数据：资产类型分布
  const typeCount = {
    device: [150, 6000, 4500] as [number, number, number], // [金额, 净值, 数量]
    furniture: [80, 3500, 2500] as [number, number, number],
    software: [70, 3000, 1500] as [number, number, number]
  };
  
  // 模拟数据：资产数量分布（按校区）
  const numberData = [
    { name: "邯郸", value: 3500 },
    { name: "江湾", value: 2800 },
    { name: "枫林", value: 1500 },
    { name: "张江", value: 700 }
  ];
  
  // 模拟数据：资产金额分布（按校区）
  const moneyData = [
    { name: "邯郸", value1: 120, value2: 85 },
    { name: "江湾", value1: 95, value2: 65 },
    { name: "枫林", value1: 55, value2: 40 },
    { name: "张江", value1: 30, value2: 20 }
  ];
  
  // 模拟数据：充电数据（占位）
  const chargeData = [0, 0];
  
  return { totalCount, typeCount, chargeData, numberData, moneyData };
}

async function useElectProps() {
  // 模拟数据：能源消耗总览
  const overviewData = {
    yearelectamount: 1250, // 年用电量（万千瓦时）
    yearwateramount: 850,  // 年用水量（万吨）
    monthElect: 105,       // 月用电量（万千瓦时）
    monthWater: 72,        // 月用水量（万吨）
    totalElectAmount: 950, // 总电费（万元）
    totalWaterAmount: 480  // 总水费（万元）
  };
  
  // 模拟数据：用电数据图表
  const chartData = [
    { name: "邯郸", value1: 320, value2: 250 },
    { name: "江湾", value1: 280, value2: 220 },
    { name: "枫林", value1: 210, value2: 165 },
    { name: "张江", value1: 180, value2: 140 }
  ];
  
  return { overviewData, chartData };
}

async function useWaterProps() {
  // 模拟数据：用水消耗总览（与能源消耗数据相同结构，但侧重用水）
  const overviewData = {
    yearelectamount: 1250, // 年用电量（万千瓦时）
    yearwateramount: 850,  // 年用水量（万吨）
    monthElect: 105,       // 月用电量（万千瓦时）
    monthWater: 72,        // 月用水量（万吨）
    totalElectAmount: 950, // 总电费（万元）
    totalWaterAmount: 480  // 总水费（万元）
  };
  
  // 模拟数据：用水数据图表
  const chartData = [
    { name: "邯郸", value1: 180, value2: 145 },
    { name: "江湾", value1: 150, value2: 120 },
    { name: "枫林", value1: 120, value2: 95 },
    { name: "张江", value1: 100, value2: 80 }
  ];
  
  return { overviewData, chartData };
}

const categoriesHookMap = {
  asset: useAssetProps,
  electric: useElectProps,
  waterUse: useWaterProps,
  property: () => {},
  repair: () => {},
};

export function useOverview(categories: MaybeRefOrGetter<string | undefined>) {
  const {
    state: overviewState,
  } = useAsyncState<Record<string, any>>(
    async () => {
      // 模拟数据：财务总览数据
      return {
        asset: 12500,      // 资产净值（万元）
        electric: 1250,    // 年用电量（万千瓦时）
        waterUse: 850,     // 年用水量（万吨）
        property: 320,     // 物业管理费（万元）
        repair: 180,       // 维修费用（万元）
      };
    },
    {},
    { resetOnExecute: false, immediate: true },
  );

  const categoriesComponentProps = shallowRef<any>({});

  watch(
    () => toValue(categories),
    async (val: string | undefined) => {
      if (!val) {
        categoriesComponentProps.value = {};
        return;
      }
      const func = categoriesHookMap[val] || (() => Promise.resolve({}));
      categoriesComponentProps.value = await func();
    },
  );

  return { overviewState, categoriesComponentProps };
}
