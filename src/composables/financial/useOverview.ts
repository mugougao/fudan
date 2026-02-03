import type { MaybeRefOrGetter } from "@vueuse/core";
import { useAsyncState } from "@vueuse/core";
import to from "await-to-js";
import { fetchCampusEnergyConsumption } from "@/api/financial/energy.ts";
import { fetchCampusAssetsDistribution, fetchCampusAssetsType, fetchCampusUseWaterWithElectricityCount, fetchOverview } from "@/api/financial/index.ts";

async function useAssetProps() {
  const result = await Promise.all([
    (async () => {
      const [,res] = await to(fetchOverview());
      const { jz = 0, sl = 0, je = 0 } = res?.resultData || {};
      return [je, jz, sl];
    })(),
    (async () => {
      const [,res] = await to(fetchCampusAssetsType());
      const typeToKey = { 家具用具装具: "furniture", 仪器设备: "device", 软件: "software", 动植物: "animal" };
      return res?.resultData.reduce((prev, curr) => {
        const { type, jz = 0, sl = 0, je = 0 } = curr;
        const key = typeToKey[type];
        if (key) prev[key] = [je, jz, sl];
        return prev;
      }, {
        device: [0, 0, 0],
        furniture: [0, 0, 0],
        software: [0, 0, 0],
      } as Record<"device" | "furniture" | "software", [number, number, number]>);
    })(),
    (async () => {
      const [,res] = await to(fetchCampusAssetsDistribution());
      const result = {
        numberData: [] as { name: string; value: number }[],
        moneyData: [] as { name: string; value1: number;value2: number }[],
      };
      (res?.resultData || []).forEach(({ xq, jz = 0, je = 0, sl = 0 }) => {
        result.numberData.push({ name: xq, value: sl });
        result.moneyData.push({ name: xq, value1: je, value2: jz });
      });
      return result;
    })(),
    (() => {
      return [0, 0];
    })(),
  ]);

  const [totalCount, typeCount, { numberData, moneyData }, chargeData] = result;

  return { totalCount, typeCount, chargeData, numberData, moneyData };
}

async function useElectProps() {
  const [overviewData, chartData] = await Promise.all([
    (async () => {
      const [err, res] = await to(fetchCampusEnergyConsumption());
      if (err) return {};
      return res?.resultData || {};
    })(),
    (async () => {
      const [err, res] = await to(fetchCampusUseWaterWithElectricityCount());
      if (err) return [];
      return (res?.resultData || [])
        .map(({ name, elect, electamount }) => {
          return { name, value1: elect, value2: electamount };
        });
    })(),
  ]);

  return { overviewData, chartData };
}

async function useWaterProps() {
  const [overviewData, chartData] = await Promise.all([
    (async () => {
      const [err, res] = await to(fetchCampusEnergyConsumption());
      if (err) return {};
      return res?.resultData || {};
    })(),
    (async () => {
      const [err, res] = await to(fetchCampusUseWaterWithElectricityCount());
      if (err) return [];
      return (res?.resultData || [])
        .map(({ name, water, wateramount }) => {
          return { name, value1: water, value2: wateramount };
        });
    })(),
  ]);

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
      const [[,res1], [,res2]] = await Promise.all([
        to(fetchOverview()),
        to(fetchCampusEnergyConsumption()),
      ]);

      const { jz } = res1?.resultData || {};
      const { yearelectamount = 0, yearwateramount = 0 } = res2?.resultData || {};
      return {
        asset: jz,
        electric: yearelectamount,
        waterUse: yearwateramount,
        property: 0,
        repair: 0,
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
