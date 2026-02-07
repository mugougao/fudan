import type { MaybeRefOrGetter } from "@vueuse/core";
import type { CampusId } from "@/enums";
import { useAsyncState } from "@vueuse/core";
import to from "await-to-js";
// import { fetchCampusEnergyConsumption } from "@/api/financial/energy.ts";
// import { fetchCampusAssetsType, fetchOverview } from "@/api/financial/index.ts";
import { useCampusStore } from "@/stores/campus.ts";

async function useAssetProps(campusId: CampusId) {
  // 根据校区ID返回不同的模拟数据
  const campusDataMap = {
    "3": { // 邯郸校区
      totalCount: [300, 4200, 3500] as [300, number, number], // [金额（亿元）, 净值（亿元）, 数量（个）]
      typeCount: {
        device: [45, 2200, 1800] as [number, number, number],
        furniture: [25, 1200, 1000] as [number, number, number],
        software: [15, 800, 700] as [number, number, number]
      }
    },
    "4": { // 江湾校区
      totalCount: [300, 3200, 2800] as [300, number, number],
      typeCount: {
        device: [35, 1700, 1500] as [number, number, number],
        furniture: [18, 900, 800] as [number, number, number],
        software: [12, 600, 500] as [number, number, number]
      }
    },
    "5": { // 枫林校区
      totalCount: [300, 2200, 1800] as [300, number, number],
      typeCount: {
        device: [25, 1200, 1000] as [number, number, number],
        furniture: [12, 600, 500] as [number, number, number],
        software: [8, 400, 300] as [number, number, number]
      }
    },
    "6": { // 张江校区
      totalCount: [300, 1800, 1500] as [300, number, number],
      typeCount: {
        device: [20, 1000, 850] as [number, number, number],
        furniture: [10, 500, 400] as [number, number, number],
        software: [5, 300, 250] as [number, number, number]
      }
    }
  };
  
  // 获取校区数据，默认为邯郸校区
  const campusData = campusDataMap[campusId as keyof typeof campusDataMap] || campusDataMap["3"];
  const totalCount = campusData.totalCount;
  const typeCount = campusData.typeCount;
  const chargeData = [0, 0]; // 充电数据（占位）
  
  return { totalCount, typeCount, chargeData };
}

async function useElectProps(campusId: CampusId) {
  // 根据校区ID返回不同的能源消耗数据
  const campusEnergyMap = {
    "3": { // 邯郸校区
      yearelectamount: 420, // 年用电量（万千瓦时）
      yearwateramount: 280, // 年用水量（万吨）
      monthElect: 35,       // 月用电量（万千瓦时）
      monthWater: 23,       // 月用水量（万吨）
      totalElectAmount: 320, // 总电费（万元）
      totalWaterAmount: 160  // 总水费（万元）
    },
    "4": { // 江湾校区
      yearelectamount: 350,
      yearwateramount: 230,
      monthElect: 29,
      monthWater: 19,
      totalElectAmount: 265,
      totalWaterAmount: 135
    },
    "5": { // 枫林校区
      yearelectamount: 280,
      yearwateramount: 190,
      monthElect: 23,
      monthWater: 16,
      totalElectAmount: 210,
      totalWaterAmount: 110
    },
    "6": { // 张江校区
      yearelectamount: 220,
      yearwateramount: 150,
      monthElect: 18,
      monthWater: 12,
      totalElectAmount: 165,
      totalWaterAmount: 85
    }
  };
  
  // 获取校区数据，默认为邯郸校区
  const overviewData = campusEnergyMap[campusId as keyof typeof campusEnergyMap] || campusEnergyMap["3"];
  
  return { overviewData };
}

async function useWaterProps(campusId: CampusId) {
  // 根据校区ID返回不同的用水消耗数据（与用电数据相同结构）
  const campusWaterMap = {
    "3": { // 邯郸校区
      yearelectamount: 420, // 年用电量（万千瓦时）
      yearwateramount: 280, // 年用水量（万吨）
      monthElect: 35,       // 月用电量（万千瓦时）
      monthWater: 23,       // 月用水量（万吨）
      totalElectAmount: 320, // 总电费（万元）
      totalWaterAmount: 160  // 总水费（万元）
    },
    "4": { // 江湾校区
      yearelectamount: 350,
      yearwateramount: 230,
      monthElect: 29,
      monthWater: 19,
      totalElectAmount: 265,
      totalWaterAmount: 135
    },
    "5": { // 枫林校区
      yearelectamount: 280,
      yearwateramount: 190,
      monthElect: 23,
      monthWater: 16,
      totalElectAmount: 210,
      totalWaterAmount: 110
    },
    "6": { // 张江校区
      yearelectamount: 220,
      yearwateramount: 150,
      monthElect: 18,
      monthWater: 12,
      totalElectAmount: 165,
      totalWaterAmount: 85
    }
  };
  
  // 获取校区数据，默认为邯郸校区
  const overviewData = campusWaterMap[campusId as keyof typeof campusWaterMap] || campusWaterMap["3"];
  
  return { overviewData };
}

const categoriesHookMap = {
  asset: useAssetProps,
  electric: useElectProps,
  waterUse: useWaterProps,
  property: () => {},
  repair: () => {},
};

export function useOverviewCampus(categories: MaybeRefOrGetter<string | undefined>) {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  const {
    state: overviewState,
    execute: overviewExecute,
  } = useAsyncState<Record<string, any>>(
    async () => {
      // 根据校区ID返回不同的财务总览数据
      const campusOverviewMap = {
        "3": { // 邯郸校区
          asset: 4200,      // 资产净值（万元）
          electric: 420,    // 年用电量（万千瓦时）
          waterUse: 280,    // 年用水量（万吨）
          property: 85,     // 物业管理费（万元）
          repair: 45        // 维修费用（万元）
        },
        "4": { // 江湾校区
          asset: 3200,
          electric: 350,
          waterUse: 230,
          property: 65,
          repair: 35
        },
        "5": { // 枫林校区
          asset: 2200,
          electric: 280,
          waterUse: 190,
          property: 45,
          repair: 25
        },
        "6": { // 张江校区
          asset: 1800,
          electric: 220,
          waterUse: 150,
          property: 35,
          repair: 18
        }
      };
      
      // 获取校区数据，默认为邯郸校区
      return campusOverviewMap[campusId.value as keyof typeof campusOverviewMap] || campusOverviewMap["3"];
    },
    {},
    {
      resetOnExecute: false,
      immediate: true,
    },
  );

  // todo: 动态Hooks

  const categoriesComponentProps = shallowRef<any>({});

  watch(
    () => [toValue(categories), campusId.value] as [string | undefined, CampusId],
    async ([val, campusId]: [string | undefined, CampusId]) => {
      if (!val) {
        categoriesComponentProps.value = {};
        return;
      }
      const func = categoriesHookMap[val] || (() => Promise.resolve({}));
      categoriesComponentProps.value = await func(campusId);
    },
  );
  watch(campusId, () => overviewExecute());

  return { overviewState, categoriesComponentProps };
}
