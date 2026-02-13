import to from "await-to-js";
import { fetchCampusFlowDistributionHeatMap } from "@/api/campusAccess/campusSchool";
import { CampusId, campusIdToName } from "@/enums";
import HeatMapLayer from "@/utils/WdpMap/code/HeatMapLayer";

// 硬编码的出入口热力数据
const MOCK_HEAT_MAP_DATA = {
  "邯郸校区": [
    { name: "邯郸-正门", geom: [121.499523,31.298556], value: 100 },
    { name: "邯郸-东一门", geom: [121.502525,31.302942], value: 95 },
    { name: "南区松花江路", geom: [121.495956,31.292635], value: 50 },
    { name: "邯郸-国权路门", geom: [121.497818,31.298281], value: 60 },
    { name: "邯郸-武东路门", geom: [121.493065,31.304134], value: 33 },
    { name: "邯郸东区宿舍门", geom: [121.503128,31.302628], value: 22 },
    { name: "邯郸南区政肃路门", geom: [121.499352,31.295383], value: 10 },
    { name: "邯郸管理学院国福路", geom: [121.503265,31.297695], value: 60 },
    { name: "邯郸南区政修路停车场门", geom: [121.500008,31.293133], value: 10 },
    { name: "邯郸文科楼门", geom: [121.500275,31.298134], value: 90 },
    { name: "邯郸-国顺路门", geom: [121.500885,31.299156], value: 50 },
    { name: "经济学院国权路门", geom: [121.498749,31.29698], value: 30 },
    { name: "邯郸管理学院国顺路门", geom: [121.501511,31.298452], value: 50 },
    { name: "邯郸南区松花江路门岗", geom: [121.495956,31.292635], value: 30 },
    { name: "邯郸东区新闻学院门", geom: [121.506126,31.300856], value: 60 },
    { name: "邯郸五六教", geom: [121.500664,31.297457], value: 10 },
    { name: "邯郸-东二门", geom: [121.502723,31.302532], value: 50 },
    { name: "邯郸经济学院国权路门", geom: [121.498749,31.29698], value: 30 },
    { name: "邯郸-经济学院", geom: [121.499298,31.296862], value: 36 },
    { name: "邯郸新闻学院国定路门", geom: [121.503967,31.301235], value: 20 },
    { name: "邯郸-武川路门", geom: [121.489906,31.302862], value: 26 },
    { name: "邯郸-政通路宿舍门", geom: [121.504372,31.303727], value: 30 },
    { name: "邯郸-18号线1号口（闸机手持）", geom: [121.494095,31.299057], value: 36 },
  ],
  "江湾校区": [
    { name: "江湾园区1号门", geom: [121.504567,31.337464], value: 40 },
    { name: "江湾主校区2号门", geom: [121.507939,31.340644], value: 40 },
    { name: "江湾主校区5号门", geom: [121.497467,31.338243], value: 90 },
    { name: "江湾主校区6号门", geom: [121.495622,31.335164], value: 80 },
    { name: "江湾主校区4号门", geom: [121.503261,31.344291], value: 70 },
    { name: "江湾主校区三号门", geom: [121.501412,31.334036], value: 60 },
  ],
};

class CrowdDistributionHeatMapLayer extends HeatMapLayer<any> {
  readonly layerId: string = "crowdDistributionHeatMapLayer";
  readonly layerName: string = "人流分布热力图";

  onCreate() {
  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId) {
    if (campusId === CampusId.Overview) return;
    this.clearData();
    
    console.log("🗺️ [热力图] 🚫 API调用已注释，使用硬编码数据");
    
    // 🚫 注释掉API调用，直接使用硬编码数据
    const campusName = campusIdToName(campusId);
    const mockData = MOCK_HEAT_MAP_DATA[campusName as keyof typeof MOCK_HEAT_MAP_DATA] || [];
    
    console.log("✅ [热力图] 硬编码数据加载完成:", {
      校区名称: campusName,
      出入口数量: mockData.length,
    });

    /* // 原API调用逻辑已注释
    const [,res] = await to(fetchCampusFlowDistributionHeatMap(campusIdToName(campusId)));
    const mockData = res?.resultData ?? [];
    */

    const result = {
      id: campusId,
      name: campusName,
      mapdata: mockData
        .filter(item => Boolean(item.geom))
        .map((item: any) => {
          const { geom, value } = item;
          const [x, y] = geom
          return {
            point: [x, y, 0] as [number, number, number],
            value: value ?? 0,
          };
        }),
      data: {},
    };
    this.setData([result]);
  }

  async render(campusId: CampusId) {
    // 清除上次渲染
    await this.removeAll();
    // 获取数据
    await this.fetchData(campusId);
    const data = Array.from(this.layerDataMap.values())?.[0];
    if (!data) return;
    const result = await this.add(data, "default");
    this.focus(data.id, { rotation: { pitch: -90, yaw: -90 }, distanceFactor: 1 });
    return result;
  }
}

export default new CrowdDistributionHeatMapLayer();
