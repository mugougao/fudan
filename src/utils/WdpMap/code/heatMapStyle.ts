const heatMapStyle = {
  default: {
    type: "fit",
    brushDiameter: 300,
    mappingValueRange: [1, 100],
    gradientSetting: ["00ffff", "fdff00", "009fff", "f300ff", "ff0000"],
  },
};

export type IHeatMapStyleKey = keyof typeof heatMapStyle;

export default heatMapStyle;
