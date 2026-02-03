import type { MaybeRefOrGetter } from "@vueuse/core";
import type { CampusId } from "@/enums";
import { useAsyncState } from "@vueuse/core";
import to from "await-to-js";
import { fetchCampusEnergyConsumption } from "@/api/financial/energy.ts";
import { fetchCampusAssetsType, fetchOverview } from "@/api/financial/index.ts";
import { useCampusStore } from "@/stores/campus.ts";

async function useAssetProps(campusId: CampusId) {
  const result = await Promise.all([
    (async () => {
      const [,res] = await to(fetchOverview(campusId));
      const { jz = 0, sl = 0, je = 0 } = res?.resultData || {};
      return [je, jz, sl];
    })(),
    (async () => {
      const [,res] = await to(fetchCampusAssetsType(campusId));
      const typeToKey = { 家具用具装具: "furniture", 仪器设备: "device", 软件: "software" };
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
    (() => {
      return [0, 0];
    })(),
  ]);
  const [totalCount, typeCount, chargeData] = result;
  return { totalCount, typeCount, chargeData };
}

async function useElectProps(campusId: CampusId) {
  const [overviewData] = await Promise.all([
    (async () => {
      const [err, res] = await to(fetchCampusEnergyConsumption(campusId));
      if (err) return {};
      return res?.resultData || {};
    })(),
  ]);

  return { overviewData };
}

async function useWaterProps(campusId: CampusId) {
  const [overviewData] = await Promise.all([
    (async () => {
      const [err, res] = await to(fetchCampusEnergyConsumption(campusId));
      if (err) return {};
      return res?.resultData || {};
    })(),
  ]);

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
      const [[,res1], [,res2]] = await Promise.all([
        to(fetchOverview(campusId.value)),
        to(fetchCampusEnergyConsumption(campusId.value)),
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
