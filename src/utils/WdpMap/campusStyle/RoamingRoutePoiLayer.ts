import to from "await-to-js";
import { pick } from "lodash";
import { getLandmark } from "@/api/campusStyle/index.ts";
import PoiLayer from "../code/PoiLayer.ts";
import cameraInfo from "./RoamingRoutePoiCameraInfo.json";

class RoamingRoutePoiLayer extends PoiLayer<any> {
  layerId: string = "RoamingRoutePoiLayer";
  layerName: string = "漫游路线Poi图层";

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
        location: coordinates,
        data: item.properties,
      };
    }));
  }

  async render(type: "1" | "2" | "3") {
    await this.fetchData(type);
    await this.add(
      Array.from(this.layerDataMap.values()),
      "buildNew",
    );
  }

  focusById(id: string, pathId: string) {
    if (!this.app) return;
    const info = cameraInfo.find(item => item.id === id && item.pathId === pathId);
    if (!info) return;
    const jsonData = {
      ...pick(info, ["targetPosition", "rotation", "distance"]),
      flyTime: 1,
    };
    this.app.CameraControl.FlyTo(jsonData);
  }

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }
}

export default new RoamingRoutePoiLayer();
