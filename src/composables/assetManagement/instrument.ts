import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchBuildingDetail,
  fetchCampusAssets,
  type IFetchBuildingDetailResult,
  type IFetchCampusAssetsResult,
  type IFetchCampusAssetsTotalResult,
} from "@/api/assetManagement/instrument.ts";
import { fetchCampusAssetsTotal } from "@/api/assetManagement/instrument.ts";
import { CampusId } from "@/enums";

// 大型仪器校区总览
export function useCampusAssetsTotal() {
  const { state } = useAsyncState<IFetchCampusAssetsTotalResult>(async () => {
    const [err, res] = await to(fetchCampusAssetsTotal());
    if (err) return {} as IFetchCampusAssetsTotalResult;
    return res?.resultData || {} as IFetchCampusAssetsTotalResult;
  }, {} as IFetchCampusAssetsTotalResult, { resetOnExecute: false });

  // 总设备数 总金额数
  const totalStatisticsData = computed(() => {
    const { zsbs = 0, zjes = 0 } = state.value || {};
    return { number: zsbs, amount: zjes };
  });

  // 主要使用方向
  const useDirectionsData = computed(() => state.value.zysyfx || []);

  // 四校区大型仪器分布
  const instrumentDistributionData = computed(() => {
    const { xqzcfb = [], xqslfb = [] } = state.value;

    return {
      // 设备数量
      devicesNumber: xqslfb,
      // 金额
      amount: xqzcfb,
    };
  });

  // 上一年度机时达标数 + 已安装终端仪器数量
  const equipmentTerminalStatisticsData = computed(() => {
    const {
      dbzs = 0,
      xqdbfb = [],
      zdzs = 0,
      xqzdfb = [],

    } = state.value || {};
    return {
      // 上一年度
      lastYear: { count: dbzs, data: xqdbfb },
      // 已安装终端仪器数量
      installedTerminal: { count: zdzs, data: xqzdfb },
    };
  });

  // 院系大型仪器列表
  const instrumentListData = computed(() => {
    const { yxdxyqlb = [] } = state.value || {};
    return yxdxyqlb;
  });

  // 院系查询
  const facultiesQueryData = computed(() => {
    const { xqzcfb = [], xqslfb = [] } = state.value;

    const result = (xqslfb || []).reduce((prev, curr) => {
      const { name, value } = curr;
      prev[name] = { name, number: value, amount: 0 };
      return prev;
    }, {} as Record<string, { name: string; number: number; amount: number }>);

    (xqzcfb || []).forEach((item) => {
      const { name, value } = item;
      if (result[name]) {
        result[name].amount = value;
      }
    });
    return Object.values(result);
  });

  return {
    totalStatisticsData,
    useDirectionsData,
    instrumentDistributionData,
    equipmentTerminalStatisticsData,
    instrumentListData,
    facultiesQueryData,
  };
}

// 大型仪器指定校区总览
export function useCampusAssetsDistribution() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
  const { state, execute } = useAsyncState<IFetchCampusAssetsResult>(
    async () => {
      if (campusId.value === CampusId.Overview) return {} as IFetchCampusAssetsResult;
      const [err, res] = await to(fetchCampusAssets(campusId.value));
      if (err) return {} as IFetchCampusAssetsResult;
      return res?.resultData || {} as IFetchCampusAssetsResult;
    },
    {} as IFetchCampusAssetsResult,
    { immediate: false, resetOnExecute: false },
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

  // 总设备数 总金额数
  const totalStatisticsData = computed(() => {
    const { zsbs = 0, zjes = 0 } = state.value || {};
    return { number: zsbs, amount: zjes };
  });

  // 使用方向
  const useDirectionsData = computed(() => state.value.zysyfx || []);

  // 楼宇分布
  const buildDistributionData = computed(() => state.value.yxdxyqlb || []);

  // 上一年度机时达标数
  const numberOfAnnualTargetsData = computed(() => {
    const { xqdbzs = { num: 0, dbl: 0 } } = state.value || {};
    return {
      numberOfTargets: xqdbzs.num,
      attainmentRate: xqdbzs.dbl,
    };
  });

  return {
    totalStatisticsData,
    useDirectionsData,
    buildDistributionData,
    numberOfAnnualTargetsData,
  };
}

// 撒点状态标识
export const useStatusFlag = createGlobalState(() => {
  const defaultFlag = {
    // 上一年度机时达标数 flag
    numberOfAnnualTargetsFlag: "",
    // 已安装终端仪器数量 flag
    installedTerminalFlag: "",
    // 院系查询
    facultiesQueryFlag: "",
    // 楼宇分布
    buildDistributionFlag: false,
    // 上一年度机时达标数
    nextLevelNumberOfAnnualTargetsFlag: false,
    // 信息查询
    informationQueryFlag: false,
  };

  // 用于 修改 flag 中的异步操作
  const isLoading = ref(false);

  function waitForLoadingEnd(): Promise<void> {
    return new Promise((resolve) => {
      if (!isLoading.value) {
        resolve();
        return;
      }

      const stop = watch(isLoading, (newVal) => {
        if (!newVal) {
          stop();
          resolve();
        }
      });
    });
  }

  const flag = reactive(cloneDeep(defaultFlag));

  const {
    numberOfAnnualTargetsFlag,
    installedTerminalFlag,
    facultiesQueryFlag,
    buildDistributionFlag,
    nextLevelNumberOfAnnualTargetsFlag,
    informationQueryFlag,
  } = toRefs(flag);

  function resetOtherFlag(filterFixed: keyof typeof flag) {
    Object.keys(flag)
      .forEach((key) => {
        if (key !== filterFixed) {
          flag[key] = defaultFlag[key];
        }
      });
  }

  return {
    numberOfAnnualTargetsFlag,
    installedTerminalFlag,
    facultiesQueryFlag,
    buildDistributionFlag,
    nextLevelNumberOfAnnualTargetsFlag,
    informationQueryFlag,

    resetOtherFlag,

    isLoading,
    waitForLoadingEnd,
  };
});

// 楼栋详情
export function useBuildingDetail() {
  const { state, execute } = useAsyncState(
    async (buildName: string) => {
      const [err, res] = await to(fetchBuildingDetail(buildName));
      if (err) return {} as IFetchBuildingDetailResult;
      return (res?.resultData || {}) as IFetchBuildingDetailResult;
    },
    {} as IFetchBuildingDetailResult,
    { resetOnExecute: false, immediate: false },
  );

  const run = (buildName: string) => execute(0, buildName);

  // 大型仪器数
  const largeInstrumentData = computed(() => {
    const { zdazzs = 0, zsbs = 0, zjes = 0 } = state.value;
    return { zdazzs, zsbs, zjes };
  });

  // 使用方向
  const useDirectionsData = computed(() => {
    const { zysyfx = [] } = state.value;
    return zysyfx;
  });

  // 设备分布
  const deviceDistributionData = computed(() => {
    const { xq = [] } = state.value;
    return xq;
  });

  // 终端设备详情
  const terminalDeviceDetailData = computed(() => {
    const { zdsbfbx = [] } = state.value;
    return zdsbfbx;
  });

  // 设备分布详情
  const deviceDistributionDetailData = computed(() => {
    const { xq = [] } = state.value;
    return xq;
  });

  return {
    run,
    largeInstrumentData,
    useDirectionsData,
    deviceDistributionData,
    terminalDeviceDetailData,
    deviceDistributionDetailData,
  };
}
