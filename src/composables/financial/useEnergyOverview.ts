import { to } from "await-to-js";
import { fetchCampusChargingPile, fetchCampusEnergyConsumption, fetchCampusWaterElectricity, fetchCampusWaterElectricityTop5 } from "@/api/financial/energy.ts";

export default function useEnergyOverview() {
  const {
    state: energyConsumptionState,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusEnergyConsumption());
      if (err) return {};
      return res?.resultData || {};
    },
    {},
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: chargingPileState,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchCampusChargingPile());
      if (err) return {};
      return res?.resultData || {};
    },
    {},
    { immediate: true, resetOnExecute: false },
  );

  const waterElectricityStateType = ref<"electricity" | "water">("electricity");

  const { state: waterElectricityState, execute: executeWaterElectricityState } = useAsyncState(
    async () => {
      const [[,res1], [,res2]] = await Promise.all([
        to(fetchCampusWaterElectricityTop5(waterElectricityStateType.value)),
        to(fetchCampusWaterElectricity()),
      ]);

      return {
        top5: (res1?.resultData || []).sort((a, b) => a.value - b.value),
        year: (res2?.resultData || []).map(({ name, water, elect, wateramount, electamount }) => ({
          name,
          value1: waterElectricityStateType.value === "electricity" ? elect : water,
          value2: waterElectricityStateType.value === "electricity" ? electamount : wateramount,
        })),
      };
    },
    { year: [], top5: [] },
    { immediate: true, resetOnExecute: false },
  );

  watch(waterElectricityStateType, () => executeWaterElectricityState());

  return {
    energyConsumptionState,
    chargingPileState,

    waterElectricityStateType,
    waterElectricityState,
  };
}
