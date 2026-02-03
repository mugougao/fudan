import { useAsyncState } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import {
  fetchTodaySchoolAssets,
  fetchTodaySchoolEnergy,
  fetchTodaySchoolInCount,
  fetchTodaySchoolTraffic,
} from "@/api/overviw/index";
import { CampusId } from "@/enums";

export function usePanelData() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview);

  const {
    state: guardPost,
    execute: fetchGuardPost,
  } = useAsyncState(
    async () => {
      const [
        [,res1],
        [,res2],
      ] = await Promise.all([
        to(fetchTodaySchoolInCount(campusId.value)),
        to(fetchTodaySchoolTraffic(campusId.value)),
      ]);
      const count = res1?.resultData?.count || 0;
      const traffic = res2?.resultData || [];
      return { count, traffic };
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
      const [,res] = await to(fetchTodaySchoolAssets(campusId.value));
      const { jz = 0, sl = 0, je = 0 } = res?.resultData || { jz: 0, sl: 0, je: 0 };
      return [sl, je, jz];
    },
    [0, 0, 0],
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: energy,
    execute: fetchEnergy,
  } = useAsyncState(
    async () => {
      const [,res] = await to(fetchTodaySchoolEnergy(campusId.value));
      const { yearelectmom = 0, oldyearwater = 0, oldyearelect = 0, yearwater = 0, yearelect = 0, yearwatermom = 0 } = res?.resultData || {};

      return {
        water: {
          yearOverYear: yearwatermom,
          year: yearwater,
          lastYear: oldyearwater,
        },
        electricity: {
          yearOverYear: yearelectmom,
          year: yearelect,
          lastYear: oldyearelect,
        },
      };
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
