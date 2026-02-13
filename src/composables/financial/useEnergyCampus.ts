// import { fetchCampusChargingPile, fetchCampusEnergyConsumption, fetchCampusEnergyMonitor } from "@/api/financial/energy.ts";
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
      // 根据校区ID返回不同的能源消耗数据
      const campusEnergyMap = {
        3: { // 邯郸校区
          yearelectamount: 420, // 年用电量（万千瓦时）
          yearwateramount: 280, // 年用水量（万吨）
          monthElect: 35, // 月用电量（万千瓦时）
          monthWater: 23, // 月用水量（万吨）
          totalElectAmount: 320, // 总电费（万元）
          totalWaterAmount: 160, // 总水费（万元）
          yearElectGrowth: 7.8, // 年用电增长率（%）
          yearWaterGrowth: 5.5, // 年用水增长率（%）
        },
        4: { // 江湾校区
          yearelectamount: 350,
          yearwateramount: 230,
          monthElect: 29,
          monthWater: 19,
          totalElectAmount: 265,
          totalWaterAmount: 135,
          yearElectGrowth: 8.2,
          yearWaterGrowth: 6.0,
        },
        1: { // 枫林校区
          yearelectamount: 280,
          yearwateramount: 190,
          monthElect: 23,
          monthWater: 16,
          totalElectAmount: 210,
          totalWaterAmount: 110,
          yearElectGrowth: 6.5,
          yearWaterGrowth: 4.8,
        },
        2: { // 张江校区
          yearelectamount: 220,
          yearwateramount: 150,
          monthElect: 18,
          monthWater: 12,
          totalElectAmount: 165,
          totalWaterAmount: 85,
          yearElectGrowth: 5.8,
          yearWaterGrowth: 4.2,
        },
      };

      // 获取校区数据，默认为邯郸校区
      return campusEnergyMap[campusId.value as unknown as keyof typeof campusEnergyMap] || campusEnergyMap["3"];
    },
    {
      yearelectamount: 0,
      yearwateramount: 0,
      monthElect: 0,
      monthWater: 0,
      totalElectAmount: 0,
      totalWaterAmount: 0,
      yearElectGrowth: 0,
      yearWaterGrowth: 0,
    },
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: chargingPileState,
    execute: chargingPileExecute,
  } = useAsyncState(
    async () => {
      // 根据校区ID返回不同的充电桩数据
      const campusChargingMap = {
        3: { // 邯郸校区
          electricBicycle: {
            total: 15, // 电动自行车充电桩总数
            using: 11, // 使用中
            idle: 4, // 空闲
            usageRate: 73, // 使用率（%）
          },
          newEnergyVehicles: {
            total: 10, // 新能源汽车充电桩总数
            using: 7, // 使用中
            idle: 3, // 空闲
            usageRate: 70, // 使用率（%）
          },
          totalChargingAmount: 950, // 总充电量（万千瓦时）
          totalChargingFee: 475, // 总充电费用（万元）
        },
        4: { // 江湾校区
          electricBicycle: {
            total: 12,
            using: 9,
            idle: 3,
            usageRate: 75,
          },
          newEnergyVehicles: {
            total: 8,
            using: 6,
            idle: 2,
            usageRate: 75,
          },
          totalChargingAmount: 750,
          totalChargingFee: 375,
        },
        1: { // 枫林校区
          electricBicycle: {
            total: 10,
            using: 7,
            idle: 3,
            usageRate: 70,
          },
          newEnergyVehicles: {
            total: 6,
            using: 4,
            idle: 2,
            usageRate: 67,
          },
          totalChargingAmount: 650,
          totalChargingFee: 325,
        },
        2: { // 张江校区
          electricBicycle: {
            total: 8,
            using: 5,
            idle: 3,
            usageRate: 63,
          },
          newEnergyVehicles: {
            total: 4,
            using: 3,
            idle: 1,
            usageRate: 75,
          },
          totalChargingAmount: 500,
          totalChargingFee: 250,
        },
      };

      // 获取校区数据，默认为邯郸校区
      return campusChargingMap[campusId.value as unknown as keyof typeof campusChargingMap] || campusChargingMap["3"];
    },
    {
      electricBicycle: {
        total: 0,
        using: 0,
        idle: 0,
        usageRate: 0,
      },
      newEnergyVehicles: {
        total: 0,
        using: 0,
        idle: 0,
        usageRate: 0,
      },
      totalChargingAmount: 0,
      totalChargingFee: 0,
    },
    { immediate: true, resetOnExecute: false },
  );

  const energyMonitorTiemType = ref<"day" | "month">("day");
  const {
    state: energyMonitorState,
    execute: energyMonitorExecute,
  } = useAsyncState(
    async () => {
      // 根据时间类型返回不同的能耗监控数据
      const dayData = [
        { name: "00:00", water: 45, elect: 85 },
        { name: "02:00", water: 42, elect: 72 },
        { name: "04:00", water: 38, elect: 65 },
        { name: "06:00", water: 42, elect: 78 },
        { name: "08:00", water: 52, elect: 125 },
        { name: "10:00", water: 58, elect: 145 },
        { name: "12:00", water: 55, elect: 132 },
        { name: "14:00", water: 62, elect: 158 },
        { name: "16:00", water: 65, elect: 168 },
        { name: "18:00", water: 60, elect: 152 },
        { name: "20:00", water: 52, elect: 128 },
        { name: "22:00", water: 48, elect: 95 },
      ];

      const monthData = [
        { name: "1月", water: 1250, elect: 1850 },
        { name: "2月", water: 1180, elect: 1780 },
        { name: "3月", water: 1320, elect: 1920 },
        { name: "4月", water: 1280, elect: 1880 },
        { name: "5月", water: 1350, elect: 1950 },
        { name: "6月", water: 1420, elect: 2020 },
        { name: "7月", water: 1480, elect: 2080 },
        { name: "8月", water: 1380, elect: 1980 },
        { name: "9月", water: 1320, elect: 1920 },
        { name: "10月", water: 1280, elect: 1880 },
        { name: "11月", water: 1250, elect: 1850 },
        { name: "12月", water: 1200, elect: 1800 },
      ];

      // 根据时间类型返回相应的数据
      return energyMonitorTiemType.value === "day" ? dayData : monthData;
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
