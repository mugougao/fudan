import to from "await-to-js";
import { fetchBuildingPoint } from "@/api/construction/repair.ts";
import PoiLayer from "../code/PoiLayer";

class BuildingPoiLayer extends PoiLayer {
  layerId: string = "修缮楼栋Poi点位";
  layerName: string = "buildingPoiLayer";
  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(id: string) {
    const [,res] = await to(fetchBuildingPoint(id));
    const { geometry, properties = {} } = res?.resultData?.features?.[0] || {};
    const [lng, lat] = geometry?.coordinates || [];
    const { id: _id, name } = properties as any;
    this.setData([{
      id: _id,
      name,
      location: [lng, lat, 0],
      data: properties,
    }]);
  }

  async render(id: string) {
    await this.removeAll();
    await this.fetchData(id);
    const res = await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    this.flyTo(id);
    return res;
  }
}

export default new BuildingPoiLayer();
