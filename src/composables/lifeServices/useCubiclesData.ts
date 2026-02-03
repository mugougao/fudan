import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import {
  fetchRoomElectricity,
  getCivilizedDormitory,
  getRoom,
} from "@/api/lifeServices";

export function useCubiclesData() {
  //  房间ID
  const roomId = useRouteQuery("roomId", "") as unknown as Ref<string>;
  // 宿舍区域ID
  const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

  // 房间面板-查询面板分析数据
  const { state, execute } = useAsyncState(async () => {
    const [err, res] = await to(getRoom(roomId.value));
    if (err) return {};
    return res?.resultData || {};
  }, {}, { resetOnExecute: false });

  // 判断是否为文明寝室
  const { state: isCivilizationBedroom, execute: isCivilizationBedroomExecute } = useAsyncState<any>(async () => {
    const [err, res] = await to(getCivilizedDormitory(roomId.value));
    if (err) return false;
    return res?.resultData || false;
  }, false, { resetOnExecute: false });

  // 房间详情
  const roomInfoData = computed(() => {
    return {
      roomInfo: state.value?.fjxx || {},
      isCivilizationBedroom: isCivilizationBedroom.value,
    };
  });

  // 人员信息
  const personnelInfo = computed<any[]>(() => {
    return state.value?.ryxx || [];
  });

  // 能耗信息
  /* // 年度能耗信息
  const { state: yearElectricity, execute: yearElectricityExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchRoomYearElectricity(roomId.value));
      if (err) return { statistics: { use: 0, purchase: 0 }, list: [] };
      const { ndydl = 0, ndgdje = 0, ydgdyddb = [] } = res?.resultData || {};
      return {
        statistics: {
          // 用电
          use: ndydl,
          // 购电
          purchase: ndgdje,
        },
        list: ydgdyddb.map(({ name, value, value1 }) => ({ name, value1: value, value2: value1 })),
      };
    },
    { statistics: { use: 0, purchase: 0 }, list: [] },
    { resetOnExecute: false },
  );
  // 当月用电信息
  const { state: monthUseElectricity, execute: monthUseElectricityExecute } = useAsyncState(async () => {
    const [err, res] = await to(fetchRoomMonthElectricity(roomId.value));
    if (err) return { count: 0, list: [] };
    const { dyydl = 0, mrydl = [] } = res?.resultData || {};
    return { count: dyydl, list: mrydl };
  }, { count: 0, list: [] }, { resetOnExecute: false });

  // 当月购电信息
  const { state: monthPurchaseElectricity, execute: monthPurchaseElectricityExecute } = useAsyncState(async () => {
    const [err, res] = await to(fetchRoomPurchaseElectricity(roomId.value));
    if (err) return { count: 0, list: [] };
    const { dygdje = 0, mrydl = [] } = res?.resultData || {};
    return { count: dygdje, list: mrydl };
  }, { count: 0, list: [] }, { resetOnExecute: false }); */

  const {
    state: energyInfo,
    execute: energyInfoExecute,
  } = useAsyncState(async () => {
    const [err, res] = await to(fetchRoomElectricity(dormitoryAreaId.value, roomId.value));
    if (err) {
      return {
        yearElectricity: { statistics: { use: 0, purchase: 0 }, list: [] },
        monthUseElectricity: { count: 0, list: [] },
        monthPurchaseElectricity: { count: 0, list: [] },
      };
    }
    const {
      ndgd = 0,
      ndyd = 0,
      dygd = 0,
      dyyd = 0,
      myydhbzz = [],
      mygd = [],
      myyd = [],
    } = res?.resultData || {};

    return {
      yearElectricity: { statistics: { use: ndyd, purchase: ndgd }, list: myyd },
      monthUseElectricity: { count: dyyd, list: myydhbzz },
      monthPurchaseElectricity: { count: dygd, list: mygd },
    };
  }, {
    yearElectricity: { statistics: { use: 0, purchase: 0 }, list: [] },
    monthUseElectricity: { count: 0, list: [] },
    monthPurchaseElectricity: { count: 0, list: [] },
  }, { resetOnExecute: false });

  watch(roomId, () => {
    execute();
    isCivilizationBedroomExecute();
    energyInfoExecute();
  });

  return { roomInfoData, personnelInfo, energyInfo };
}
