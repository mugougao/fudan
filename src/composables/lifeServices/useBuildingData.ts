import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import round from "lodash/round";
import {
  getBuildingOverview,
  getBuildingOverviewYh,
  getDormitoryBuildElectricity,
  getFocusStudentEarlyWarn,
  getSupervisor,
} from "@/api/lifeServices";
import { getBuildingUuidByNumericId } from "@/utils/buildingMapping";

export function useBuildingData() {
  // 宿舍区 ID
  const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;
  const dormitoryAreaName = useRouteQuery("dormitoryAreaName", "") as unknown as Ref<string>;
  // 楼栋 ID
  const buildId = useRouteQuery("buildId") as unknown as Ref<string>;

  console.log("📊 [useBuildingData] 初始化:", {
    宿舍区ID: dormitoryAreaId.value,
    宿舍区名称: dormitoryAreaName.value,
    楼栋ID: buildId.value,
  });

  // 默认楼栋数据
  const defaultBuildingData = {
    ssxx: {
      lymc: "45#宿舍楼",
      fjs: 68,
      cws: 136,
      rzrs: 122,
      rzl: 89.7,
      lyjs: 6,
      dxs: 3,
      nan: 122,
      nv: 0,
    },
    ryxx: {
      zrs: 122,
      rzl: 89.7,
      dybl: 28.5,
      xlfb: [
        { name: "本科生", value: 85 },
        { name: "硕士研究生", value: 28 },
        { name: "博士研究生", value: 9 },
      ],
      xbfb: [
        { name: "男", value: 122 },
        { name: "女", value: 0 },
      ],
      yxfb: [
        { name: "计算机科学技术学院", value: 32 },
        { name: "数学科学学院", value: 25 },
        { name: "物理学系", value: 20 },
        { name: "化学系", value: 18 },
        { name: "生命科学学院", value: 15 },
        { name: "其他", value: 12 },
      ],
    },
    tsxx: {
      zsscfb: [
        { name: "0-1年", value: 45 },
        { name: "1-2年", value: 38 },
        { name: "2-3年", value: 25 },
        { name: "3年以上", value: 14 },
      ],
      yjtssjfb: [
        { name: "一周内", value: 5 },
        { name: "一月内", value: 12 },
        { name: "三月内", value: 18 },
        { name: "半年内", value: 28 },
        { name: "一年内", value: 35 },
        { name: "一年以上", value: 24 },
      ],
    },
  };

  let _ywhInfoExecute = () => {};

  const { state: dormitoryState, execute: executeDormitoryState} = useAsyncState(
    async () => {
      console.log("📊 [useBuildingData] 🚫 API调用已注释，使用默认数据:", {
        楼栋数字ID: buildId.value,
      });

      // 🚫 注释掉API调用，直接返回默认数据
      return defaultBuildingData;

      /* // 原API调用逻辑已注释
      const buildingUuid = getBuildingUuidByNumericId(buildId.value);

      console.log("📊 [useBuildingData] ID映射结果:", {
        数字ID: buildId.value,
        UUID: buildingUuid,
      });

      if (!buildingUuid) {
        console.warn("⚠️ [useBuildingData] UUID映射失败，使用默认数据");
        return defaultBuildingData;
      }

      console.log("📊 [useBuildingData] 调用API获取楼栋概览数据");

      const [err, res] = await to(getBuildingOverview(buildingUuid));

      if (err) {
        console.error("❌ [useBuildingData] 获取楼栋概览数据失败，使用默认数据:", err);
        return defaultBuildingData;
      }

      const data = res?.resultData;
      if (!data || Object.keys(data).length === 0) {
        console.warn("⚠️ [useBuildingData] 楼栋概览数据为空，使用默认数据");
        return defaultBuildingData;
      }

      console.log("✅ [useBuildingData] 楼栋概览数据获取成功:", data);
      return data;
      */
    },
    defaultBuildingData,
    {
      resetOnExecute: false,
      onSuccess: () => {
        _ywhInfoExecute();
      },
    },
  );

  // 默认园委会信息
  const defaultYwhInfo = {
    count: 5,
    list: [
      { name: "张明", role: "主任", phone: "13800138001", department: "计算机学院" },
      { name: "李华", role: "副主任", phone: "13800138002", department: "数学学院" },
      { name: "王芳", role: "委员", phone: "13800138003", department: "物理系" },
      { name: "刘强", role: "委员", phone: "13800138004", department: "化学系" },
      { name: "陈静", role: "委员", phone: "13800138005", department: "生命学院" },
    ],
  };

  //  园委会 信息
  const { state: ywhInfo, execute: ywhInfoExecute } = useAsyncState(
    async () => {
      console.log("👥 [楼宇数据] 🚫 API调用已注释，使用默认园委会数据");
      
      // 🚫 注释掉API调用，直接返回默认数据
      return defaultYwhInfo;

      /* // 原API调用逻辑已注释
      console.log("👥 [楼宇数据] 获取园委会信息:", {
        宿舍区名称: dormitoryAreaName.value,
        楼栋名称: dormitoryState.value.ssxx?.lymc,
      });
      const [err, res] = await to(getBuildingOverviewYh(dormitoryAreaName.value, dormitoryState.value.ssxx?.lymc));
      if (err) {
        console.warn("⚠️ [楼宇数据] 园委会信息获取失败，使用默认数据:", err);
        return defaultYwhInfo;
      }
      const { zs = 0, lb = [] } = res?.resultData || {};
      if (zs === 0 || lb.length === 0) {
        console.warn("⚠️ [楼宇数据] 园委会信息为空，使用默认数据");
        return defaultYwhInfo;
      }
      console.log("✅ [楼宇数据] 园委会信息获取成功:", { count: zs, list: lb });
      return { count: zs, list: lb };
      */
    },
    defaultYwhInfo,
    {
      immediate: false,
      resetOnExecute: false,
      onSuccess: () => {
        _ywhInfoExecute = () => ywhInfoExecute();
      },
    },
  );

  // 默认督导员信息
  const defaultSupervisorInfo = {
    num: 3,
    list: [
      { name: "赵老师", phone: "13900139001", department: "学生处", title: "督导员" },
      { name: "钱老师", phone: "13900139002", department: "后勤保障处", title: "督导员" },
      { name: "孙老师", phone: "13900139003", department: "保卫处", title: "督导员" },
    ],
  };

  // 获取督导员人数及信息
  const { state: supervisorState, execute: supervisorExecute } = useAsyncState(async () => {
    console.log("👥 [楼宇数据] 🚫 API调用已注释，使用默认督导员数据");
    
    // 🚫 注释掉API调用，直接返回默认数据
    return defaultSupervisorInfo;

    /* // 原API调用逻辑已注释
    console.log("👥 [楼宇数据] 获取督导员信息:", { 楼栋ID: buildId.value });
    const buildingUuid = getBuildingUuidByNumericId(buildId.value);
    if (!buildingUuid) {
      console.warn("⚠️ [楼宇数据] UUID映射失败，使用默认督导员数据");
      return defaultSupervisorInfo;
    }
    const [err, res] = await to(getSupervisor({ id: buildingUuid, qyid: dormitoryAreaId.value }));
    if (err) {
      console.warn("⚠️ [楼宇数据] 督导员信息获取失败，使用默认数据:", err);
      return defaultSupervisorInfo;
    }
    const data = res?.resultData;
    if (!data || (data.num === 0 && (!data.list || data.list.length === 0))) {
      console.warn("⚠️ [楼宇数据] 督导员信息为空，使用默认数据");
      return defaultSupervisorInfo;
    }
    console.log("✅ [楼宇数据] 督导员信息获取成功:", data);
    return data;
    */
  }, defaultSupervisorInfo, { resetOnExecute: false });

  // 默认人员预警信息
  const defaultPersonnelEarlyWarn = {
    count: 8,
    list: [
      { name: "周同学", type: "学业预警", level: "一般", date: "2024-01-15", room: "301" },
      { name: "吴同学", type: "长期未归", level: "严重", date: "2024-01-10", room: "205" },
      { name: "郑同学", type: "违规用电", level: "一般", date: "2024-01-20", room: "412" },
      { name: "王同学", type: "心理关注", level: "重点", date: "2024-01-12", room: "308" },
      { name: "冯同学", type: "学业预警", level: "一般", date: "2024-01-18", room: "506" },
      { name: "陈同学", type: "经济困难", level: "重点", date: "2024-01-08", room: "214" },
      { name: "楚同学", type: "就业指导", level: "一般", date: "2024-01-22", room: "401" },
      { name: "卫同学", type: "健康关注", level: "重点", date: "2024-01-14", room: "318" },
    ],
  };

  // 重点关注学生信息 - 人员预警
  const { state: personnelEarlyWarn, execute: personnelEarlyWarnExecute } = useAsyncState(
    async () => {
      console.log("⚠️ [楼宇数据] 🚫 API调用已注释，使用默认人员预警数据");
      
      // 🚫 注释掉API调用，直接返回默认数据
      return defaultPersonnelEarlyWarn;

      /* // 原API调用逻辑已注释
      console.log("⚠️ [楼宇数据] 获取人员预警信息:", { 楼栋ID: buildId.value });
      const buildingUuid = getBuildingUuidByNumericId(buildId.value);
      if (!buildingUuid) {
        console.warn("⚠️ [楼宇数据] UUID映射失败，使用默认预警数据");
        return defaultPersonnelEarlyWarn;
      }
      const [err, res] = await to(getFocusStudentEarlyWarn(buildingUuid));
      if (err) {
        console.warn("⚠️ [楼宇数据] 人员预警信息获取失败，使用默认数据:", err);
        return defaultPersonnelEarlyWarn;
      }
      const { yjrs = 0, yjlb = [] } = res?.resultData || {};
      if (yjrs === 0 || yjlb.length === 0) {
        console.warn("⚠️ [楼宇数据] 人员预警信息为空，使用默认数据");
        return defaultPersonnelEarlyWarn;
      }
      console.log("✅ [楼宇数据] 人员预警信息获取成功:", { count: yjrs, list: yjlb });
      return { count: yjrs, list: yjlb };
      */
    },
    defaultPersonnelEarlyWarn,
    { resetOnExecute: false },
  );

  // 宿舍信息
  const dormitoryInfo = computed(() => {
    const { ssxx = {} } = dormitoryState.value;
    const { num = 0, list = [] } = supervisorState.value;

    return {
      baseInfo: {
        ...ssxx,
        supervisorCount: num,
        parkCommitteeCount: ywhInfo.value.count,
      },
      supervisorsList: (list || []).map((item, index) => ({ id: index, ...item })),
      parkCommitteeList: ywhInfo.value.list,
    };
  });

  // 人员信息
  const personnelInfo = computed(() => {
    const { ryxx } = dormitoryState.value;
    const { zrs = 0, rzl = 0, dybl = 0, xlfb = [], xbfb = [], yxfb = [] } = ryxx || {};

    const departmentTotal = yxfb?.reduce((acc: number, cur: Record<string, any>) => acc + Number(cur.value), 0);

    return {
      // 统计信息
      statistics: {
        total: zrs,
        occupancyRate: rzl,
        proportionOfPartyMembers: dybl,
      },
      // 学历
      education: xlfb,
      // 性别
      sex: xbfb,
      // 院系
      department: (yxfb || [])
        ?.sort(({ value: a }, { value: b }) => b - a)
        ?.map((item: Record<string, any>, index: number) => {
          const percent = departmentTotal === 0 ? 0 : round((Number(item.value) / departmentTotal) * 100, 2).toFixed(2);
          return { id: index + 1, ...item, percent };
        }),
    };
  });

  // 默认能耗信息
  const defaultEnergyConsumptionInfo = {
    statistics: {
      use: 1850, // 昨日用电量 kWh
      purchase: 1920, // 昨日购电量 kWh
    },
    list: [
      { name: "1", value1: 1680, value2: 5.2 },
      { name: "2", value1: 1750, value2: 8.3 },
      { name: "3", value1: 1820, value2: 6.5 },
      { name: "4", value1: 1550, value2: -3.8 },
      { name: "5", value1: 1420, value2: -5.2 },
      { name: "6", value1: 1280, value2: -8.1 },
      { name: "7", value1: 1350, value2: 3.5 },
      { name: "8", value1: 1680, value2: 12.8 },
      { name: "9", value1: 1650, value2: 4.2 },
      { name: "10", value1: 1750, value2: 6.8 },
      { name: "11", value1: 1820, value2: 7.2 },
      { name: "12", value1: 1850, value2: 5.5 },
    ],
  };

  // 能耗信息
  const {
    state: energyConsumptionInfo,
    execute: energyConsumptionInfoExecute,
  } = useAsyncState(
    async () => {
      console.log("⚡ [楼宇数据] 🚫 API调用已注释，使用默认能耗数据");
      
      // 🚫 注释掉API调用，直接返回默认数据
      return defaultEnergyConsumptionInfo;

      /* // 原API调用逻辑已注释
      console.log("⚡ [楼宇数据] 获取能耗信息:", { 楼栋ID: buildId.value });
      const buildingUuid = getBuildingUuidByNumericId(buildId.value);
      if (!buildingUuid) {
        console.warn("⚠️ [楼宇数据] UUID映射失败，使用默认能耗数据");
        return defaultEnergyConsumptionInfo;
      }
      const [err, res] = await to(getDormitoryBuildElectricity(buildingUuid));
      if (err) {
        console.warn("⚠️ [楼宇数据] 能耗信息获取失败，使用默认数据:", err);
        return defaultEnergyConsumptionInfo;
      }
      const { ydtb = [], zrydl = 0, zrgdl = 0 } = res?.resultData || {};

      if (ydtb.length === 0 && zrydl === 0 && zrgdl === 0) {
        console.warn("⚠️ [楼宇数据] 能耗信息为空，使用默认数据");
        return defaultEnergyConsumptionInfo;
      }

      const energyData = {
        statistics: {
          use: zrydl || defaultEnergyConsumptionInfo.statistics.use,
          purchase: zrgdl || defaultEnergyConsumptionInfo.statistics.purchase,
        },
        list: ydtb.length > 0 ? ydtb : defaultEnergyConsumptionInfo.list,
      };
      console.log("✅ [楼宇数据] 能耗信息获取成功:", energyData);
      return energyData;
      */
    },
    defaultEnergyConsumptionInfo,
  );

  // 重点关注学生信息
  const focusStudentInfo = computed(() => {
    const { tsxx } = dormitoryState.value;
    const { zsscfb = [], yjtssjfb = [] } = tsxx || {};

    return {
      // 累计住宿时长
      lengthStay: zsscfb,
      // 人员预警
      personWarn: personnelEarlyWarn.value,
      // 预计退宿时间
      checkOutTime: yjtssjfb,
    };
  });

  watch(buildId, () => {
    executeDormitoryState();
    supervisorExecute();
    energyConsumptionInfoExecute();
    personnelEarlyWarnExecute();
  });

  return {
    dormitoryInfo,
    personnelInfo,
    focusStudentInfo,
    energyConsumptionInfo,
  };
}
