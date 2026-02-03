import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import round from "lodash/round";
import {
  getBuildingOverview,
  getBuildingOverviewYh,
  getDormitoryBuildElectricity,
  getFocusStudentEarlyWarn,
  getSupervisor,
} from "@/api/lifeServices";

export function useBuildingData() {
  // 宿舍区 ID
  const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;
  const dormitoryAreaName = useRouteQuery("dormitoryAreaName", "") as unknown as Ref<string>;
  // 楼栋 ID
  const buildId = useRouteQuery("buildId") as unknown as Ref<string>;

  let _ywhInfoExecute = () => {};

  const { state: dormitoryState, execute: executeDormitoryState } = useAsyncState(
    async () => {
      const [err, res] = await to(getBuildingOverview(buildId.value));
      if (err) return {};
      return res?.resultData || {};
    },
    {},
    {
      resetOnExecute: false,
      onSuccess: () => {
        _ywhInfoExecute();
      },
    },
  );

  //  园委会 信息
  const { state: ywhInfo, execute: ywhInfoExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(getBuildingOverviewYh(dormitoryAreaName.value, dormitoryState.value.ssxx.lymc));
      if (err) return { count: 0, list: [] };
      const { zs = 0, lb = [] } = res?.resultData || {};
      return { count: zs, list: lb };
    },
    { count: 0, list: [] as any[] },
    {
      immediate: false,
      resetOnExecute: false,
      onSuccess: () => {
        _ywhInfoExecute = () => ywhInfoExecute();
      },
    },
  );

  // 获取督导员人数及信息
  const { state: supervisorState, execute: supervisorExecute } = useAsyncState(async () => {
    const [err, res] = await to(getSupervisor({ id: buildId.value, qyid: dormitoryAreaId.value }));
    if (err) return {};
    return res?.resultData || {};
  }, {}, { resetOnExecute: false });

  // 重点关注学生信息 - 人员预警
  const { state: personnelEarlyWarn, execute: personnelEarlyWarnExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(getFocusStudentEarlyWarn(buildId.value));
      if (err) return { count: 0, list: [] };
      const { yjrs = 0, yjlb = [] } = res?.resultData || {};
      return { count: yjrs, list: yjlb };
    },
    { count: 0, list: [] },
    { resetOnExecute: false },
  );

  // 宿舍信息
  const dormitoryInfo = computed(() => {
    const { ssxx = {} } = dormitoryState.value;
    const { num = 0, list = [] } = supervisorState.value;

    return {
      baseInfo: {
        ...ssxx,
        supervisorCount: num,
        parkCommitteeCount: ywhInfo.value.count,
      },
      supervisorsList: (list || []).map((item, index) => ({ id: index, ...item })),
      parkCommitteeList: ywhInfo.value.list,
    };
  });

  // 人员信息
  const personnelInfo = computed(() => {
    const { ryxx } = dormitoryState.value;
    const { zrs = 0, rzl = 0, dybl = 0, xlfb = [], xbfb = [], yxfb = [] } = ryxx || {};

    const departmentTotal = yxfb?.reduce((acc: number, cur: Record<string, any>) => acc + Number(cur.value), 0);

    return {
      // 统计信息
      statistics: {
        total: zrs,
        occupancyRate: rzl,
        proportionOfPartyMembers: dybl,
      },
      // 学历
      education: xlfb,
      // 性别
      sex: xbfb,
      // 院系
      department: (yxfb || [])
        ?.sort(({ value: a }, { value: b }) => b - a)
        ?.map((item: Record<string, any>, index: number) => {
          const percent = departmentTotal === 0 ? 0 : round((Number(item.value) / departmentTotal) * 100, 2).toFixed(2);
          return { id: index + 1, ...item, percent };
        }),
    };
  });

  // 能耗信息
  const {
    state: energyConsumptionInfo,
    execute: energyConsumptionInfoExecute,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(getDormitoryBuildElectricity(buildId.value));
      if (err) return { statistics: { use: 0, purchase: 0 }, list: [] };
      const { ydtb = [], zrydl = 0, zrgdl = 0 } = res?.resultData || {};

      return {
        statistics: {
          use: zrydl,
          purchase: zrgdl,
        },
        list: ydtb,
      };
    },
    { statistics: { use: 0, purchase: 0 }, list: [] },
  );

  // 重点关注学生信息
  const focusStudentInfo = computed(() => {
    const { tsxx } = dormitoryState.value;
    const { zsscfb = [], yjtssjfb = [] } = tsxx || {};

    return {
      // 累计住宿时长
      lengthStay: zsscfb,
      // 人员预警
      personWarn: personnelEarlyWarn.value,
      // 预计退宿时间
      checkOutTime: yjtssjfb,
    };
  });

  watch(buildId, () => {
    executeDormitoryState();
    supervisorExecute();
    energyConsumptionInfoExecute();
    personnelEarlyWarnExecute();
  });

  return {
    dormitoryInfo,
    personnelInfo,
    focusStudentInfo,
    energyConsumptionInfo,
  };
}
