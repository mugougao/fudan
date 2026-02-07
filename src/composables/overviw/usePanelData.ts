import { useAsyncState } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
// import {
//   fetchTodaySchoolAssets,
//   fetchTodaySchoolEnergy,
//   fetchTodaySchoolInCount,
//   fetchTodaySchoolTraffic,
// } from "@/api/overviw/index";
import { CampusId } from "@/enums";

export function usePanelData() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview);

  // 模拟数据：校园门岗数据（按校区）
  const mockGuardPostData: Record<CampusId, { count: number; traffic: { name: string; value: number }[] }> = {
    [CampusId.Overview]: {
      count: 28560,
      traffic: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}`,
        value: Math.floor(800 + Math.random() * 400)
      }))
    },
    [CampusId.HanDan]: {
      count: 12500,
      traffic: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}`,
        value: Math.floor(350 + Math.random() * 200)
      }))
    },
    [CampusId.JiangWan]: {
      count: 8500,
      traffic: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}`,
        value: Math.floor(250 + Math.random() * 150)
      }))
    },
    [CampusId.FengLin]: {
      count: 5200,
      traffic: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}`,
        value: Math.floor(150 + Math.random() * 100)
      }))
    },
    [CampusId.ZhangJiang]: {
      count: 3200,
      traffic: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}`,
        value: Math.floor(100 + Math.random() * 80)
      }))
    }
  };

  // 模拟数据：校园资产数据（按校区）[数量, 金额, 净值]
  const mockAssetsData: Record<CampusId, [number, number, number]> = {
    [CampusId.Overview]: [125600, 385000, 285000],
    [CampusId.HanDan]: [52000, 185000, 125000],
    [CampusId.JiangWan]: [38000, 125000, 85000],
    [CampusId.FengLin]: [25000, 58000, 42000],
    [CampusId.ZhangJiang]: [10600, 17000, 12000]
  };

  // 模拟数据：能耗统计数据（按校区）
  const mockEnergyData: Record<CampusId, {
    water: { yearOverYear: number; year: number; lastYear: number };
    electricity: { yearOverYear: number; year: number; lastYear: number };
  }> = {
    [CampusId.Overview]: {
      water: { yearOverYear: -8.5, year: 2850, lastYear: 3120 },
      electricity: { yearOverYear: -12.2, year: 4250, lastYear: 4850 }
    },
    [CampusId.HanDan]: {
      water: { yearOverYear: -7.2, year: 1250, lastYear: 1350 },
      electricity: { yearOverYear: -10.5, year: 1850, lastYear: 2050 }
    },
    [CampusId.JiangWan]: {
      water: { yearOverYear: -6.8, year: 850, lastYear: 920 },
      electricity: { yearOverYear: -9.8, year: 1250, lastYear: 1380 }
    },
    [CampusId.FengLin]: {
      water: { yearOverYear: -5.5, year: 520, lastYear: 550 },
      electricity: { yearOverYear: -8.2, year: 850, lastYear: 920 }
    },
    [CampusId.ZhangJiang]: {
      water: { yearOverYear: -4.2, year: 320, lastYear: 340 },
      electricity: { yearOverYear: -6.5, year: 520, lastYear: 580 }
    }
  };

  const {
    state: guardPost,
    execute: fetchGuardPost,
  } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [
      //   [,res1],
      //   [,res2],
      // ] = await Promise.all([
      //   to(fetchTodaySchoolInCount(campusId.value)),
      //   to(fetchTodaySchoolTraffic(campusId.value)),
      // ]);
      // const count = res1?.resultData?.count || 0;
      // const traffic = res2?.resultData || [];
      // return { count, traffic };
      return mockGuardPostData[campusId.value] || mockGuardPostData[CampusId.Overview];
    },
    {
      count: 0,
      traffic: [] as { name: string; value: number }[],
    },
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: assets,
    execute: fetchAssets,
  } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [,res] = await to(fetchTodaySchoolAssets(campusId.value));
      // const { jz = 0, sl = 0, je = 0 } = res?.resultData || { jz: 0, sl: 0, je: 0 };
      // return [sl, je, jz];
      return mockAssetsData[campusId.value] || mockAssetsData[CampusId.Overview];
    },
    [0, 0, 0],
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: energy,
    execute: fetchEnergy,
  } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [,res] = await to(fetchTodaySchoolEnergy(campusId.value));
      // const { yearelectmom = 0, oldyearwater = 0, oldyearelect = 0, yearwater = 0, yearelect = 0, yearwatermom = 0 } = res?.resultData || {};
      // 
      // return {
      //   water: {
      //     yearOverYear: yearwatermom,
      //     year: yearwater,
      //     lastYear: oldyearwater,
      //   },
      //   electricity: {
      //     yearOverYear: yearelectmom,
      //     year: yearelect,
      //     lastYear: oldyearelect,
      //   },
      // };
      return mockEnergyData[campusId.value] || mockEnergyData[CampusId.Overview];
    },
    {
      water: {
        yearOverYear: 0,
        year: 0,
        lastYear: 0,
      },
      electricity: {
        yearOverYear: 0,
        year: 0,
        lastYear: 0,
      },
    },
    { immediate: true, resetOnExecute: false },
  );

  watch(
    campusId,
    () => {
      fetchGuardPost();
      fetchAssets();
      fetchEnergy();
    },
    // { immediate: true }
  );

  return { guardPost, assets, energy };
}
