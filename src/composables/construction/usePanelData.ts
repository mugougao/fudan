import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchRepairList, fetchRepairPanelData } from "@/api/construction/repair";
import { CampusId } from "@/enums";

export function usePanelData() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview);

  const { state: panelData, execute: fetchPanelData } = useAsyncState(
    async () => {
      const [,res] = await to(fetchRepairPanelData(campusId.value));
      const { zzxs = 0, xszs = 0, lxfb = [], xqfb = [] } = (res?.resultData || {});
      return {
        repairCount: xszs,
        repairingCount: zzxs,
        campusRepairCount: xqfb,
        statusCount: lxfb,
      };
    },
    {
      repairCount: 0,
      repairingCount: 0,
      campusRepairCount: [],
      statusCount: [],
    },
    { immediate: true, resetOnExecute: false },
  );

  watch(campusId, () => {
    fetchPanelData();
  });

  return toRefs(toReactive(panelData));
}

export function usePanelCampusData() {
  const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview);

  const { repairCount, repairingCount, campusRepairCount, statusCount } = usePanelData();

  const {
    state: repairList,
    execute: executeRepairList,
  } = useAsyncState(
    async () => {
      const [,res] = await to(fetchRepairList(campusId.value));
      return res?.resultData || [];
    },
    [] as any[],
    { immediate: true, resetOnExecute: false },
  );

  watch(campusId, () => {
    executeRepairList();
  });

  return {
    repairCount,
    repairingCount,
    campusRepairCount,
    statusCount,
    repairList,
  };
}
