import to from "await-to-js";
import dayjs from "dayjs";
import { fetchDeviceCount, fetchHealthCount, fetchSsidCount, fetchTopCount } from "@/api/network";
import { fetchUserAndTerminal, fetchUserDistributionTop5 } from "@/api/network/campus.ts";
import { useCampusStore } from "@/stores/campus.ts";
import { CampusId } from "@/enums";

export default function useCampusPanelCountData() {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  // 复用 usePanelCountData 中的模拟数据
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
    const date = dayjs().subtract(i, 'day');
    mockUserTerminalTrendData.push({
      name: date.format('M/D'),
      value1: Math.floor(8000 + Math.random() * 4000), // 用户数：8000-12000
      value2: Math.floor(10000 + Math.random() * 5000), // 终端数：10000-15000
    });
  }

  // 模拟数据：人员分布楼宇Top5
  const mockUserDistributionTop5Data: Record<CampusId, { name: string; value1: number; value2: number }[]> = {
    [CampusId.Overview]: [
      { name: "光华楼", value1: 850, value2: 1200 },
      { name: "图书馆", value1: 720, value2: 980 },
      { name: "理科图书馆", value1: 680, value2: 850 },
      { name: "教学楼", value1: 620, value2: 780 },
      { name: "实验楼", value1: 580, value2: 720 },
    ],
    [CampusId.HanDan]: [
      { name: "光华楼", value1: 850, value2: 1200 },
      { name: "图书馆", value1: 720, value2: 980 },
      { name: "理科图书馆", value1: 680, value2: 850 },
      { name: "教学楼", value1: 620, value2: 780 },
      { name: "实验楼", value1: 580, value2: 720 },
    ],
    [CampusId.JiangWan]: [
      { name: "江湾图书馆", value1: 420, value2: 580 },
      { name: "法学楼", value1: 380, value2: 520 },
      { name: "环境科学楼", value1: 350, value2: 480 },
      { name: "生命科学楼", value1: 320, value2: 420 },
      { name: "物理楼", value1: 280, value2: 380 },
    ],
    [CampusId.FengLin]: [
      { name: "枫林图书馆", value1: 320, value2: 450 },
      { name: "医学实验楼", value1: 280, value2: 380 },
      { name: "基础医学楼", value1: 250, value2: 350 },
      { name: "临床医学楼", value1: 220, value2: 320 },
      { name: "药学楼", value1: 200, value2: 280 },
    ],
    [CampusId.ZhangJiang]: [
      { name: "张江图书馆", value1: 220, value2: 320 },
      { name: "微电子楼", value1: 200, value2: 280 },
      { name: "软件工程楼", value1: 180, value2: 250 },
      { name: "计算机科学楼", value1: 160, value2: 220 },
      { name: "网络安全楼", value1: 140, value2: 200 },
    ],
  };

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
  const {
    state: userOrTerminalState,
    execute: userExecute,
  } = useAsyncState(async () => {
    // 注释掉API请求，使用模拟数据
    // const [err, res] = await to(fetchUserAndTerminal(campusId.value, userOrTerminalStateType.value));
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
    } else {
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
    state: userDistributionTop5State,
    execute: userDistributionTop5Execute,
  } = useAsyncState(
    async () => {
      // 注释掉API请求，使用模拟数据
      // const [err, res] = await to(fetchUserDistributionTop5(campusId.value));
      // if (err) return [];
      // return (res?.resultData || [])
      //   .map(({ name, yhs, zds, ...rest }) => ({ name, value1: yhs, value2: zds, ...rest }))
      //   ?.sort((a, b) => a.value1 - b.value1);
      const data = mockUserDistributionTop5Data[campusId.value] || mockUserDistributionTop5Data[CampusId.Overview];
      return data.map(item => ({ ...item })).sort((a, b) => a.value1 - b.value1);
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
