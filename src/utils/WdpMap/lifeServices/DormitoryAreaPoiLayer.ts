import { centroid } from "@turf/turf";
import to from "await-to-js";
import get from "lodash/get";
import { getDormitoryArea } from "@/api/lifeServices";
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
    const [, res] = await to(getDormitoryArea(campusId));

    this.setData(
      (res?.resultData?.features || []).map((item) => {
        const { id, mc } = item.properties;
        // const coordinates = get(item, "geometry.coordinates", []);
        const center = centroid({ features: [item], type: "FeatureCollection" });
        return {
          id,
          name: mc,
          location: get(center, "geometry.coordinates", []),
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
