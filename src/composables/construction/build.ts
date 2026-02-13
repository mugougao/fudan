import type { FetchBuildResultItem } from "@/api/construction/build.ts";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus";

export function useBuildListParamsOptions() {
  const { activeCampusId } = useCampusStore();

  const mockBuildQueryOptionsData: Record<CampusId, { area: string[]; type: string[] }> = {
    [CampusId.Overview]: {
      area: ["主校区", "东区", "西区", "北区", "南区"],
      type: ["教学楼", "实验楼", "办公楼", "宿舍楼", "图书馆", "体育馆", "食堂"],
    },
    [CampusId.HanDan]: {
      area: ["光华楼区", "图书馆区", "教学区", "实验区", "生活区", "运动区"],
      type: ["教学楼", "实验楼", "办公楼", "宿舍楼", "图书馆", "体育馆", "食堂", "行政楼"],
    },
    [CampusId.JiangWan]: {
      area: ["法学区", "环境科学区", "生命科学区", "物理区", "图书馆区", "生活区"],
      type: ["教学楼", "实验楼", "办公楼", "宿舍楼", "图书馆", "体育馆", "食堂"],
    },
    [CampusId.FengLin]: {
      area: ["医学实验区", "基础医学区", "临床医学区", "药学区", "图书馆区", "生活区"],
      type: ["教学楼", "实验楼", "办公楼", "宿舍楼", "图书馆", "体育馆", "食堂", "医院楼"],
    },
    [CampusId.ZhangJiang]: {
      area: ["微电子区", "软件工程区", "计算机科学区", "网络安全区", "图书馆区", "生活区"],
      type: ["教学楼", "实验楼", "办公楼", "宿舍楼", "图书馆", "体育馆", "食堂", "研发楼"],
    },
  };

  const { state, execute } = useAsyncState<{
    areaOptions: { label: string; value: string }[];
    typeOptions: { label: string; value: string }[];
  }>(
    async () => {
      // 注释掉API调用，使用模拟数据
      // const [err, res] = await to(fetchBuildQueryOptions(activeCampusId));
      // if (err) return { areaOptions: [], typeOptions: [] };
      // const { area = [], type = [] } = res?.resultData || {};
      const campusData = mockBuildQueryOptionsData[activeCampusId] || mockBuildQueryOptionsData[CampusId.HanDan];
      const { area = [], type = [] } = campusData;
      return {
        areaOptions: area.map(item => ({ label: item, value: item })),
        typeOptions: type.map(item => ({ label: item, value: item })),
      };
    },
    { areaOptions: [], typeOptions: [] },
    { immediate: true },
  );

  watch(() => activeCampusId, () => execute());

  const { areaOptions, typeOptions } = toRefs(toReactive(state));

  return {
    areaOptions,
    typeOptions,
    execute,
  };
}

