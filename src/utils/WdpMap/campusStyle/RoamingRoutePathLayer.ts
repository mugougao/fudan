import to from "await-to-js";
import { getTourRoute } from "@/api/campusStyle/index.ts";
import PathLayer from "../code/PathLayer.ts";

class RoamingRoutePathLayer extends PathLayer<any> {
  layerId: string = "RoamingRoutePathLayer";
  layerName: string = "漫游路线Path图层";

  typeMap = { 1: "经典打卡", 2: "study tour", 3: "拥抱自然" };

  async fetchData(id: "1" | "2" | "3") {
    const [err, res] = await to(getTourRoute(Number(id)));

    if (err) {
      window.$message.error(`${this.layerName}-数据获取失败!!!`);
      return;
    }
    if (!res?.resultData) {
      window.$message.warning(`暂无${this.typeMap[id]}数据!!!`);
      return;
    }

    this.setData(
      res?.resultData?.features.map((item: any) => {
        const { properties } = item;
        const { id, mc } = properties;
        return {
          id,
          name: mc,
          coordinates: item?.geometry?.coordinates.flat(1),
          data: properties,
        };
      }),
    );
  }

  async render(type: "1" | "2" | "3") {
    await this.fetchData(type);
    const list = Array.from(this.layerDataMap.values());
    await this.add(list, "roamingRoute", { coordZOffset: 1 });
    this.fly();
  }

  fly() {
    this.focusAll({ rotation: { pitch: -90 }, distanceFactor: 0.6 });
  }

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }
}

export default new RoamingRoutePathLayer();
