import { to } from "await-to-js";
// import { fetchCampusChargingPile, fetchCampusEnergyConsumption, fetchCampusWaterElectricity, fetchCampusWaterElectricityTop5 } from "@/api/financial/energy.ts";

export default function useEnergyOverview() {
  const {
    state: energyConsumptionState,
  } = useAsyncState(
    async () => {
      // 模拟数据：能源消耗总览
      // 注意：组件需要以下字段：
      // 用电：nowelect, nowelectamount, nowelectmom, monthelect, monthelectamount, monthelectmom, yearelect, yearelectamount, yearelectmom
      // 用水：nowwater, nowwateramount, nowwatermom, monthwater, monthwateramount, monthwatermom, yearwater, yearwateramount, yearwatermom
      return {
        // 用电数据
        nowelect: 85,           // 昨日用电量（万Kwh）
        nowelectamount: 65,     // 昨日电费（万元）
        nowelectmom: 2.5,       // 日环比增长率（%）
        
        monthelect: 105,        // 本月用电量（万Kwh）
        monthelectamount: 80,   // 本月电费（万元）
        monthelectmom: 4.2,     // 月环比增长率（%）
        
        yearelect: 1250,        // 本年用电量（万Kwh）
        yearelectamount: 950,   // 本年电费（万元）
        yearelectmom: 8.5,      // 年环比增长率（%）
        
        // 用水数据
        nowwater: 68,           // 昨日用水量（万m³）
        nowwateramount: 45,     // 昨日水费（万元）
        nowwatermom: 1.8,       // 日环比增长率（%）
        
        monthwater: 72,         // 本月用水量（万m³）
        monthwateramount: 48,   // 本月水费（万元）
        monthwatermom: 3.5,     // 月环比增长率（%）
        
        yearwater: 850,         // 本年用水量（万m³）
        yearwateramount: 480,   // 本年水费（万元）
        yearwatermom: 6.2       // 年环比增长率（%）
      };
    },
    {
      // 用电数据默认值
      nowelect: 0,
      nowelectamount: 0,
      nowelectmom: 0,
      monthelect: 0,
      monthelectamount: 0,
      monthelectmom: 0,
      yearelect: 0,
      yearelectamount: 0,
      yearelectmom: 0,
      // 用水数据默认值
      nowwater: 0,
      nowwateramount: 0,
      nowwatermom: 0,
      monthwater: 0,
      monthwateramount: 0,
      monthwatermom: 0,
      yearwater: 0,
      yearwateramount: 0,
      yearwatermom: 0
    },
    { immediate: true, resetOnExecute: false },
  );

  const {
    state: chargingPileState,
  } = useAsyncState(
    async () => {
      // 模拟数据：充电桩数据
      // 注意：组件需要以下字段：
      // 电动车：yearebcumulative, monthebcumulative, nowebcumulative, yearebcumulativeamount, monthebcumulativeamount, nowebcumulativeamount
      // 新能源：yearevcumulative, monthevcumulative, nowevcumulative, yearevcumulativeamount, monthevcumulativeamount, nowevcumulativeamount
      return {
        // 电动车（电动自行车）充电数据
        yearebcumulative: 2850,       // 年累计充电量（万KWh）
        monthebcumulative: 245,       // 月累计充电量（万KWh）
        nowebcumulative: 8.5,         // 日充电量（万KWh）
        
        yearebcumulativeamount: 1425, // 年累计充电费用（万元）
        monthebcumulativeamount: 125, // 月累计充电费用（万元）
        nowebcumulativeamount: 4.2,   // 日充电费用（万元）
        
        // 新能源汽车充电数据
        yearevcumulative: 1850,       // 年累计充电量（万KWh）
        monthevcumulative: 155,       // 月累计充电量（万KWh）
        nowevcumulative: 5.2,         // 日充电量（万KWh）
        
        yearevcumulativeamount: 925,  // 年累计充电费用（万元）
        monthevcumulativeamount: 78,  // 月累计充电费用（万元）
        nowevcumulativeamount: 2.8    // 日充电费用（万元）
      };
    },
    {
      // 电动车数据默认值
      yearebcumulative: 0,
      monthebcumulative: 0,
      nowebcumulative: 0,
      yearebcumulativeamount: 0,
      monthebcumulativeamount: 0,
      nowebcumulativeamount: 0,
      // 新能源汽车数据默认值
      yearevcumulative: 0,
      monthevcumulative: 0,
      nowevcumulative: 0,
      yearevcumulativeamount: 0,
      monthevcumulativeamount: 0,
      nowevcumulativeamount: 0
    },
    { immediate: true, resetOnExecute: false },
  );

  const waterElectricityStateType = ref<"electricity" | "water">("electricity");

  const { state: waterElectricityState, execute: executeWaterElectricityState } = useAsyncState(
    async () => {
      // 模拟数据：用水用电TOP5建筑
      const top5Data = {
        electricity: [ // 用电TOP5
          { name: "图书馆", value: 85, value1: 65 },
          { name: "实验楼", value: 78, value1: 58 },
          { name: "教学楼", value: 72, value1: 52 },
          { name: "行政楼", value: 65, value1: 45 },
          { name: "体育馆", value: 58, value1: 38 }
        ],
        water: [ // 用水TOP5
          { name: "学生宿舍", value: 92, value1: 75 },
          { name: "食堂", value: 85, value1: 68 },
          { name: "实验楼", value: 78, value1: 60 },
          { name: "教学楼", value: 72, value1: 55 },
          { name: "图书馆", value: 68, value1: 50 }
        ]
      };
      
      // 模拟数据：年度用水用电数据
      const yearData = [
        { name: "1月", water: 68, elect: 85, wateramount: 45, electamount: 65 },
        { name: "2月", water: 72, elect: 92, wateramount: 48, electamount: 70 },
        { name: "3月", water: 75, elect: 98, wateramount: 50, electamount: 75 },
        { name: "4月", water: 78, elect: 105, wateramount: 52, electamount: 80 },
        { name: "5月", water: 82, elect: 112, wateramount: 55, electamount: 85 },
        { name: "6月", water: 85, elect: 120, wateramount: 57, electamount: 92 },
        { name: "7月", water: 88, elect: 125, wateramount: 59, electamount: 95 },
        { name: "8月", water: 85, elect: 118, wateramount: 57, electamount: 90 },
        { name: "9月", water: 82, elect: 110, wateramount: 55, electamount: 84 },
        { name: "10月", water: 78, elect: 102, wateramount: 52, electamount: 78 },
        { name: "11月", water: 75, elect: 95, wateramount: 50, electamount: 72 },
        { name: "12月", water: 72, elect: 88, wateramount: 48, electamount: 68 }
      ];
      
      const type = waterElectricityStateType.value;
      return {
        top5: top5Data[type].sort((a, b) => a.value - b.value),
        year: yearData.map(({ name, water, elect, wateramount, electamount }) => ({
          name,
          value1: type === "electricity" ? elect : water,
          value2: type === "electricity" ? electamount : wateramount,
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
