import type { EChartsOption } from "echarts";
import Decimal from "decimal.js";
import { largestRemainderMethod } from "@/utils";

export function getOption(options: {
  data: { name: string; value: number }[];
  unit: string;
  colors: string[];
  title: string;
  subTitle: string;
}) {
  const { data = [], unit, colors, title, subTitle } = options;
  const total = data.reduce((total, item) => total.plus(item.value), new Decimal(0)).toNumber();

  const percentData = largestRemainderMethod(data, 2);

  return {
    color: colors,
    title: [
      // {
      //   left: "48%",
      //   top: "29%",
      //   text: `{value|${total}}{unit|${unit}}`,
      //   textStyle: {
      //     rich: {
      //       value: { fontSize: 16, color: "#fff", fontFamily: "D-DIN" },
      //       unit: { fontSize: 10, color: "#fff", fontFamily: "AlibabaPuHuiTi-3", verticalAlign: "middle", padding: [3, 0, 0, 2] },
      //     },
      //   },
      //   subtext: `{text|${subTitle}}`,
      //   subtextStyle: {
      //     rich: {
      //       text: { fontSize: 14, color: "#fff", fontFamily: "AlibabaPuHuiTi-3-medium", padding: [-8, 0, 0, 0] },
      //     },
      //   },
      // },
      {
        text: `{box|}{text|${title}}`,
        top: 25,
        left: 175,
        textStyle: {
          rich: {
            box: { backgroundColor: "#D45F5F", width: 2, height: 18 },
            text: { fontSize: 14, fontFamily: "AlibabaPuHuiTi-3-medium", color: "url(#assetsInfo_title)", fontWeight: 400, padding: [0, 0, 0, 5] },
          },
        },
      },
      {
        text: subTitle,
        top: 52,
        left: 59,
        textStyle: {
          fontSize: 12,
          fontFamily: "AlibabaPuHuiTi-3-medium",
          color: "#fff",
          fontWeight: 500,
        },
      },
      {
        text: total,
        top: 67,
        left: 59,
        textStyle: {
          fontSize: 12,
          fontFamily: "D-DIN",
          color: "#fff",
          fontWeight: 500,
        },
      },
      {
        text: `(${unit})`,
        top: 82,
        left: 59,
        textStyle: {
          fontSize: 10,
          fontFamily: "AlibabaPuHuiTi-3-medium",
          color: "#ffffff99",
          fontWeight: 500,
        },
      },
    ],
    tooltip: { trigger: "item", valueFormatter: (value: number) => `${value} ${unit}` },
    legend: {
      orient: "vertical",
      top: 50,
      left: 130,
      formatter(name) {
        const percent = percentData.find(item => item.name === name)?.percent;
        return `{name|${name}}{percent|${percent || 0}%}`;
      },
      data: data.map(({ name }, index) => ({
        name,
        textStyle: {
          // color: `url(#assetsInfo_${colors[index]})`,
          rich: {
            name: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "AlibabaPuHuiTi-3-medium",
              width: 75,
            },
            percent: {
              color: `url(#assetsInfo_${colors[index]})`,
              fontSize: 12,
              fontFamily: "D-DIN",
              width: 50,
              align: "right",
            },
          },
        },
      })),
    },
    series: [
      {
        name: title,
        type: "pie",
        radius: [39, 42],
        center: [64, "50%"],
        padAngle: 2,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { scale: false },
      },
      {
        name: title,
        type: "pie",
        radius: [33, 42],
        center: [64, "50%"],
        padAngle: 2,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data,
        emphasis: { scale: false },
        itemStyle: { opacity: 0.2 },
      },
    ],
  } as EChartsOption;
}
