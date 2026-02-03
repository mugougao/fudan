export const defaultTheme: [string, any] = [
  "default",
  {
    backgroundColor: "transparent",
    title: {
      textAlign: "center",
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          // color: "#000a1733",
        },
      },
      backgroundColor: "#00000080",
      borderColor: "#fffff80",
      textStyle: { color: "#fff" },
      appendToBody: true,
      confine: true,
    },
    legend: {
      right: 0,
      icon: "rect",
      itemWidth: 4,
      itemHeight: 4,
      textStyle: { color: "#fff", fontFamily: "AlibabaPuHuiTi-3-medium" },
      pageIconColor: "#FF1F1FCC",
      pageIconInactiveColor: "rgba(255,255,255,0.1)",
      pageTextStyle: {
        color: "#fff",
      },
    },
    grid: { top: "15%", left: "10%", right: "10%", bottom: "10%" },
    categoryAxis: {
      // axis的类型为'category'的公共配置
      axisLabel: { color: "#E1E1E1", fontSize: 12, interval: 0, rotate: 0, fontFamily: "AlibabaPuHuiTi-3" },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#E1E1E1" } },
      nameTextStyle: { color: "#9E9E9E", fontSize: 12, padding: [0, 0, 0, 0], fontFamily: "AlibabaPuHuiTi-3" },
    },
    valueAxis: {
      // axis的类型为'value'的公共配置
      axisLabel: { color: "#E1E1E1", fontSize: 12, fontFamily: "D-DIN" },
      splitLine: { lineStyle: { color: "rgba(182, 189, 202, 0.3)", type: [2, 2] } },
      nameTextStyle: { color: "#9E9E9E", fontSize: 12, padding: [0, 0, 0, 0], fontFamily: "AlibabaPuHuiTi-3" },
      minInterval: 1,
    },

  },
];
