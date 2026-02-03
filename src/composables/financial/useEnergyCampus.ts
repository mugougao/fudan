import { to } from "await-to-js";
import { fetchCampusChargingPile, fetchCampusEnergyConsumption, fetchCampusEnergyMonitor } from "@/api/financial/energy.ts";
import { useCampusStore } from "@/stores/campus.ts";

export default function useEnergyCampus() {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  const {
    state: energyConsumptionState,
    execute: energyConsumptionExecute,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusEnergyConsumption(campusId.value));
      if (err) return {};
      return res?.resultData || {};
    },
    {},
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: chargingPileState,
    execute: chargingPileExecute,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusChargingPile(campusId.value));
      if (err) return {};
      return res?.resultData || {};
    },
    {},
    { immediate: true, resetOnExecute: false },
  );

  const energyMonitorTiemType = ref<"day" | "month">("day");
  const {
    state: energyMonitorState,
    execute: energyMonitorExecute,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusEnergyMonitor(campusId.value, energyMonitorTiemType.value));
      if (err) return [];
      return res?.resultData || [];
    },
    [],
    { immediate: true, resetOnExecute: false },
  );

  watch(energyMonitorTiemType, () => energyMonitorExecute());

  watch(
    () => campusId.value,
    () => {
      energyConsumptionExecute();
      chargingPileExecute();
      energyMonitorExecute();
    },
  );

  return {
    energyConsumptionState,
    chargingPileState,
    energyMonitorState,
    energyMonitorTiemType,
  };
}
