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

  // 默认房间数据
  const defaultRoomData = {
    fjxx: {
      ssmc: "北区",
      lymc: "45#宿舍楼",
      lcmc: "3层",
      fjh: "301",
      fjlb: "四人间",
      fjxb: "男生",
    },
    ryxx: [
      { name: "张三", xh: "21307110001", xy: "计算机科学技术学院", xb: "男", nj: "2021级" },
      { name: "李四", xh: "21307110002", xy: "计算机科学技术学院", xb: "男", nj: "2021级" },
      { name: "王五", xh: "21307110003", xy: "数学科学学院", xb: "男", nj: "2021级" },
      { name: "赵六", xh: "21307110004", xy: "物理学系", xb: "男", nj: "2021级" },
    ],
  };

  // 房间面板-查询面板分析数据
  const { state, execute } = useAsyncState(async () => {
    console.log("🏠 [户型数据] 🚫 API调用已注释，使用默认房间数据");
    
    // 🚫 注释掉API调用，直接返回默认数据
    return defaultRoomData;

    /* // 原API调用逻辑已注释
    const [err, res] = await to(getRoom(roomId.value));
    if (err) return {};
    return res?.resultData || {};
    */
  }, defaultRoomData, { resetOnExecute: false });

  // 判断是否为文明寝室
  const { state: isCivilizationBedroom, execute: isCivilizationBedroomExecute } = useAsyncState<any>(async () => {
    console.log("🏅 [户型数据] 🚫 API调用已注释，默认为文明寝室");
    
    // 🚫 注释掉API调用，直接返回 true
    return true;

    /* // 原API调用逻辑已注释
    const [err, res] = await to(getCivilizedDormitory(roomId.value));
    if (err) return false;
    return res?.resultData || false;
    */
  }, true, { resetOnExecute: false });

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

  // 默认能耗数据
  const defaultEnergyInfo = {
    yearElectricity: {
      statistics: { use: 1580.5, purchase: 1600.0 },
      list: [
        { name: "1月", value: 135.2 },
        { name: "2月", value: 128.6 },
        { name: "3月", value: 142.8 },
        { name: "4月", value: 125.4 },
        { name: "5月", value: 118.9 },
        { name: "6月", value: 138.7 },
        { name: "7月", value: 155.3 },
        { name: "8月", value: 148.2 },
        { name: "9月", value: 132.5 },
        { name: "10月", value: 126.8 },
        { name: "11月", value: 144.6 },
        { name: "12月", value: 154.5 },
      ],
    },
    monthUseElectricity: {
      count: 125.4,
      list: [
        { name: "1日", value: 3.8 },
        { name: "2日", value: 4.2 },
        { name: "3日", value: 3.5 },
        { name: "4日", value: 4.6 },
        { name: "5日", value: 3.9 },
        { name: "6日", value: 4.1 },
        { name: "7日", value: 3.7 },
        { name: "8日", value: 4.3 },
        { name: "9日", value: 4.0 },
        { name: "10日", value: 3.8 },
      ],
    },
    monthPurchaseElectricity: {
      count: 130.0,
      list: [
        { name: "1日", value: 50.0 },
        { name: "8日", value: 30.0 },
        { name: "15日", value: 50.0 },
      ],
    },
  };

  const {
    state: energyInfo,
    execute: energyInfoExecute,
  } = useAsyncState(async () => {
    console.log("⚡ [户型数据] 🚫 API调用已注释，使用默认能耗数据");
    
    // 🚫 注释掉API调用，直接返回默认数据
    return defaultEnergyInfo;

    /* // 原API调用逻辑已注释
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
    */
  }, defaultEnergyInfo, { resetOnExecute: false });

  // 🚫 注释掉watch自动刷新逻辑
  /* 
  watch(roomId, () => {
    execute();
    isCivilizationBedroomExecute();
    energyInfoExecute();
  });
  */

  return { roomInfoData, personnelInfo, energyInfo };
}
