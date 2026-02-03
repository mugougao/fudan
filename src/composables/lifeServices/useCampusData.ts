import to from "await-to-js";
import {
  getCampus,
  getCampusElectricData,
  getCampusPurchaseData,
  type IGetCampusElectricDataResult,
  type IGetCampusPurchaseDataResult,
} from "@/api/lifeServices";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";

type IDataArr = { name: string; value: number }[];

interface ICountData {
  count: number;
  data: IDataArr;
}

export function useCampusData() {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  // 校区面板数据，大部分数据由这个接口获取（用电数据除外）
  const { state, execute } = useAsyncState(async () => {
    if (campusId.value == CampusId.Overview) return {};
    const [err, res] = await to(getCampus(campusId.value));
    if (err) return {};
    return res?.resultData || {};
  }, {}, { resetOnExecute: false });

  // 购电数据
  const { state: purchaseState, execute: purchaseExecute } = useAsyncState<IGetCampusPurchaseDataResult>(
    async () => {
      if (campusId.value == CampusId.Overview) return {} as IGetCampusPurchaseDataResult;
      const [err, res] = await to(getCampusPurchaseData(campusId.value));
      if (err) return {} as IGetCampusPurchaseDataResult;
      return (res?.resultData || {}) as IGetCampusPurchaseDataResult;
    },
    {} as IGetCampusPurchaseDataResult,
    { resetOnExecute: false },
  );

  // 用电量数据
  const { state: electricityState, execute: electricityExecute } = useAsyncState<IGetCampusElectricDataResult>(
    async () => {
      if (campusId.value == CampusId.Overview) return {} as IGetCampusElectricDataResult;
      const [err, res] = await to(getCampusElectricData(campusId.value));
      if (err) return {} as IGetCampusElectricDataResult;
      return (res?.resultData || {}) as IGetCampusElectricDataResult;
    },
    {} as IGetCampusElectricDataResult,
    { resetOnExecute: false },
  );

  watch(
    () => campusId.value,
    () => {
      execute();
      purchaseExecute();
      electricityExecute();
    },
  );

  // 校园概览 data
  const campusOverviewData = computed(() => {
    // 宿舍楼宇
    const { data: buildList = [], count: buildCount = 0 } = (toValue(state)?.ldtj || {}) as ICountData;
    // 房间
    const { data: roomList = [], count: roomCount = 0 } = (toValue(state)?.fjtj || {}) as ICountData;
    // 床位
    const { data: bedList = [], count: bedCount = 0 } = (toValue(state)?.cwtj || {}) as ICountData;

    return { buildCount, buildList, roomCount, roomList, bedCount, bedList };
  });

  // 人员分布
  const personnelDistributionData = computed(() => {
    const { count = 0, data = [] } = toValue(state)?.ryfb || {};
    return { count, data } as ICountData;
  });

  // 校园能耗 - 用电
  const campusEnergyUseData = computed(() => {
    const {
      yqyd = [],
      ydzs = 0,
      ydtb = [],
      ydhb = [],
    } = toValue(electricityState) as {
      yqyd: IDataArr;
      ydzs: number;
      ydtb: { name: string; value: number; value1: number }[];
      ydhb: { name: string; value: number; value1: number }[];
    };

    return {
      // 区域统计
      regionStatistics: { count: ydzs, data: yqyd },
      // 月度统计
      monthStatistics: ydtb.map(({ name, value, value1 }) => ({ name, value1: value, value2: value1 })),
      // 环比统计
      chainStatistics: ydhb.map(({ name, value, value1 }) => ({ name, value1: value, value2: value1 })),
    };
  });

  // 校园能耗 - 购电
  const campusEnergyPurchaseData = computed(() => {
    const { ndgd = [], jrgd = { count: 0, data: [] }, gdyddb = [] } = purchaseState.value;
    return {
      // 区域统计
      regionStatistics: jrgd,
      // 月度统计
      monthStatistics: ndgd,
      // 环比统计
      chainStatistics: gdyddb,
    };
  });

  return {
    campusOverviewData,
    personnelDistributionData,
    campusEnergyUseData,
    campusEnergyPurchaseData,
  };
}
