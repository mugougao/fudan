import type { MaybeRefOrGetter, Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import {
  fetchCampusAssets,
  fetchCampusAssetsBuildAssets,
  fetchCampusAssetsBuildAssetsType,
  fetchCampusAssetsBuildAssetsYear,
  fetchCampusAssetsBuildInfo,
  fetchCampusAssetsDistribution,
  fetchCampusAssetsExpireDistribution,
  fetchCampusAssetsLargeInstrumentDistribution,
  fetchCampusAssetsType,
} from "@/api/assetManagement/campusAssets.ts";
import { CampusId } from "@/enums";
import { useState } from "@/hooks";

// 校园资产 - 资产管理 - 两侧面板数据
export function useCampusAssets() {
  // 校区 ID
  const campusId = useRouteQuery("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

  const { state: totalState, execute: totalExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusAssets(campusId.value));
      if (err) return { totalNumber: 0, totalAmount: 0 };
      const { sl = 0, je = 0 } = res?.resultData || {};
      return { totalNumber: sl, totalAmount: je };
    },
    { totalNumber: 0, totalAmount: 0 },
    { resetOnExecute: false },
  );

  const { state: typeState, execute: typeExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusAssetsType(campusId.value));
      if (err) return {} as Record<"设备" | "家具" | "软件", [number, number]>;
      return (res?.resultData || [])
        .reduce((prev, item) => ({
          ...prev,
          [item.name]: [item.sl, item.je],
        }), {} as Record<"设备" | "家具" | "软件", [number, number]>);
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
      const [err, res] = await to(fetchCampusAssetsDistribution());
      if (err) return [];
      return (res?.resultData || []).map(({ name, sl, je }) => ({ name, value: sl, value2: je }));
    },
    [],
    { resetOnExecute: false },
  );

  const [expireAssetsType, setExpireAssetsType] = useState<0 | 1>(0);
  // 资产到期分布
  const { state: expireAssetsState, execute: expireAssetsExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusAssetsExpireDistribution(campusId.value, expireAssetsType.value));
      if (err) return [];
      return (res?.resultData || []).map(({ time, sl, je }) => ({ name: time, value1: sl, value2: je }));
    },
    [],
    { resetOnExecute: false },
  );

  // 大型仪器分布
  const { state: largeInstrumentState, execute: largeInstrumentExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusAssetsLargeInstrumentDistribution(campusId.value));
      if (err) return [];
      return (res?.resultData || []);
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
    const [err, res] = await to(fetchCampusAssetsBuildInfo(toValue(buildId)));
    if (err) return {};
    return res?.resultData || {};
  }, {}, { immediate: false, resetOnExecute: false });

  const { state: assetsInfo, execute: assetsInfoExecute } = useAsyncState(async () => {
    const [err, res] = await to(fetchCampusAssetsBuildAssets(toValue(buildId)));
    if (err) return {};
    return res?.resultData || {};
  }, {}, { immediate: false, resetOnExecute: false });

  const { state: assetsTypeInfo, execute: assetsTypeInfoExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusAssetsBuildAssetsType(toValue(buildId)));
      if (err) {
        return { number: [], amount: [] };
      }
      const number: { name: string;value: number }[] = [];
      const amount: { name: string;value: number }[] = [];
      (res?.resultData || []).forEach(({ name, value1, value2 }) => {
        number.push({ name, value: value1 });
        amount.push({ name, value: value2 });
      });
      return { number, amount };
    },
    { number: [], amount: [] },
    { immediate: false, resetOnExecute: false },
  );

  const [expireAssetsType, setExpireAssetsType] = useState<0 | 1>(0);
  const { state: assetsYearInfo, execute: assetsYearInfoExecute } = useAsyncState(async () => {
    const [err, res] = await to(fetchCampusAssetsBuildAssetsYear(toValue(buildId), expireAssetsType.value));
    if (err) return [];
    return (res?.resultData || []).map(({ time, sl, je }) => ({ name: time, value1: sl, value2: je }));
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
