import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";

import to from "await-to-js";
import {
  fetchAssetsBuilding,
  fetchAssetsCollege,
  fetchAssetsDistribution,
  fetchAssetsList,
  fetchAssetsTerminalInstalled,
  fetchAssetsTotal,
  fetchAssetsUseDirection,
  fetchBuildingDetail,
  fetchBuildingDeviceDistribution,
  fetchBuildingTerminalDetail,
  type IFetchBuildingDetailResult,
} from "@/api/assetManagement/instrument_etl.ts";
import { CampusId } from "@/enums";

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
  const service = async () => {
    const result: IInstrumentOverviewResult = {
      totalStatisticsData: { number: 0, amount: 0 },
      useDirectionsData: [],
      instrumentDistributionData: {
        devicesNumber: [],
        amount: [],
      },
      installedTerminal: { count: 0, data: [] },
      instrumentListData: [],
    };
    const [
      totalStatistics,
      useDirections,
      instrumentDistribution,
      installedTerminal,
      instrumentList,
    ] = await Promise.all([
      to(fetchAssetsTotal()),
      to(fetchAssetsUseDirection()),
      to(fetchAssetsDistribution()),
      to(fetchAssetsTerminalInstalled()),
      to(fetchAssetsList()),
    ]);
    const [,totalStatisticsRes] = totalStatistics;
    if (totalStatisticsRes?.resultData) {
      const { sl = 0, je = 0 } = totalStatisticsRes.resultData;
      result.totalStatisticsData = { number: sl, amount: je };
    }
    const [,useDirectionsRes] = useDirections;
    if (useDirectionsRes?.resultData) {
      result.useDirectionsData = useDirectionsRes.resultData;
    }
    const [,instrumentDistributionRes] = instrumentDistribution;
    if (instrumentDistributionRes?.resultData) {
      const devicesNumber = [] as { name: string; value: number }[];
      const amount = [] as { name: string; value: number }[];
      instrumentDistributionRes.resultData.forEach(({ name, value, value1 }) => {
        devicesNumber.push({ name, value });
        amount.push({ name, value: value1 });
      });
      result.instrumentDistributionData = { devicesNumber, amount };
    }
    const [,installedTerminalRes] = installedTerminal;
    if (installedTerminalRes?.resultData) {
      const index = installedTerminalRes.resultData.findIndex(({ name }) => name === "全校");
      if (index === -1) {
        result.installedTerminal = {
          count: 0,
          data: installedTerminalRes.resultData,
        };
      }
      const [{ value: count }] = installedTerminalRes.resultData.splice(index, 1);
      result.installedTerminal = {
        count: count || 0,
        data: installedTerminalRes.resultData.map(({ name, value }) => ({ value, name: name?.replace("校区", "") })),
      };
    }
    const [,instrumentListRes] = instrumentList;
    if (instrumentListRes?.resultData) {
      result.instrumentListData = (instrumentListRes?.resultData || [])
        .map(({ name, sl, zd, je }) => {
          return { name, numberOfDevices: sl, money: je, numberOfTerminals: zd };
        });
    }
    return result;
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
  const { state: facultiesQueryStats, execute: executeFacultiesQueryStats } = useAsyncState(
    async (collegeName?: string) => {
      const [err, res] = await to(fetchAssetsCollege(collegeName));
      if (err || !res?.resultData) {
        return [];
      }
      return (res.resultData || [])
        .map(({ campus, sl, je }) => {
          return { name: campus.replace("校区", ""), number: sl, amount: je };
        });
    },
    [],
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

  const { state, execute } = useAsyncState(
    async () => {
      const result: IInstrumentCampusResult = {
        totalStatisticsData: { number: 0, amount: 0 },
        useDirectionsData: [],
        buildDistributionData: [],
      };
      if (campusId.value === CampusId.Overview) return result;
      const [
        totalStatistics,
        useDirections,
        buildDistribution,
      ] = await Promise.all([
        to(fetchAssetsTotal(campusId.value)),
        to(fetchAssetsUseDirection(campusId.value)),
        to(fetchAssetsBuilding(campusId.value)),
      ]);

      const [,totalStatisticsRes] = totalStatistics;
      if (totalStatisticsRes?.resultData) {
        const { sl = 0, je = 0 } = totalStatisticsRes.resultData;
        result.totalStatisticsData = { number: sl, amount: je };
      }
      const [,useDirectionsRes] = useDirections;
      if (useDirectionsRes?.resultData) {
        result.useDirectionsData = useDirectionsRes.resultData;
      }
      const [,buildDistributionRes] = buildDistribution;
      if (buildDistributionRes?.resultData) {
        result.buildDistributionData = (buildDistributionRes.resultData || [])
          .map(({ mc, sl, je, zd }) => {
            return { name: mc, numberOfDevices: sl, money: je, numberOfTerminals: zd };
          })
          .sort((a, b) => b.numberOfDevices - a.numberOfDevices);
      }

      return result;
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

  const { state, execute } = useAsyncState(
    async (buildName: string, buildId: string) => {
      const [err, res] = await to(fetchBuildingDetail(buildName, buildId));
      if (err) return {} as IFetchBuildingDetailResult;
      return (res?.resultData || {}) as IFetchBuildingDetailResult;
    },
    {} as IFetchBuildingDetailResult,
    { resetOnExecute: false, immediate: false },
  );

  // 使用方向
  const useDirectionsData = computed(() => {
    return state.value?.syfx || [];
  });

  // 设备分布
  const deviceDistributionData = computed(() => {
    return state.value?.sbfb || [];
  });

  // 终端设备详情
  const {
    state: terminalDeviceDetailData,
    execute: executeTerminalDeviceDetailData,
  } = useAsyncState(
    async (buildName: string, buildId: string) => {
      const [err, res] = await to(fetchBuildingTerminalDetail(buildId, campusId.value, buildId));
      if (err) return [];
      return res?.resultData || [];
    },
    [],
    { resetOnExecute: false, immediate: false },
  );

  // 设备分布详情
  const {
    state: deviceDistributionDetailData,
    execute: executeDeviceDistributionDetailData,
  } = useAsyncState(
    async (buildName: string, buildId: string) => {
      const [err, res] = await to(fetchBuildingDeviceDistribution(buildId, campusId.value, buildId));
      if (err) return [];
      return res?.resultData || [];
    },
    [],
    { resetOnExecute: false, immediate: false },
  );

  // 大型仪器数
  const largeInstrumentData = computed(() => {
    const { sl = 0, zd = 0, je = 0 } = state.value?.dxyqsl || {};
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
