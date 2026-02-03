import to from "await-to-js";
import dayjs from "dayjs";
import { fetchDeviceCount, fetchHealthCount, fetchSsidCount, fetchTopCount } from "@/api/network";
import { fetchUserAndTerminal, fetchUserDistributionTop5 } from "@/api/network/campus.ts";
import { useCampusStore } from "@/stores/campus.ts";

export default function useCampusPanelCountData() {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  const {
    state: topCountState,
    execute: topCountExecute,
  } = useAsyncState(async () => {
    const [err, res] = await to(fetchTopCount(campusId.value));
    if (err) return {};
    return res?.resultData || {};
  }, {}, { resetOnExecute: false });

  const { state: deviceCountState, execute: deviceCountExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchDeviceCount(campusId.value));
      if (err) return [];
      return (res?.resultData || []).sort((a, b) => b.value - a.value);
    },
    [],
    { resetOnExecute: false },
  );

  const { state: healthCountState, execute: healthCountExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchHealthCount(campusId.value));
      if (err) return [];
      return res?.resultData || [];
    },
    [],
    { resetOnExecute: false },
  );

  const { state: ssidCountState, execute: ssidCountExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchSsidCount(campusId.value));
      if (err) {
        return { rate5G: 0, data: [] };
      }
      const { is5G = 0, ssid = [] } = res?.resultData || {};
      return {
        rate5G: is5G,
        data: ssid,
      };
    },
    { rate5G: 0, data: [] },
    { resetOnExecute: false },
  );

  const userOrTerminalStateType = ref<"1" | "2">("1");
  const {
    state: userOrTerminalState,
    execute: userExecute,
  } = useAsyncState(async () => {
    const [err, res] = await to(fetchUserAndTerminal(campusId.value, userOrTerminalStateType.value));
    if (err) return [];
    return (res?.resultData || [])
      .map(({ datetime, hours, countac, userac }) => {
        return {
          name: userOrTerminalStateType.value === "1" ? dayjs(datetime).format("M/D") : `${Number(hours)}时`,
          value1: userac,
          value2: countac,
        };
      });
  }, [], { resetOnExecute: false });

  const {
    state: userDistributionTop5State,
    execute: userDistributionTop5Execute,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchUserDistributionTop5(campusId.value));
      if (err) return [];
      return (res?.resultData || [])
        .map(({ name, yhs, zds, ...rest }) => ({ name, value1: yhs, value2: zds, ...rest }))
        ?.sort((a, b) => a.value1 - b.value1);
    },
    [],
    { resetOnExecute: false },
  );

  watch(userOrTerminalStateType, () => userExecute());

  watch(
    () => campusId.value,
    () => {
      topCountExecute();
      deviceCountExecute();
      healthCountExecute();
      ssidCountExecute();
      userExecute();
      userDistributionTop5Execute();
    },
  );

  return {
    topCountState,
    deviceCountState,
    healthCountState,
    ssidCountState,
    userOrTerminalStateType,
    userOrTerminalState,
    userDistributionTop5State,
  };
}