export function useBuildList() {
  const params = ref<{ name: string; area: string | undefined; type: string | undefined }>({ name: "", area: undefined, type: undefined });
  const current = ref<number>(1);

  const { activeCampusId } = useCampusStore();

  const mockBuildListData: Record<CampusId, { list: FetchBuildResultItem[]; total: number }> = {
    [CampusId.Overview]: {
      total: 35,
      list: [
        { id: "1", name: "光华楼", area: "主校区", level: "高层", x: 121.506, y: 31.299 },
        { id: "2", name: "图书馆", area: "主校区", level: "高层", x: 121.505, y: 31.298 },
        { id: "3", name: "理科图书馆", area: "东区", level: "中层", x: 121.507, y: 31.300 },
        { id: "4", name: "教学楼A", area: "教学区", level: "中层", x: 121.504, y: 31.297 },
        { id: "5", name: "实验楼B", area: "实验区", level: "中层", x: 121.508, y: 31.301 },
        { id: "6", name: "办公楼", area: "行政区", level: "高层", x: 121.503, y: 31.296 },
        { id: "7", name: "宿舍楼1", area: "生活区", level: "高层", x: 121.502, y: 31.295 },
        { id: "8", name: "体育馆", area: "运动区", level: "低层", x: 121.509, y: 31.302 },
        { id: "9", name: "食堂一", area: "生活区", level: "低层", x: 121.501, y: 31.294 },
        { id: "10", name: "行政楼", area: "行政区", level: "高层", x: 121.500, y: 31.293 },
        { id: "11", name: "教学楼B", area: "教学区", level: "中层", x: 121.510, y: 31.303 },
        { id: "12", name: "实验楼C", area: "实验区", level: "中层", x: 121.511, y: 31.304 },
        { id: "13", name: "图书馆分馆", area: "西区", level: "中层", x: 121.512, y: 31.305 },
        { id: "14", name: "宿舍楼2", area: "生活区", level: "高层", x: 121.513, y: 31.306 },
        { id: "15", name: "体育馆分馆", area: "北区", level: "低层", x: 121.514, y: 31.307 },
        { id: "16", name: "食堂二", area: "南区", level: "低层", x: 121.515, y: 31.308 },
        { id: "17", name: "科研楼", area: "实验区", level: "高层", x: 121.516, y: 31.309 },
        { id: "18", name: "教学楼C", area: "教学区", level: "中层", x: 121.517, y: 31.310 },
        { id: "19", name: "实验楼D", area: "实验区", level: "中层", x: 121.518, y: 31.311 },
        { id: "20", name: "办公楼B", area: "行政区", level: "高层", x: 121.519, y: 31.312 },
        { id: "21", name: "宿舍楼3", area: "生活区", level: "高层", x: 121.520, y: 31.313 },
        { id: "22", name: "体育馆C", area: "运动区", level: "低层", x: 121.521, y: 31.314 },
        { id: "23", name: "食堂三", area: "生活区", level: "低层", x: 121.522, y: 31.315 },
        { id: "24", name: "行政楼C", area: "行政区", level: "高层", x: 121.523, y: 31.316 },
        { id: "25", name: "教学楼D", area: "教学区", level: "中层", x: 121.524, y: 31.317 },
        { id: "26", name: "实验楼E", area: "实验区", level: "中层", x: 121.525, y: 31.318 },
        { id: "27", name: "图书馆C", area: "东区", level: "中层", x: 121.526, y: 31.319 },
        { id: "28", name: "宿舍楼4", area: "生活区", level: "高层", x: 121.527, y: 31.320 },
        { id: "29", name: "体育馆D", area: "北区", level: "低层", x: 121.528, y: 31.321 },
        { id: "30", name: "食堂四", area: "南区", level: "低层", x: 121.529, y: 31.322 },
        { id: "31", name: "科研楼B", area: "实验区", level: "高层", x: 121.530, y: 31.323 },
        { id: "32", name: "教学楼E", area: "教学区", level: "中层", x: 121.531, y: 31.324 },
        { id: "33", name: "实验楼F", area: "实验区", level: "中层", x: 121.532, y: 31.325 },
        { id: "34", name: "办公楼D", area: "行政区", level: "高层", x: 121.533, y: 31.326 },
        { id: "35", name: "宿舍楼5", area: "生活区", level: "高层", x: 121.534, y: 31.327 },
      ],
    },
    [CampusId.HanDan]: {
      total: 25,
      list: [
        { id: "hd-1", name: "光华楼", area: "光华楼区", level: "高层", x: 121.506, y: 31.299 },
        { id: "hd-2", name: "邯郸图书馆", area: "图书馆区", level: "高层", x: 121.505, y: 31.298 },
        { id: "hd-3", name: "数学楼", area: "教学区", level: "中层", x: 121.507, y: 31.300 },
        { id: "hd-4", name: "物理楼", area: "教学区", level: "中层", x: 121.504, y: 31.297 },
        { id: "hd-5", name: "化学实验楼", area: "实验区", level: "中层", x: 121.508, y: 31.301 },
        { id: "hd-6", name: "行政楼", area: "行政区", level: "高层", x: 121.503, y: 31.296 },
        { id: "hd-7", name: "学生宿舍1号楼", area: "生活区", level: "高层", x: 121.502, y: 31.295 },
        { id: "hd-8", name: "体育馆", area: "运动区", level: "低层", x: 121.509, y: 31.302 },
        { id: "hd-9", name: "第一食堂", area: "生活区", level: "低层", x: 121.501, y: 31.294 },
        { id: "hd-10", name: "教务处", area: "行政区", level: "中层", x: 121.500, y: 31.293 },
        { id: "hd-11", name: "外语楼", area: "教学区", level: "中层", x: 121.510, y: 31.303 },
        { id: "hd-12", name: "生物实验楼", area: "实验区", level: "中层", x: 121.511, y: 31.304 },
        { id: "hd-13", name: "文科图书馆", area: "图书馆区", level: "中层", x: 121.512, y: 31.305 },
        { id: "hd-14", name: "学生宿舍2号楼", area: "生活区", level: "高层", x: 121.513, y: 31.306 },
        { id: "hd-15", name: "游泳馆", area: "运动区", level: "低层", x: 121.514, y: 31.307 },
        { id: "hd-16", name: "第二食堂", area: "生活区", level: "低层", x: 121.515, y: 31.308 },
        { id: "hd-17", name: "科研中心", area: "实验区", level: "高层", x: 121.516, y: 31.309 },
        { id: "hd-18", name: "经济学院", area: "教学区", level: "中层", x: 121.517, y: 31.310 },
        { id: "hd-19", name: "环境实验楼", area: "实验区", level: "中层", x: 121.518, y: 31.311 },
        { id: "hd-20", name: "研究生院", area: "行政区", level: "高层", x: 121.519, y: 31.312 },
        { id: "hd-21", name: "留学生公寓", area: "生活区", level: "高层", x: 121.520, y: 31.313 },
        { id: "hd-22", name: "篮球馆", area: "运动区", level: "低层", x: 121.521, y: 31.314 },
        { id: "hd-23", name: "清真食堂", area: "生活区", level: "低层", x: 121.522, y: 31.315 },
        { id: "hd-24", name: "国际交流处", area: "行政区", level: "中层", x: 121.523, y: 31.316 },
        { id: "hd-25", name: "法学院", area: "教学区", level: "中层", x: 121.524, y: 31.317 },
      ],
    },
    [CampusId.JiangWan]: {
      total: 20,
      list: [
        { id: "jw-1", name: "江湾图书馆", area: "图书馆区", level: "高层", x: 121.506, y: 31.299 },
        { id: "jw-2", name: "法学楼", area: "法学区", level: "高层", x: 121.505, y: 31.298 },
        { id: "jw-3", name: "环境科学楼", area: "环境科学区", level: "中层", x: 121.507, y: 31.300 },
        { id: "jw-4", name: "生命科学楼", area: "生命科学区", level: "中层", x: 121.504, y: 31.297 },
        { id: "jw-5", name: "物理楼", area: "物理区", level: "中层", x: 121.508, y: 31.301 },
        { id: "jw-6", name: "行政楼", area: "行政区", level: "高层", x: 121.503, y: 31.296 },
        { id: "jw-7", name: "学生宿舍A", area: "生活区", level: "高层", x: 121.502, y: 31.295 },
        { id: "jw-8", name: "体育馆", area: "运动区", level: "低层", x: 121.509, y: 31.302 },
        { id: "jw-9", name: "食堂", area: "生活区", level: "低层", x: 121.501, y: 31.294 },
        { id: "jw-10", name: "教务处", area: "行政区", level: "中层", x: 121.500, y: 31.293 },
        { id: "jw-11", name: "化学楼", area: "环境科学区", level: "中层", x: 121.510, y: 31.303 },
        { id: "jw-12", name: "地球科学楼", area: "环境科学区", level: "中层", x: 121.511, y: 31.304 },
        { id: "jw-13", name: "文科图书馆", area: "图书馆区", level: "中层", x: 121.512, y: 31.305 },
        { id: "jw-14", name: "学生宿舍B", area: "生活区", level: "高层", x: 121.513, y: 31.306 },
        { id: "jw-15", name: "游泳馆", area: "运动区", level: "低层", x: 121.514, y: 31.307 },
        { id: "jw-16", name: "第二食堂", area: "生活区", level: "低层", x: 121.515, y: 31.308 },
        { id: "jw-17", name: "科研中心", area: "实验区", level: "高层", x: 121.516, y: 31.309 },
        { id: "jw-18", name: "国际法学院", area: "法学区", level: "中层", x: 121.517, y: 31.310 },
        { id: "jw-19", name: "生态实验楼", area: "环境科学区", level: "中层", x: 121.518, y: 31.311 },
        { id: "jw-20", name: "研究生公寓", area: "生活区", level: "高层", x: 121.519, y: 31.312 },
      ],
    },
    [CampusId.FengLin]: {
      total: 18,
      list: [
        { id: "fl-1", name: "枫林图书馆", area: "图书馆区", level: "高层", x: 121.506, y: 31.299 },
        { id: "fl-2", name: "医学实验楼", area: "医学实验区", level: "高层", x: 121.505, y: 31.298 },
        { id: "fl-3", name: "基础医学楼", area: "基础医学区", level: "中层", x: 121.507, y: 31.300 },
        { id: "fl-4", name: "临床医学楼", area: "临床医学区", level: "中层", x: 121.504, y: 31.297 },
        { id: "fl-5", name: "药学楼", area: "药学区", level: "中层", x: 121.508, y: 31.301 },
        { id: "fl-6", name: "行政楼", area: "行政区", level: "高层", x: 121.503, y: 31.296 },
        { id: "fl-7", name: "学生宿舍", area: "生活区", level: "高层", x: 121.502, y: 31.295 },
        { id: "fl-8", name: "体育馆", area: "运动区", level: "低层", x: 121.509, y: 31.302 },
        { id: "fl-9", name: "食堂", area: "生活区", level: "低层", x: 121.501, y: 31.294 },
        { id: "fl-10", name: "教务处", area: "行政区", level: "中层", x: 121.500, y: 31.293 },
        { id: "fl-11", name: "护理学院", area: "基础医学区", level: "中层", x: 121.510, y: 31.303 },
        { id: "fl-12", name: "公共卫生楼", area: "基础医学区", level: "中层", x: 121.511, y: 31.304 },
        { id: "fl-13", name: "医学图书馆", area: "图书馆区", level: "中层", x: 121.512, y: 31.305 },
        { id: "fl-14", name: "研究生宿舍", area: "生活区", level: "高层", x: 121.513, y: 31.306 },
        { id: "fl-15", name: "游泳馆", area: "运动区", level: "低层", x: 121.514, y: 31.307 },
        { id: "fl-16", name: "第二食堂", area: "生活区", level: "低层", x: 121.515, y: 31.308 },
        { id: "fl-17", name: "科研中心", area: "医学实验区", level: "高层", x: 121.516, y: 31.309 },
        { id: "fl-18", name: "附属医院楼", area: "临床医学区", level: "高层", x: 121.517, y: 31.310 },
      ],
    },
    [CampusId.ZhangJiang]: {
      total: 15,
      list: [
        { id: "zj-1", name: "张江图书馆", area: "图书馆区", level: "高层", x: 121.506, y: 31.299 },
        { id: "zj-2", name: "微电子楼", area: "微电子区", level: "高层", x: 121.505, y: 31.298 },
        { id: "zj-3", name: "软件工程楼", area: "软件工程区", level: "中层", x: 121.507, y: 31.300 },
        { id: "zj-4", name: "计算机科学楼", area: "计算机科学区", level: "中层", x: 121.504, y: 31.297 },
        { id: "zj-5", name: "网络安全楼", area: "网络安全区", level: "中层", x: 121.508, y: 31.301 },
        { id: "zj-6", name: "行政楼", area: "行政区", level: "高层", x: 121.503, y: 31.296 },
        { id: "zj-7", name: "学生宿舍", area: "生活区", level: "高层", x: 121.502, y: 31.295 },
        { id: "zj-8", name: "体育馆", area: "运动区", level: "低层", x: 121.509, y: 31.302 },
        { id: "zj-9", name: "食堂", area: "生活区", level: "低层", x: 121.501, y: 31.294 },
        { id: "zj-10", name: "教务处", area: "行政区", level: "中层", x: 121.500, y: 31.293 },
        { id: "zj-11", name: "人工智能楼", area: "软件工程区", level: "中层", x: 121.510, y: 31.303 },
        { id: "zj-12", name: "数据科学楼", area: "计算机科学区", level: "中层", x: 121.511, y: 31.304 },
        { id: "zj-13", name: "电子工程楼", area: "微电子区", level: "中层", x: 121.512, y: 31.305 },
        { id: "zj-14", name: "研究生公寓", area: "生活区", level: "高层", x: 121.513, y: 31.306 },
        { id: "zj-15", name: "研发中心", area: "研发区", level: "高层", x: 121.514, y: 31.307 },
      ],
    },
  };

  const { state, execute } = useAsyncState(
    async () => {
      // 注释掉API调用，使用模拟数据
      // const [err, res] = await to(fetchBuildList({ xq: activeCampusId, pageNum: current.value, pageSize: 10, ...params.value }));
      // if (err) return { list: [], total: 0 };
      // const { list, total } = res?.resultData || {};

      // 获取当前校区的模拟数据
      const campusData = mockBuildListData[activeCampusId] || mockBuildListData[CampusId.HanDan];
      let filteredList = [...campusData.list];
      const { name, area, type } = params.value;

      // 模拟搜索和过滤功能
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (area) {
        filteredList = filteredList.filter(item => item.area === area);
      }
      if (type) {
        // 类型过滤需要根据类型映射，这里简化为区域包含类型关键词
        filteredList = filteredList.filter(item => item.area.includes(type) || item.name.includes(type));
      }

      // 模拟分页
      const total = filteredList.length;
      const startIndex = (current.value - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedList = filteredList.slice(startIndex, endIndex);

      return { list: paginatedList, total };
    },
    { list: [], total: 0 },
    { immediate: true, resetOnExecute: false },
  );

  const search = () => {
    current.value = 1;
    execute();
  };

  watch(() => current.value, () => execute());
  watch(() => activeCampusId, () => search());

  const { list, total } = toRefs(toReactive(state));

  return { params, list, total, search, current, execute };
}
