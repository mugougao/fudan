import TextLayer from "../code/TextLayer.ts";
import cameraInfo from "./RoamingRoutePoiCameraInfo.json";

class RoamingRouteTextLayer extends TextLayer<any> {
  layerId: string = "RoamingRouteTextLayer";
  layerName: string = "漫游路线Text图层";

  typeMap = { 1: "经典打卡", 2: "study tour", 3: "拥抱自然" };

  async fetchData(type: "1" | "2" | "3") {
    const _type = this.typeMap[type];
    console.log(`[RoamingRouteTextLayer] 加载${_type}硬编码数据，从cameraInfo.json中过滤pathId=${type}的数据`);

    // 从cameraInfo中过滤出对应类型的地标数据
    const features = cameraInfo.filter(item => item.pathId === type);
    console.log(`[RoamingRouteTextLayer] 找到${features.length}个${_type}地标`);

    if (features.length === 0) {
      console.warn(`[RoamingRouteTextLayer] ${_type}类型在cameraInfo.json中没有找到数据`);
      return;
    }

    this.setData(features.map((item: any) => {
      const { id, name, targetPosition, rotation } = item;
      // targetPosition格式: [经度, 纬度, 高度]，直接作为3D坐标使用
      return {
        id,
        name,
        location: targetPosition,
        scale3d: [10, 3, 3],
        rotator: {
          pitch: 0,
          yaw: rotation?.yaw ?? 60,
          roll: 0,
        },
        data: item,
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
