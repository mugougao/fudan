import dayjs from "dayjs";

import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";

export default function usePanelCountData() {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  // 模拟数据：网络统计指标（按校区）
  const mockTopCountData: Record<CampusId, any> = {
    [CampusId.Overview]: {
      runningac: 45,
      runningap: 1280,
      offlineap: 32,
      countac: 15600,
      userac: 12400,
      sumrx: 8.2,
      sumtx: 12.5,
    },
    [CampusId.HanDan]: {
      runningac: 18,
      runningap: 520,
      offlineap: 12,
      countac: 6800,
      userac: 5400,
      sumrx: 3.5,
      sumtx: 5.2,
    },
    [CampusId.JiangWan]: {
      runningac: 12,
      runningap: 380,
      offlineap: 8,
      countac: 4200,
      userac: 3400,
      sumrx: 2.1,
      sumtx: 3.4,
    },
    [CampusId.FengLin]: {
      runningac: 8,
      runningap: 220,
      offlineap: 6,
      countac: 2800,
      userac: 2200,
      sumrx: 1.5,
      sumtx: 2.3,
    },
    [CampusId.ZhangJiang]: {
      runningac: 7,
      runningap: 160,
      offlineap: 6,
      countac: 1800,
      userac: 1400,
      sumrx: 1.1,
      sumtx: 1.6,
    },
  };

  // 模拟数据：AP数量分布（按校区）
  const mockAPData: Record<CampusId, { name: string; value: number }[]> = {
    [CampusId.Overview]: [
      { name: "邯郸", value: 1250 },
      { name: "江湾", value: 890 },
      { name: "枫林", value: 530 },
      { name: "张江", value: 390 },
    ],
    [CampusId.HanDan]: [
      { name: "教学楼", value: 280 },
      { name: "图书馆", value: 180 },
      { name: "实验室", value: 320 },
      { name: "行政楼", value: 150 },
      { name: "宿舍楼", value: 420 },
    ],
    [CampusId.JiangWan]: [
      { name: "教学楼", value: 190 },
      { name: "图书馆", value: 120 },
      { name: "实验室", value: 210 },
      { name: "行政楼", value: 90 },
      { name: "宿舍楼", value: 280 },
    ],
    [CampusId.FengLin]: [
      { name: "教学楼", value: 110 },
      { name: "图书馆", value: 70 },
      { name: "实验室", value: 130 },
      { name: "行政楼", value: 60 },
      { name: "宿舍楼", value: 160 },
    ],
    [CampusId.ZhangJiang]: [
      { name: "教学楼", value: 80 },
      { name: "图书馆", value: 50 },
      { name: "实验室", value: 100 },
      { name: "行政楼", value: 40 },
      { name: "宿舍楼", value: 120 },
    ],
  };

  // 模拟数据：在线用户和终端分布（按校区）
  const mockUserAndTerminalData: Record<CampusId, { name: string; value1: number; value2: number }[]> = {
    [CampusId.Overview]: [
      { name: "邯郸", value1: 5400, value2: 6800 },
      { name: "江湾", value1: 3400, value2: 4200 },
      { name: "枫林", value1: 2200, value2: 2800 },
      { name: "张江", value1: 1400, value2: 1800 },
    ],
    [CampusId.HanDan]: [
      { name: "教学楼", value1: 2200, value2: 2800 },
      { name: "图书馆", value1: 1500, value2: 1900 },
      { name: "实验室", value1: 800, value2: 1000 },
      { name: "宿舍楼", value1: 900, value2: 1100 },
    ],
    [CampusId.JiangWan]: [
      { name: "教学楼", value1: 1400, value2: 1800 },
      { name: "图书馆", value1: 900, value2: 1100 },
      { name: "实验室", value1: 600, value2: 800 },
      { name: "宿舍楼", value1: 500, value2: 700 },
    ],
    [CampusId.FengLin]: [
      { name: "教学楼", value1: 900, value2: 1100 },
      { name: "图书馆", value1: 600, value2: 800 },
      { name: "实验室", value1: 400, value2: 500 },
      { name: "宿舍楼", value1: 300, value2: 400 },
    ],
    [CampusId.ZhangJiang]: [
      { name: "教学楼", value1: 600, value2: 800 },
      { name: "图书馆", value1: 400, value2: 500 },
      { name: "实验室", value1: 300, value2: 400 },
      { name: "宿舍楼", value1: 200, value2: 300 },
    ],
  };

  // 模拟数据：设备类型统计
  const mockDeviceCountData: Record<CampusId, { name: string; value: number }[]> = {
    [CampusId.Overview]: [
      { name: "华为", value: 680 },
      { name: "华三", value: 420 },
      { name: "思科", value: 280 },
      { name: "锐捷", value: 180 },
      { name: "其他", value: 120 },
    ],
    [CampusId.HanDan]: [
      { name: "华为", value: 280 },
      { name: "华三", value: 180 },
      { name: "思科", value: 120 },
      { name: "锐捷", value: 80 },
      { name: "其他", value: 50 },
    ],
    [CampusId.JiangWan]: [
      { name: "华为", value: 200 },
      { name: "华三", value: 120 },
      { name: "思科", value: 80 },
      { name: "锐捷", value: 60 },
      { name: "其他", value: 40 },
    ],
    [CampusId.FengLin]: [
      { name: "华为", value: 120 },
      { name: "华三", value: 80 },
      { name: "思科", value: 50 },
      { name: "锐捷", value: 40 },
      { name: "其他", value: 30 },
    ],
    [CampusId.ZhangJiang]: [
      { name: "华为", value: 80 },
      { name: "华三", value: 60 },
      { name: "思科", value: 40 },
      { name: "锐捷", value: 30 },
      { name: "其他", value: 20 },
    ],
  };

  // 模拟数据：健康度分布
  const mockHealthCountData: Record<CampusId, { name: string; value: number }[]> = {
    [CampusId.Overview]: [
      { name: "HIGH", value: 850 },
      { name: "MEDIUM", value: 320 },
      { name: "LOW", value: 110 },
    ],
    [CampusId.HanDan]: [
      { name: "HIGH", value: 350 },
      { name: "MEDIUM", value: 130 },
      { name: "LOW", value: 40 },
    ],
    [CampusId.JiangWan]: [
      { name: "HIGH", value: 250 },
      { name: "MEDIUM", value: 100 },
      { name: "LOW", value: 30 },
    ],
    [CampusId.FengLin]: [
      { name: "HIGH", value: 150 },
      { name: "MEDIUM", value: 60 },
      { name: "LOW", value: 20 },
    ],
    [CampusId.ZhangJiang]: [
      { name: "HIGH", value: 100 },
      { name: "MEDIUM", value: 40 },
      { name: "LOW", value: 20 },
    ],
  };

  // 模拟数据：SSID信道分布
  const mockSSIDCountData: Record<CampusId, { rate5G: number; data: { name: string; value: number }[] }> = {
    [CampusId.Overview]: {
      rate5G: 65,
      data: [
        { name: "Fudan-WiFi-2.4G", value: 420 },
        { name: "Fudan-WiFi-5G", value: 680 },
        { name: "Fudan-Guest", value: 180 },
        { name: "Fudan-Staff", value: 320 },
        { name: "Fudan-Student", value: 580 },
      ],
    },
    [CampusId.HanDan]: {
      rate5G: 68,
      data: [
        { name: "Fudan-WiFi-2.4G", value: 180 },
        { name: "Fudan-WiFi-5G", value: 320 },
        { name: "Fudan-Guest", value: 80 },
        { name: "Fudan-Staff", value: 140 },
        { name: "Fudan-Student", value: 250 },
      ],
    },
    [CampusId.JiangWan]: {
      rate5G: 62,
      data: [
        { name: "Fudan-WiFi-2.4G", value: 120 },
        { name: "Fudan-WiFi-5G", value: 200 },
        { name: "Fudan-Guest", value: 60 },
        { name: "Fudan-Staff", value: 90 },
        { name: "Fudan-Student", value: 160 },
      ],
    },
    [CampusId.FengLin]: {
      rate5G: 60,
      data: [
        { name: "Fudan-WiFi-2.4G", value: 70 },
        { name: "Fudan-WiFi-5G", value: 120 },
        { name: "Fudan-Guest", value: 30 },
        { name: "Fudan-Staff", value: 50 },
        { name: "Fudan-Student", value: 90 },
      ],
    },
    [CampusId.ZhangJiang]: {
      rate5G: 58,
      data: [
        { name: "Fudan-WiFi-2.4G", value: 50 },
        { name: "Fudan-WiFi-5G", value: 80 },
        { name: "Fudan-Guest", value: 20 },
        { name: "Fudan-Staff", value: 40 },
        { name: "Fudan-Student", value: 60 },
      ],
    },
  };

  // 模拟数据：用户/终端变化趋势（近30天）
  const mockUserTerminalTrendData: { name: string; value1: number; value2: number }[] = [];
  for (let i = 30; i > 0; i--) {
    const date = dayjs().subtract(i, "day");
    mockUserTerminalTrendData.push({
      name: date.format("M/D"),
      value1: Math.floor(8000 + Math.random() * 4000), // 用户数：8000-12000
      value2: Math.floor(10000 + Math.random() * 5000), // 终端数：10000-15000
    });
  }

  // 模拟数据：流量对比（近30天）
  const mockTrafficData: { name: string; value1: number; value2: number }[] = [];
  for (let i = 30; i > 0; i--) {
    const date = dayjs().subtract(i, "day");
    mockTrafficData.push({
      name: date.format("M/D"),
      value1: Math.floor(5 + Math.random() * 3), // 上行流量：5-8 Gbps
      value2: Math.floor(8 + Math.random() * 5), // 下行流量：8-13 Gbps
    });
  }

  const {
    state: topCountState,
    execute: topCountExecute,
  } = useAsyncState(async () => {
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchTopCount(campusId.value));
    // if (err) return {};
    // return res?.resultData || {};
    return mockTopCountData[campusId.value] || mockTopCountData[CampusId.Overview];
  }, {}, { resetOnExecute: false });

  const {
    state: apAndUserAndTerminalState,
    execute: apAndUserAndTerminalExecute,
  } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchApAndUserAndTerminal(campusId.value));
      // if (err) return { APData: [], userAndTerminalData: [] };
      // const result = res?.resultData || [];
      //
      // return {
      //   APData: result.map(item => ({ name: item.name, value: item.apnum })),
      //   userAndTerminalData: result.map(item => ({ name: item.name, value1: item.acnum, value2: item.userac })),
      // };
      return {
        APData: mockAPData[campusId.value] || mockAPData[CampusId.HanDan],
        userAndTerminalData: mockUserAndTerminalData[campusId.value] || mockUserAndTerminalData[CampusId.Overview],
      };
    },
    { APData: [], userAndTerminalData: [] },
    { resetOnExecute: false },
  );

  const { APData, userAndTerminalData } = toRefs(toReactive(apAndUserAndTerminalState));

  const { state: deviceCountState, execute: deviceCountExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchDeviceCount(campusId.value));
      // if (err) return [];
      // return (res?.resultData || []).sort((a, b) => b.value - a.value);
      const data = mockDeviceCountData[campusId.value] || mockDeviceCountData[CampusId.Overview];
      return data.sort((a, b) => b.value - a.value);
    },
    [],
    { resetOnExecute: false },
  );

  const { state: healthCountState, execute: healthCountExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchHealthCount(campusId.value));
      // if (err) return [];
      // return res?.resultData || [];
      return mockHealthCountData[campusId.value] || mockHealthCountData[CampusId.Overview];
    },
    [],
    { resetOnExecute: false },
  );

  const { state: ssidCountState, execute: ssidCountExecute } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchSsidCount(campusId.value));
      // if (err) {
      //   return { rate5G: 0, data: [] };
      // }
      // const { is5G = 0, ssid = [] } = res?.resultData || {};
      // return {
      //   rate5G: is5G,
      //   data: ssid,
      // };
      return mockSSIDCountData[campusId.value] || mockSSIDCountData[CampusId.Overview];
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
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchUserAndTerminalAndTraffic(userOrTerminalStateType.value));
    // if (err) return [];
    // return (res?.resultData || [])
    //   .map(({ datetime, hours, countac, userac }) => {
    //     return {
    //       name: userOrTerminalStateType.value === "1" ? dayjs(datetime).format("M/D") : `${Number(hours)}时`,
    //       value1: userac,
    //       value2: countac,
    //     };
    //   });

    if (userOrTerminalStateType.value === "1") {
      // 近30天数据
      return mockUserTerminalTrendData;
    }
    else {
      // 近24小时数据
      const hourlyData: { name: string; value1: number; value2: number }[] = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date().getHours() - i;
        const displayHour = hour < 0 ? 24 + hour : hour;
        hourlyData.push({
          name: `${displayHour}时`,
          value1: Math.floor(6000 + Math.random() * 3000), // 用户数：6000-9000
          value2: Math.floor(8000 + Math.random() * 4000), // 终端数：8000-12000
        });
      }
      return hourlyData;
    }
  }, [], { resetOnExecute: false });

  const {
    state: trafficData,
    execute: terminalAndTrafficExecute,
  } = useAsyncState(async () => {
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchUserAndTerminalAndTraffic(trafficDataType.value));
    // if (err) return [];
    // return (res?.resultData || [])
    //   .map(({ datetime, hours, sumtx, sumrx }) => {
    //     return {
    //       name: trafficDataType.value === "1" ? dayjs(datetime).format("M/D") : `${Number(hours)}时`,
    //       value1: sumrx,
    //       value2: sumtx,
    //     };
    //   });

    if (trafficDataType.value === "1") {
      // 近30天数据
      return mockTrafficData;
    }
    else {
      // 近24小时数据
      const hourlyData: { name: string; value1: number; value2: number }[] = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date().getHours() - i;
        const displayHour = hour < 0 ? 24 + hour : hour;
        hourlyData.push({
          name: `${displayHour}时`,
          value1: Math.floor(2 + Math.random() * 2), // 上行流量：2-4 Gbps
          value2: Math.floor(4 + Math.random() * 4), // 下行流量：4-8 Gbps
        });
      }
      return hourlyData;
    }
  }, [], { resetOnExecute: false });

  watch(userOrTerminalStateType, () => userExecute());
  watch(trafficDataType, () => terminalAndTrafficExecute());

  watch(
    () => campusId.value,
    () => {
      topCountExecute();
      apAndUserAndTerminalExecute();
      deviceCountExecute();
      healthCountExecute();
      ssidCountExecute();
    },
  );

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
