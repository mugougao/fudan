// import to from "await-to-js";
// import { fetchCampusGate } from "@/api/campusAccess/campusSchool";
import { CampusId } from "@/enums";
import PoiLayer from "@/utils/WdpMap/code/PoiLayer.ts";

class CampusGatesPoiLayer extends PoiLayer<any> {
  readonly layerId: string = "campusGatesPoi";
  readonly layerName: string = "校园出入口大门";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId) {
    if (campusId === CampusId.Overview) return;

    // 硬编码校门POI数据，从tb_gate.csv中提取
    const hardcodedDataMap = {
      // 江湾校区 (campusId: "4")
      [CampusId.JiangWan]: [
        {
          id: "江湾园区1号门",
          name: "江湾园区1号门",
          location: [121.504567, 31.337464, 0] as [number, number, number],
          data: { mc: "江湾园区1号门" },
        },
        {
          id: "江湾主校区2号门",
          name: "江湾主校区2号门",
          location: [121.507939, 31.340644, 0] as [number, number, number],
          data: { mc: "江湾主校区2号门" },
        },
        {
          id: "江湾主校区5号门",
          name: "江湾主校区5号门",
          location: [121.497467, 31.338243, 0] as [number, number, number],
          data: { mc: "江湾主校区5号门" },
        },
        {
          id: "江湾主校区6号门",
          name: "江湾主校区6号门",
          location: [121.495622, 31.335164, 0] as [number, number, number],
          data: { mc: "江湾主校区6号门" },
        },
        {
          id: "江湾主校区4号门",
          name: "江湾主校区4号门",
          location: [121.503261, 31.344291, 0] as [number, number, number],
          data: { mc: "江湾主校区4号门" },
        },
        {
          id: "江湾主校区三号门",
          name: "江湾主校区三号门",
          location: [121.501412, 31.334036, 0] as [number, number, number],
          data: { mc: "江湾主校区三号门" },
        },
      ],
      // 邯郸校区 (campusId: "3")
      [CampusId.HanDan]: [
        {
          id: "邯郸-正门",
          name: "邯郸-正门",
          location: [121.499523, 31.298556, 0] as [number, number, number],
          data: { mc: "邯郸-正门" },
        },
        {
          id: "邯郸-东一门",
          name: "邯郸-东一门",
          location: [121.502525, 31.302942, 0] as [number, number, number],
          data: { mc: "邯郸-东一门" },
        },
        {
          id: "邯郸-国权路门",
          name: "邯郸-国权路门",
          location: [121.497818, 31.298281, 0] as [number, number, number],
          data: { mc: "邯郸-国权路门" },
        },
        {
          id: "邯郸-武东路门",
          name: "邯郸-武东路门",
          location: [121.493065, 31.304134, 0] as [number, number, number],
          data: { mc: "邯郸-武东路门" },
        },
        {
          id: "邯郸东区宿舍门",
          name: "邯郸东区宿舍门",
          location: [121.503128, 31.302628, 0] as [number, number, number],
          data: { mc: "邯郸东区宿舍门" },
        },
        {
          id: "邯郸南区政肃路门",
          name: "邯郸南区政肃路门",
          location: [121.499352, 31.295383, 0] as [number, number, number],
          data: { mc: "邯郸南区政肃路门" },
        },
        {
          id: "邯郸管理学院国福路",
          name: "邯郸管理学院国福路",
          location: [121.503265, 31.297695, 0] as [number, number, number],
          data: { mc: "邯郸管理学院国福路" },
        },
        {
          id: "邯郸南区政修路停车场门",
          name: "邯郸南区政修路停车场门",
          location: [121.500008, 31.293133, 0] as [number, number, number],
          data: { mc: "邯郸南区政修路停车场门" },
        },
        {
          id: "邯郸文科楼门",
          name: "邯郸文科楼门",
          location: [121.500275, 31.298134, 0] as [number, number, number],
          data: { mc: "邯郸文科楼门" },
        },
        {
          id: "邯郸-国顺路门",
          name: "邯郸-国顺路门",
          location: [121.500885, 31.299156, 0] as [number, number, number],
          data: { mc: "邯郸-国顺路门" },
        },
        {
          id: "邯郸管理学院国顺路门",
          name: "邯郸管理学院国顺路门",
          location: [121.501511, 31.298452, 0] as [number, number, number],
          data: { mc: "邯郸管理学院国顺路门" },
        },
        {
          id: "邯郸南区松花江路门岗",
          name: "邯郸南区松花江路门岗",
          location: [121.495956, 31.292635, 0] as [number, number, number],
          data: { mc: "邯郸南区松花江路门岗" },
        },
        {
          id: "邯郸东区新闻学院门",
          name: "邯郸东区新闻学院门",
          location: [121.506126, 31.300856, 0] as [number, number, number],
          data: { mc: "邯郸东区新闻学院门" },
        },
        {
          id: "邯郸五六教",
          name: "邯郸五六教",
          location: [121.500664, 31.297457, 0] as [number, number, number],
          data: { mc: "邯郸五六教" },
        },
        {
          id: "邯郸-东二门",
          name: "邯郸-东二门",
          location: [121.502723, 31.302532, 0] as [number, number, number],
          data: { mc: "邯郸-东二门" },
        },
        {
          id: "邯郸经济学院国权路门",
          name: "邯郸经济学院国权路门",
          location: [121.498749, 31.29698, 0] as [number, number, number],
          data: { mc: "邯郸经济学院国权路门" },
        },
        {
          id: "邯郸-经济学院",
          name: "邯郸-经济学院",
          location: [121.499298, 31.296862, 0] as [number, number, number],
          data: { mc: "邯郸-经济学院" },
        },
        {
          id: "邯郸新闻学院国定路门",
          name: "邯郸新闻学院国定路门",
          location: [121.503967, 31.301235, 0] as [number, number, number],
          data: { mc: "邯郸新闻学院国定路门" },
        },
        {
          id: "邯郸-武川路门",
          name: "邯郸-武川路门",
          location: [121.489906, 31.302862, 0] as [number, number, number],
          data: { mc: "邯郸-武川路门" },
        },
        {
          id: "邯郸-政通路宿舍门",
          name: "邯郸-政通路宿舍门",
          location: [121.504372, 31.303727, 0] as [number, number, number],
          data: { mc: "邯郸-政通路宿舍门" },
        },
        {
          id: "邯郸-18号线1号口（闸机手持）",
          name: "邯郸-18号线1号口（闸机手持）",
          location: [121.494095, 31.299057, 0] as [number, number, number],
          data: { mc: "邯郸-18号线1号口（闸机手持）" },
        },
      ],
    };

    // 根据校区ID获取对应数据
    const campusData = hardcodedDataMap[campusId as keyof typeof hardcodedDataMap] || [];
    this.setData(campusData);
  }

  async render(campusId: CampusId) {
    await this.removeAll();
    await this.fetchData(campusId);
    const poiList = Array.from(this.layerDataMap.values());
    const result = await this.add(poiList, "buildNew");
    await this.focusAll();
    return result;
  }
}

export default new CampusGatesPoiLayer();
