import to from "await-to-js";
import { getLandmark } from "@/api/campusStyle/index.ts";
import TextLayer from "../code/TextLayer.ts";
import cameraInfo from "./RoamingRoutePoiCameraInfo.json";

class RoamingRouteTextLayer extends TextLayer<any> {
  layerId: string = "RoamingRouteTextLayer";
  layerName: string = "漫游路线Text图层";

  typeMap = { 1: "经典打卡", 2: "study tour", 3: "拥抱自然" };

  async fetchData(type: "1" | "2" | "3") {
    const _type = this.typeMap[type];
    const [err, res] = await to(getLandmark(_type));
    if (err) {
      window.$message.error(`${this.layerName}-数据获取失败!!!`);
      return;
    }
    if (!res?.resultData) {
      window.$message.warning(`暂无${_type}数据!!!`);
      return;
    }
    const { features = [] } = res.resultData;
    this.setData(features.map((item: any) => {
      const { geometry, properties } = item;
      const { coordinates } = geometry;
      const { dbmc, id } = properties;
      return {
        id,
        name: dbmc,
        location: [...coordinates],
        scale3d: [10, 3, 3],
        rotator: {
          pitch: 0,
          yaw: cameraInfo.find(item => item.id === id)?.rotation?.yaw ?? 60,
          roll: 0,
        },
        data: item.properties,
      };
    }));
  }

  async render(type: "1" | "2" | "3") {
    await this.fetchData(type);
    await this.add(Array.from(this.layerDataMap.values()), "roamingRoute", { coordZOffset: 2 });
  }

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }
}

export default new RoamingRouteTextLayer();
