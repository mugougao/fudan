const pathStyle = {
  roamingRoute: {
    type: "arrow_dashed",
    width: 26,
    color: "5FACFF",
    passColor: "FF1F1FCC",
  },
  bus: {
    type: "arrow",
    width: 50,
    color: "c0392b",
    passColor: "ff0000",
  },
};

export type IPathStyle = keyof typeof pathStyle;

export default pathStyle;
