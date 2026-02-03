import to from "await-to-js";
import dayjs from "dayjs";
import {
  fetchApAndUserAndTerminal,
  fetchDeviceCount,
  fetchHealthCount,
  fetchSsidCount,
  fetchTopCount,
  fetchUserAndTerminalAndTraffic,
} from "@/api/network";
import { useCampusStore } from "@/stores/campus.ts";

export default function usePanelCountData() {
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

  const {
    state: apAndUserAndTerminalState,
    execute: apAndUserAndTerminalExecute,
  } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchApAndUserAndTerminal(campusId.value));
      if (err) return { APData: [], userAndTerminalData: [] };
      const result = res?.resultData || [];

      return {
        APData: result.map(item => ({ name: item.name, value: item.apnum })),
        userAndTerminalData: result.map(item => ({ name: item.name, value1: item.acnum, value2: item.userac })),
      };
    },
    { APData: [], userAndTerminalData: [] },
    { resetOnExecute: false },
  );

  const { APData, userAndTerminalData } = toRefs(toReactive(apAndUserAndTerminalState));

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
  const trafficDataType = ref<"1" | "2">("1");
  const {
    state: userOrTerminalState,
    execute: userExecute,
  } = useAsyncState(async () => {
    const [err, res] = await to(fetchUserAndTerminalAndTraffic(userOrTerminalStateType.value));
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
    state: trafficData,
    execute: terminalAndTrafficExecute,
  } = useAsyncState(async () => {
    const [err, res] = await to(fetchUserAndTerminalAndTraffic(trafficDataType.value));
    if (err) return [];
    return (res?.resultData || [])
      .map(({ datetime, hours, sumtx, sumrx }) => {
        return {
          name: trafficDataType.value === "1" ? dayjs(datetime).format("M/D") : `${Number(hours)}时`,
          value1: sumrx,
          value2: sumtx,
        };
      });
  }, [], { resetOnExecute: false });

  watch(userOrTerminalStateType, () => userExecute());
  watch(trafficDataType, () => terminalAndTrafficExecute());

  // watch(
  //   () => campusId.value,
  //   () => {
  //     topCountExecute();
  //     apAndUserAndTerminalExecute();
  //     deviceCountExecute();
  //     healthCountExecute();
  //     ssidCountExecute();
  //   },
  // );

  return {
    topCountState,
    APData,
    userAndTerminalData,
    deviceCountState,
    healthCountState,
    ssidCountState,
    userOrTerminalStateType,
    trafficDataType,
    userOrTerminalState,
    trafficData,
  };
}
