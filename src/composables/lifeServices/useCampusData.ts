import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";

type IDataArr = { name: string; value: number }[];

interface ICountData {
  count: number;
  data: IDataArr;
}

export function useCampusData() {
  const campusStore = useCampusStore();
  // 校区id
  const { activeCampusId: campusId } = storeToRefs(campusStore);

  // 注释掉所有API调用，使用硬编码数据
  // 校区面板数据 - 硬编码数据
  const state = ref<any>({});

  // 购电数据 - 硬编码数据
  const purchaseState = ref<any>({});

  // 用电量数据 - 硬编码数据
  const electricityState = ref<any>({});

  // 根据校区ID提供不同的硬编码数据
  watch(
    () => campusId.value,
    () => {
      if (campusId.value == CampusId.Overview) {
        state.value = {};
        purchaseState.value = {};
        electricityState.value = {};
        return;
      }

      // 邯郸校区 (campusId=3)
      if (campusId.value === CampusId.HanDan) {
        state.value = {
          ldtj: {
            count: 35,
            data: [
              { name: "男生宿舍", value: 15 },
              { name: "女生宿舍", value: 12 },
              { name: "研究生公寓", value: 8 },
            ],
          },
          fjtj: {
            count: 2500,
            data: [
              { name: "单人间", value: 400 },
              { name: "双人间", value: 1200 },
              { name: "四人间", value: 900 },
            ],
          },
          cwtj: {
            count: 7200,
            data: [
              { name: "本科生", value: 4500 },
              { name: "研究生", value: 2200 },
              { name: "博士生", value: 500 },
            ],
          },
          ryfb: {
            count: 7200,
            data: [
              { name: "男生", value: 3800 },
              { name: "女生", value: 3400 },
              { name: "留学生", value: 150 },
              { name: "交换生", value: 50 },
            ],
          },
        };

        electricityState.value = {
          yqyd: [
            { name: "北区", value: 450 },
            { name: "东区", value: 380 },
            { name: "本部", value: 520 },
            { name: "南区", value: 410 },
          ],
          ydzs: 1760,
          ydtb: [
            { name: "1月", value: 420, value1: 430 },
            { name: "2月", value: 380, value1: 390 },
            { name: "3月", value: 450, value1: 460 },
            { name: "4月", value: 440, value1: 450 },
            { name: "5月", value: 460, value1: 470 },
            { name: "6月", value: 480, value1: 490 },
            { name: "7月", value: 520, value1: 530 },
            { name: "8月", value: 510, value1: 520 },
            { name: "9月", value: 490, value1: 500 },
            { name: "10月", value: 470, value1: 480 },
            { name: "11月", value: 460, value1: 470 },
            { name: "12月", value: 440, value1: 450 },
          ],
          ydhb: [
            { name: "环比1月", value: 5, value1: 3 },
            { name: "环比2月", value: -3, value1: -2 },
            { name: "环比3月", value: 8, value1: 7 },
            { name: "环比4月", value: -2, value1: -1 },
            { name: "环比5月", value: 4, value1: 3 },
            { name: "环比6月", value: 6, value1: 5 },
          ],
        };

        purchaseState.value = {
          ndgd: [
            { name: "1月", value: 120, value1: 125 },
            { name: "2月", value: 115, value1: 118 },
            { name: "3月", value: 130, value1: 135 },
            { name: "4月", value: 125, value1: 128 },
            { name: "5月", value: 135, value1: 140 },
            { name: "6月", value: 140, value1: 145 },
            { name: "7月", value: 150, value1: 155 },
            { name: "8月", value: 145, value1: 150 },
            { name: "9月", value: 140, value1: 145 },
            { name: "10月", value: 135, value1: 140 },
            { name: "11月", value: 130, value1: 135 },
            { name: "12月", value: 125, value1: 130 },
          ],
          jrgd: {
            count: 1550,
            data: [
              { name: "北区", value: 450 },
              { name: "东区", value: 380 },
              { name: "本部", value: 420 },
              { name: "南区", value: 300 },
            ],
          },
          gdyddb: [
            { name: "环比1月", value: 3, value1: 2 },
            { name: "环比2月", value: -2, value1: -1 },
            { name: "环比3月", value: 5, value1: 4 },
            { name: "环比4月", value: -1, value1: 0 },
            { name: "环比5月", value: 4, value1: 3 },
            { name: "环比6月", value: 3, value1: 2 },
          ],
        };
      }
      // 江湾校区 (campusId=4)
      else if (campusId.value === CampusId.JiangWan) {
        state.value = {
          ldtj: {
            count: 28,
            data: [
              { name: "男生宿舍", value: 12 },
              { name: "女生宿舍", value: 10 },
              { name: "研究生公寓", value: 6 },
            ],
          },
          fjtj: {
            count: 2100,
            data: [
              { name: "单人间", value: 300 },
              { name: "双人间", value: 1000 },
              { name: "四人间", value: 800 },
            ],
          },
          cwtj: {
            count: 6000,
            data: [
              { name: "本科生", value: 3500 },
              { name: "研究生", value: 2000 },
              { name: "博士生", value: 500 },
            ],
          },
          ryfb: {
            count: 6000,
            data: [
              { name: "男生", value: 3200 },
              { name: "女生", value: 2800 },
              { name: "留学生", value: 100 },
              { name: "交换生", value: 30 },
            ],
          },
        };

        electricityState.value = {
          yqyd: [
            { name: "生活区", value: 350 },
            { name: "教学区", value: 280 },
            { name: "实验区", value: 220 },
            { name: "办公区", value: 150 },
          ],
          ydzs: 1000,
          ydtb: [
            { name: "1月", value: 320, value1: 330 },
            { name: "2月", value: 300, value1: 310 },
            { name: "3月", value: 340, value1: 350 },
            { name: "4月", value: 330, value1: 340 },
            { name: "5月", value: 350, value1: 360 },
            { name: "6月", value: 360, value1: 370 },
            { name: "7月", value: 380, value1: 390 },
            { name: "8月", value: 370, value1: 380 },
            { name: "9月", value: 360, value1: 370 },
            { name: "10月", value: 350, value1: 360 },
            { name: "11月", value: 340, value1: 350 },
            { name: "12月", value: 330, value1: 340 },
          ],
          ydhb: [
            { name: "环比1月", value: 4, value1: 3 },
            { name: "环比2月", value: -2, value1: -1 },
            { name: "环比3月", value: 6, value1: 5 },
            { name: "环比4月", value: -1, value1: 0 },
            { name: "环比5月", value: 3, value1: 2 },
            { name: "环比6月", value: 5, value1: 4 },
          ],
        };

        purchaseState.value = {
          ndgd: [
            { name: "1月", value: 100, value1: 105 },
            { name: "2月", value: 95, value1: 98 },
            { name: "3月", value: 110, value1: 115 },
            { name: "4月", value: 105, value1: 108 },
            { name: "5月", value: 115, value1: 120 },
            { name: "6月", value: 120, value1: 125 },
            { name: "7月", value: 130, value1: 135 },
            { name: "8月", value: 125, value1: 130 },
            { name: "9月", value: 120, value1: 125 },
            { name: "10月", value: 115, value1: 120 },
            { name: "11月", value: 110, value1: 115 },
            { name: "12月", value: 105, value1: 110 },
          ],
          jrgd: {
            count: 1250,
            data: [
              { name: "生活区", value: 450 },
              { name: "教学区", value: 350 },
              { name: "实验区", value: 250 },
              { name: "办公区", value: 200 },
            ],
          },
          gdyddb: [
            { name: "环比1月", value: 2, value1: 1 },
            { name: "环比2月", value: -1, value1: 0 },
            { name: "环比3月", value: 4, value1: 3 },
            { name: "环比4月", value: 0, value1: 1 },
            { name: "环比5月", value: 3, value1: 2 },
            { name: "环比6月", value: 2, value1: 1 },
          ],
        };
      }
      // 其他校区（枫林、张江）使用默认数据
      else {
        state.value = {
          ldtj: { count: 20, data: [] },
          fjtj: { count: 1500, data: [] },
          cwtj: { count: 4000, data: [] },
          ryfb: { count: 4000, data: [] },
        };
        electricityState.value = {
          yqyd: [],
          ydzs: 800,
          ydtb: [],
          ydhb: [],
        };
        purchaseState.value = {
          ndgd: [],
          jrgd: { count: 1000, data: [] },
          gdyddb: [],
        };
      }
    },
    { immediate: true },
  );

  // 校园概览 data
  const campusOverviewData = computed(() => {
    // 宿舍楼宇
    const { data: buildList = [], count: buildCount = 0 } = (toValue(state)?.ldtj || {}) as ICountData;
    // 房间
    const { data: roomList = [], count: roomCount = 0 } = (toValue(state)?.fjtj || {}) as ICountData;
    // 床位
    const { data: bedList = [], count: bedCount = 0 } = (toValue(state)?.cwtj || {}) as ICountData;

    return { buildCount, buildList, roomCount, roomList, bedCount, bedList };
  });

  // 人员分布
  const personnelDistributionData = computed(() => {
    const { count = 0, data = [] } = toValue(state)?.ryfb || {};
    return { count, data } as ICountData;
  });

  // 校园能耗 - 用电
  const campusEnergyUseData = computed(() => {
    const {
      yqyd = [],
      ydzs = 0,
      ydtb = [],
      ydhb = [],
    } = toValue(electricityState) as {
      yqyd: IDataArr;
      ydzs: number;
      ydtb: { name: string; value: number; value1: number }[];
      ydhb: { name: string; value: number; value1: number }[];
    };

    return {
      // 区域统计
      regionStatistics: { count: ydzs, data: yqyd },
      // 月度统计
      monthStatistics: ydtb.map(({ name, value, value1 }) => ({ name, value1: value, value2: value1 })),
      // 环比统计
      chainStatistics: ydhb.map(({ name, value, value1 }) => ({ name, value1: value, value2: value1 })),
    };
  });

  // 校园能耗 - 购电
  const campusEnergyPurchaseData = computed(() => {
    const { ndgd = [], jrgd = { count: 0, data: [] }, gdyddb = [] } = purchaseState.value;
    return {
      // 区域统计
      regionStatistics: jrgd,
      // 月度统计
      monthStatistics: ndgd,
      // 环比统计
      chainStatistics: gdyddb,
    };
  });

  return {
    campusOverviewData,
    personnelDistributionData,
    campusEnergyUseData,
    campusEnergyPurchaseData,
  };
}
