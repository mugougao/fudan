import type { MaybeRefOrGetter } from "@vueuse/core";
import { useAsyncState } from "@vueuse/core";
import { to } from "await-to-js";
import { groupBy } from "lodash";
import { fetchChargingPileAreaDayMonthStatistics, fetchChargingPileAreaYearStatistics, fetchChargingPileChargeDayMonthStatistics, fetchChargingPileChargeYearStatistics, fetchChargingPileList } from "@/api/financial/energy.ts";

export default function useChargingPilesDetail(
  ararId: MaybeRefOrGetter<string | undefined>,
  id: MaybeRefOrGetter<string | undefined>,
  areaTimeType: MaybeRefOrGetter<"day" | "month">,
  timeType: MaybeRefOrGetter<"day" | "month">,
) {
  // 区域年度 充电量 / 金额
  const {
    state: chargingPileAreaYearStatisticsState,
    execute: chargingPileAreaYearStatisticsExecute,
  } = useAsyncState(
    async () => {
      const _ararId = toValue(ararId);
      if (!_ararId) return { value: 0, amount: 0 };
      const [err, res] = await to(fetchChargingPileAreaYearStatistics(_ararId));
      if (err) return { value: 0, amount: 0 };
      const { value = 0, amount = 0 } = res?.resultData?.[0] || { value: 0, amount: 0 };
      return { value, amount };
    },
    { value: 0, amount: 0 },
    { immediate: false, resetOnExecute: false },
  );

  // 区域日/月 充电量 / 金额
  const {
    state: chargingPileAreaDayMonthStatisticsState,
    execute: chargingPileAreaDayMonthStatisticsExecute,
  } = useAsyncState(
    async () => {
      const _ararId = toValue(ararId);
      if (!_ararId) return [];
      const [err, res] = await to(fetchChargingPileAreaDayMonthStatistics(_ararId, toValue(areaTimeType)));
      if (err) return [];
      return (res?.resultData || []).map(({ update_time, value, amount }) => {
        return { name: update_time, value1: value, value2: amount };
      });
    },
    [],
    { immediate: false, resetOnExecute: false },
  );

  // 充电桩列表
  const {
    state: chargingPileListState,
    execute: chargingPileListExecute,
  } = useAsyncState<[
    { id: string; name: string }[],
    { id: string; name: string }[],
    { id: string; name: string }[],
    { id: string; name: string }[],
  ]>(
    async () => {
      const _ararId = toValue(ararId);
      if (!_ararId) return [[], [], [], []];
      const [err, res] = await to(fetchChargingPileList(_ararId));
      if (err) return [[], [], [], []];
      const { left = [], right = [] } = groupBy(
        (res?.resultData || [])
          .sort(({ name: a }, { name: b }) => Number.parseInt(a.match(/\d+/)?.[0] || "0") - Number.parseInt(b.match(/\d+/)?.[0] || "0"))
          .map(({ dwid, name }) => ({ id: dwid, name })),
        ({ name }) => name.endsWith("右#") ? "right" : "left",
      );
      const leftCenterIndex = Math.ceil(left.length / 2);
      const rightCenterIndex = Math.ceil(right.length / 2);
      return [
        left.slice(0, leftCenterIndex),
        right.slice(0, rightCenterIndex),
        left.slice(leftCenterIndex),
        right.slice(rightCenterIndex),
      ];
    },
    [[], [], [], []],
    { immediate: false, resetOnExecute: false },
  );

  watch(
    () => toValue(ararId),
    () => {
      chargingPileAreaYearStatisticsExecute();
      chargingPileAreaDayMonthStatisticsExecute();
      chargingPileListExecute();
    },
  );

  watch(
    () => toValue(areaTimeType),
    () => {
      chargingPileAreaDayMonthStatisticsExecute();
    },
  );

  // 充电桩年度 充电量 / 金额
  const {
    state: chargingPileChargeYearStatisticsState,
    execute: chargingPileChargeYearStatisticsExecute,
  } = useAsyncState(
    async () => {
      const _id = toValue(id);
      if (!_id) return { value: 0, amount: 0 };
      const [err, res] = await to(fetchChargingPileChargeYearStatistics(_id));
      if (err) return { value: 0, amount: 0 };
      const { value = 0, amount = 0 } = res?.resultData?.[0] || { value: 0, amount: 0 };
      return { value, amount };
    },
    { value: 0, amount: 0 },
    { immediate: false, resetOnExecute: false },
  );

  // 充电桩日/月 充电量 / 金额
  const {
    state: chargingPileChargeDayMonthStatisticsState,
    execute: chargingPileChargeDayMonthStatisticsExecute,
  } = useAsyncState(
    async () => {
      const _id = toValue(id);
      if (!_id) return [];
      const [err, res] = await to(fetchChargingPileChargeDayMonthStatistics(_id, toValue(timeType)));
      if (err) return [];
      return (res?.resultData || []).map(({ update_time, value, amount }) => {
        return { name: update_time, value1: value, value2: amount };
      });
    },
    [],
    { immediate: false, resetOnExecute: false },
  );

  watch(
    () => toValue(id),
    () => {
      chargingPileChargeYearStatisticsExecute();
      chargingPileChargeDayMonthStatisticsExecute();
    },
  );

  watch(
    () => toValue(timeType),
    () => {
      chargingPileChargeDayMonthStatisticsExecute();
    },
  );

  return {
    chargingPileAreaYearStatisticsState,
    chargingPileAreaDayMonthStatisticsState,
    chargingPileChargeYearStatisticsState,
    chargingPileChargeDayMonthStatisticsState,
    chargingPileListState,
  };
}
