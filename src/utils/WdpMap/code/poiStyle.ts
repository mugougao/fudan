// POI 点位样式文件
import { env } from "@/utils/env.ts";

const assetsUrl = env.VITE_HTTP_ASSETS_URL;
const imagePath = (str: string) => `${assetsUrl}/markers${str}`;

const poiStyle = {
  default: {
    markerNormalUrl: imagePath("/default.png"),
    markerActivateUrl: imagePath("/default-active.png"),
    markerSize: [165, 136],
    markerOffset: [63, 0],
    labelContent: ["text"],
    labelStyle: { width: 110, height: 20, visible: true, offset: [30, 20], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 0 },
    specificLabelStyle: {
      content1: { width: 110, height: 20, fontSize: 32, padding: "0 0 0 0", color: "FFDADAFF" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  campus: {
    markerNormalUrl: imagePath("/campus.png"),
    markerActivateUrl: imagePath("/campus-active.png"),
    markerSize: [135, 105],
    markerOffset: [0, -10],
    labelContent: ["text"],
    labelStyle: { width: 80, height: 1, visible: true, offset: [-25, 85], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 0 },
    specificLabelStyle: {
      content1: { width: 80, height: 20, fontSize: 28, padding: "0 0 0 0", color: "ffffff" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  buildNew: {
    markerNormalUrl: imagePath("/buildNew.png"),
    markerActivateUrl: imagePath("/buildNew.png"),
    markerSize: [182, 135],
    markerOffset: [50, -10],
    labelContent: ["text"],
    labelStyle: { width: 110, height: 1, visible: true, offset: [0, 0], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 0 },
    specificLabelStyle: {
      content1: { width: 140, height: 20, fontSize: 26, padding: "-104 0 0 38", color: "ffffff" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  marker: {
    markerNormalUrl: imagePath("/poi.png"),
    markerActivateUrl: imagePath("/poi-active.png"),
    markerSize: [115, 48],
    markerOffset: [0, -10],
    labelContent: ["text"],
    labelStyle: { width: 100, height: 1, visible: true, offset: [-48, 0], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "center", autoWrap: false, animation: "rightToLeft", scrollSpeed: 0 },
    specificLabelStyle: {
      content1: { width: 100, height: 20, fontSize: 28, padding: "-30 0 0 0", color: "ffffff" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  buildNew_suffix: {
    markerNormalUrl: imagePath("/buildNew.png"),
    markerActivateUrl: imagePath("/buildNew.png"),
    markerSize: [182, 135],
    markerOffset: [50, -10],
    labelContent: ["texttexttext", "2台"],
    labelStyle: { width: 100, height: 1, visible: true, offset: [38, 0], zIndex: 1, background: ["00ff0000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 0 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 26, padding: "-105 0 0 0", color: "ffffff" },
      content2: { width: 100, height: 20, fontSize: 20, padding: "-121 0 0 60", color: "ffffff", scrollSpeed: 1, textAlign: "right" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 地标点样式
  landmark: {
    markerNormalUrl: imagePath("/landmark.png"),
    markerActivateUrl: imagePath("/landmark-active.png"),
    markerSize: [157, 108],
    markerOffset: [55, 0],
    labelContent: ["text"],
    labelStyle: { width: 110, height: 1, visible: true, offset: [0, 0], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 110, height: 20, fontSize: 28, padding: "-105 0 0 10", color: "FFDADAFF", scrollSpeed: 1 },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 地标点样式
  landmark2: {
    markerNormalUrl: imagePath("/landmark2.png"),
    markerActivateUrl: imagePath("/landmark2.png"),
    markerSize: [263, 43],
    markerOffset: [70, 0],
    labelContent: ["text"],
    labelStyle: { width: 160, height: 30, visible: true, offset: [0, 37], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 160, height: 30, fontSize: 26, padding: "3 0 0 0", color: "FFDADAFF" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  landmark_suffix: {
    markerNormalUrl: imagePath("/landmark.png"),
    markerActivateUrl: imagePath("/landmark-active.png"),
    markerSize: [157, 108],
    markerOffset: [55, 0],
    labelContent: ["text", "2台"],
    labelStyle: { width: 110, height: 1, visible: true, offset: [0, 0], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 26, padding: "-105 0 0 5", color: "FFDADAFF" },
      content2: { width: 110, height: 20, fontSize: 24, padding: "-123 0 0 60", color: "FFDADAFF", scrollSpeed: 0, textAlign: "right" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 建筑物点样式
  build: {
    markerNormalUrl: imagePath("/build.png"),
    markerActivateUrl: imagePath("/build.png"),
    markerSize: [210, 108],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 100, height: 30, visible: true, offset: [-5, 88], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 100, height: 30, fontSize: 36, padding: "3 0 0 0", color: "ACD7EFFF" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 组织点样式
  organ: {
    markerNormalUrl: imagePath("/organ.png"),
    markerActivateUrl: imagePath("/organ.png"),
    markerSize: [194, 180],
    markerOffset: [77, 0],
    labelContent: ["text"],
    labelStyle: { width: 130, height: 30, visible: true, offset: [25, 173], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 130, height: 30, fontSize: 32, padding: "3 0 0 0", color: "FFFFFFFF" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 公交 起点终点 样式
  busTerminal: {
    markerNormalUrl: imagePath("/busTerminal.png"),
    markerActivateUrl: imagePath("/busTerminal.png"),
    markerSize: [101, 86],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 80, height: 30, visible: true, offset: [-5, 83], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 80, height: 30, fontSize: 32, padding: "3 0 0 0", color: "D3FFF7" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 公交 起点终点 样式
  busNew: {
    markerNormalUrl: imagePath("/busNew.png"),
    markerActivateUrl: imagePath("/busNew.png"),
    markerSize: [155, 76],
    markerOffset: [37, 0],
    labelContent: ["text"],
    labelStyle: { width: 70, height: 20, visible: true, offset: [35, 50], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 80, height: 30, fontSize: 26, padding: "0 0 0 0", color: "ffffff" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  dormitory: {
    markerNormalUrl: imagePath("/dormitory.png"),
    markerActivateUrl: imagePath("/dormitory-active.png"),
    markerSize: [41, 48],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 70, height: 1, visible: true, offset: [-35, 40], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "center", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 70, height: 25, fontSize: 24, padding: "0 0 0 0", color: "FFFFFFFF" },
    },
    visible2D: {
      camera: { hideDistance: 1000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  dormitoryActive: {
    markerNormalUrl: imagePath("/dormitory-active.png"),
    markerActivateUrl: imagePath("/dormitory-active.png"),
    markerSize: [41, 48],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 70, height: 1, visible: true, offset: [-35, 40], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "center", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 70, height: 25, fontSize: 24, padding: "0 0 0 0", color: "FFFFFFFF" },
    },
    visible2D: {
      camera: { hideDistance: 1000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 宿舍楼
  dormitoryBuilding: {
    markerNormalUrl: imagePath("/dormitoryBuilding.png"),
    markerActivateUrl: imagePath("/dormitoryBuilding.png"),
    markerSize: [67, 33],
    markerOffset: [34, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 25, visible: true, offset: [8, 30], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 25, fontSize: 24, padding: "3 0 0 0", color: "FFFFFFFF" },
    },
    visible2D: {
      camera: { hideDistance: 1000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  dormitoryBuilding_red: {
    markerNormalUrl: imagePath("/dormitoryBuilding-red.png"),
    markerActivateUrl: imagePath("/dormitoryBuilding-red.png"),
    markerSize: [67, 33],
    markerOffset: [34, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 25, visible: true, offset: [8, 30], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 25, fontSize: 24, padding: "3 0 0 0", color: "FFFFFFFF" },
    },
    visible2D: {
      camera: { hideDistance: 1000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 电动自行车
  eBikes_red: {
    markerNormalUrl: imagePath("/eBikes_red.png"),
    markerActivateUrl: imagePath("/eBikes_red.png"),
    markerSize: [67, 67],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "FFDCD8" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 电动汽车
  ev_red: {
    markerNormalUrl: imagePath("/ev_red.png"),
    markerActivateUrl: imagePath("/ev_red.png"),
    markerSize: [67, 67],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "FFDCD8" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 电动汽车
  eBikes_green: {
    markerNormalUrl: imagePath("/eBikes_green.png"),
    markerActivateUrl: imagePath("/eBikes_green.png"),
    markerSize: [67, 67],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "FFDCD8" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 电动汽车
  ev_green: {
    markerNormalUrl: imagePath("/ev_green.png"),
    markerActivateUrl: imagePath("/ev_green.png"),
    markerSize: [67, 67],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "FFDCD8" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 电动自行车
  eBikes_yellow: {
    markerNormalUrl: imagePath("/eBikes_yellow.png"),
    markerActivateUrl: imagePath("/eBikes_yellow.png"),
    markerSize: [67, 67],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "FFDCD8" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  // 电动汽车
  ev_yellow: {
    markerNormalUrl: imagePath("/ev_yellow.png"),
    markerActivateUrl: imagePath("/ev_yellow.png"),
    markerSize: [67, 67],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "FFDCD8" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  offLineNetworkDevice: {
    markerNormalUrl: imagePath("/offLineNetworkDevice.png"),
    markerActivateUrl: imagePath("/offLineNetworkDevice.png"),
    markerSize: [76, 76],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  onLineNetworkDevice: {
    markerNormalUrl: imagePath("/onLineNetworkDevice.png"),
    markerActivateUrl: imagePath("/onLineNetworkDevice.png"),
    markerSize: [76, 76],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 80], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  chinaBank: {
    markerNormalUrl: imagePath("/BOC.png"),
    markerActivateUrl: imagePath("/BOC.png"),
    markerSize: [55, 81],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 100], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  agricultureBank: {
    markerNormalUrl: imagePath("/ABC.png"),
    markerActivateUrl: imagePath("/ABC.png"),
    markerSize: [55, 81],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 100], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  postalBank: {
    markerNormalUrl: imagePath("/PSBC.png"),
    markerActivateUrl: imagePath("/PSBC.png"),
    markerSize: [55, 81],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 100], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  cardReplacementMachine: {
    markerNormalUrl: imagePath("/cardReplacementMachine.png"),
    markerActivateUrl: imagePath("/cardReplacementMachine.png"),
    markerSize: [55, 81],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 100], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
  selfServiceExpenseReportKiosk: {
    markerNormalUrl: imagePath("/selfServiceExpenseReportKiosk.png"),
    markerActivateUrl: imagePath("/selfServiceExpenseReportKiosk.png"),
    markerSize: [55, 81],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 60, height: 20, visible: true, offset: [-30, 100], zIndex: 0, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 60, height: 20, fontSize: 14, padding: "0 0 0 0", color: "D9D9D9" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  },
};

const labelMap = {
  "shop": "超市购物",
  "library": "图书馆",
  "campus-AED": "校园AED",
  "sports-halls": "运动场馆",
  "metro": "地铁站",
  "cultural-landmark": "文化地标",
  "card": "一卡通自助补卡机",
  "hotels": "周边酒店",
  "scientific-research": "科研机构",
  "cultural-sports-facilities": "文体设施",
  "bathroom": "学生浴室",
  "accommodation-catering": "住宿餐饮",
  "building-construction": "楼宇建筑",
  "school-gate": "校门",
  "delivery-machine": "自助报账投递机",
  "live-park": "生活园区",
  "parking-lot": "校区停车场",
  "hospital-AED": "医院AED",
  "self-service-printers": "自助打印机",
  "bookstore": "书店",
  "bank": "校区银行",
  "dept": "院系部处",
  "bus": "校车上车点",
  "transportation": "交通出行",
  // "chinaBank": "中国银行",
  // "agricultureBank": "农业银行",
  // "postalBank": "中国邮政",
} as const;

Object.keys(labelMap).forEach((key) => {
  poiStyle[key] = {
    markerNormalUrl: imagePath(`/${key}.png`),
    markerActivateUrl: imagePath(`/${key}.png`),
    markerSize: [210, 96],
    markerOffset: [0, 0],
    labelContent: ["text"],
    labelStyle: { width: 100, height: 30, visible: true, offset: [-5, 88], zIndex: 1, background: ["ff000000"] },
    generalLabelStyle: { textAlign: "left", autoWrap: false, animation: "rightToLeft", scrollSpeed: 1 },
    specificLabelStyle: {
      content1: { width: 100, height: 30, fontSize: 36, padding: "3 0 0 0", color: "ACD7EFFF" },
    },
    visible2D: {
      camera: { hideDistance: 30000, hideType: "default", scaleMode: "2D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  };
});

export const poiTypeTextStyleMap: Record<string, string> = {
  默认: "default",
  地标点: "buildNew",
  建筑物点: "build",
  区域: "region",
  组织点: "organ",
};
Object.entries(labelMap).forEach(([key, value]) => {
  poiTypeTextStyleMap[value] = key;
});

export default poiStyle;
