import to from "await-to-js";
import { fetchBuildingPointById } from "@/api/financial/index.ts";
import PoiLayer from "../code/PoiLayer";

class BuildingPoiLayer extends PoiLayer {
  layerId: string = "BuildingPoiLayer";
  layerName: string = "校园总览楼栋点位";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(buildingId: string) {
    const [,res] = await to(fetchBuildingPointById(buildingId));
    const { features } = res?.resultData || {};
    const { geometry, properties } = features[0] || {};
    const { coordinates } = geometry;
    const { name, id } = properties;

    this.setData([{
      id,
      name,
      location: [...coordinates, 0] as [number, number, number],
      data: properties,
    }]);
  }

  async render(buildingId: string) {
    await this.removeAll();
    await this.fetchData(buildingId);
    const res = await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    this.flyTo(buildingId);
    return res;
  }
}

export default new BuildingPoiLayer();
