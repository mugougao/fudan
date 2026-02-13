import studyTourData from "@/assets/json/study_tour(1).json";
// import { getTourRoute } from "@/api/campusStyle/index.ts";
import PathLayer from "../code/PathLayer.ts";

class RoamingRoutePathLayer extends PathLayer<any> {
  layerId: string = "RoamingRoutePathLayer";
  layerName: string = "漫游路线Path图层";

  typeMap = { 1: "经典打卡", 2: "study tour", 3: "拥抱自然" };

  async fetchData(id: "1" | "2" | "3") {
    const _type = this.typeMap[id];
    console.log(`[RoamingRoutePathLayer] 加载${_type}路径数据`);

    let res: any = null;

    if (id === "2") { // study tour
      console.log("[RoamingRoutePathLayer] 使用study_tour(1).json文件数据");
      // study_tour(1).json包含点数据，但PathLayer需要路径数据
      // 这里将点数据转换为简单路径数据，每个点作为一个路径点
      const features = studyTourData.features || [];
      if (features.length === 0) {
        console.warn("[RoamingRoutePathLayer] study tour数据为空");
        return;
      }

      // 创建一个连接所有点的简单路径
      const pathCoordinates = features.map((feature: any) => {
        return feature.geometry.coordinates;
      });

      // 创建一个简单的路径特征
      res = {
        resultData: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: pathCoordinates,
              },
              properties: {
                id: "study_tour_path",
                mc: "Study Tour路线",
              },
            },
          ],
        },
      };
    }
    else {
      console.log(`[RoamingRoutePathLayer] ${_type}类型暂无硬编码路径数据`);
      // 对于其他类型，返回空数据
      return;
    }

    if (!res?.resultData) {
      window.$message.warning(`暂无${_type}路径数据!!!`);
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
