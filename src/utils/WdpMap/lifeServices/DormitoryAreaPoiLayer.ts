import { centroid } from "@turf/turf";
// import to from "await-to-js";
import get from "lodash/get";
import tbAreaData from "@/assets/json/tb_area.json";
// import { getDormitoryArea } from "@/api/lifeServices";
import PoiLayer from "../code/PoiLayer";

class DormitoryAreaPoiLayer extends PoiLayer<any> {
  readonly layerId: string = "DormitoryAreaPoi";
  readonly layerName: string = "宿舍区中心点位";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: string) {
    // 从本地JSON文件获取数据，根据校区ID过滤
    const filteredFeatures = tbAreaData.features.filter((item: any) =>
      item.properties.sid === campusId,
    );

    // 模拟API响应结构
    const res = { resultData: { features: filteredFeatures } };

    this.setData(
      (res?.resultData?.features || []).map((item: any) => {
        const { id, mc } = item.properties;
        // const coordinates = get(item, "geometry.coordinates", []);
        const center = centroid({ features: [item], type: "FeatureCollection" } as any);
        const coordinates = get(center, "geometry.coordinates", []) as [number, number] | [];
        // 确保返回三维坐标 [lng, lat, 0]
        const location: [number, number, number] = coordinates.length >= 2
          ? [coordinates[0] || 0, coordinates[1] || 0, 0]
          : [0, 0, 0];
        return {
          id,
          name: mc,
          location,
          data: item.properties,
        };
      }),
    );
  }

  async render(campusId: string) {
    await this.fetchData(campusId);
    return this.add(Array.from(this.layerDataMap.values()), "buildNew");
  }
}

export default new DormitoryAreaPoiLayer();
