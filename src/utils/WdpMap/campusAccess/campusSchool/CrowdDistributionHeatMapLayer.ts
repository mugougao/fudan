import to from "await-to-js";
import { fetchCampusFlowDistributionHeatMap } from "@/api/campusAccess/campusSchool";
import { CampusId, campusIdToName } from "@/enums";
import HeatMapLayer from "@/utils/WdpMap/code/HeatMapLayer";

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
    const [,res] = await to(fetchCampusFlowDistributionHeatMap(campusIdToName(campusId)));
    const result = {
      id: campusId,
      name: campusIdToName(campusId),
      mapdata: (res?.resultData ?? [])
        .filter(item => Boolean(item.geom))
        .map((item: any) => {
          const { geom, value } = item;
          const [x, y] = geom.replace("POINT(", "").replace(")", "").split(" ").map(val => Number(val));
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
