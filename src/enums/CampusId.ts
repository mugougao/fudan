export enum CampusId {
  Overview = "0", // 概览
  HanDan = "3", // 邯郸
  JiangWan = "4", // 江湾
  FengLin = "1", // 枫林
  ZhangJiang = "2", // 张江
}

export const CampusName = {
  [CampusId.Overview]: "概览",
  [CampusId.HanDan]: "邯郸",
  [CampusId.JiangWan]: "江湾",
  [CampusId.FengLin]: "枫林",
  [CampusId.ZhangJiang]: "张江",
} as Record<CampusId, string>;


export const cumpusOptions = [
  { label: CampusName[CampusId.HanDan], value: CampusId.HanDan },
  { label: CampusName[CampusId.JiangWan], value: CampusId.JiangWan },
  { label: CampusName[CampusId.FengLin], value: CampusId.FengLin },
  { label: CampusName[CampusId.ZhangJiang], value: CampusId.ZhangJiang }
]

export function campusIdFormat(campusId: CampusId, suffix: string = "校区") {
  if (campusId === CampusId.Overview) return "";
  return `${CampusName[campusId]}${suffix}`;
}

export function campusNameToId(name: string) {
  return Object
    .entries(CampusName)
    .find(([, campusName]) => name.startsWith(campusName))
    ?.[0] as CampusId;
}

export function campusIdToName(campusId: CampusId, suffix: string | boolean = true) {
  const name = CampusName[campusId];
  if (typeof suffix === "string") return `${name}${suffix}`;
  if (!suffix) return name;
  return `${name}校区`;
}

const sortCampusId = [
  CampusId.HanDan,
  CampusId.JiangWan,
  CampusId.FengLin,
  CampusId.ZhangJiang,
];
export const sortCampusName = sortCampusId.map(id => CampusName[id]);
export const sortCampusFnById = (id1: CampusId & string, id2: CampusId & string) => sortCampusId.indexOf(id1) - sortCampusId.indexOf(id2);
export const sortCampusFnByName = (name1: string, name2: string) => sortCampusName.indexOf(name1) - sortCampusName.indexOf(name2);
