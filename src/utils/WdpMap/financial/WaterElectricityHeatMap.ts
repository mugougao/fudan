import type { CampusId } from "@/enums";
import to from "await-to-js";
import { fetchCampusWaterElectricityHeatMap } from "@/api/financial/index.ts";
import HeatMapLayer from "../code/HeatMapLayer";

// EquipmentPersonnel

class WaterElectricityHeatMap extends HeatMapLayer {
  layerId: string = "waterElectricityHeatMapLayer";
  layerName: string = "水电热力图";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId, type: "water" | "electricity" = "water") {
    const [,res] = await to(fetchCampusWaterElectricityHeatMap(campusId, type));

    const mapdata = (res?.resultData || []).reduce((prev, { water, elect, geom }) => {
      if (!geom) return prev;
      const [x, y] = geom.replace("POINT(", "").replace(")", "").split(" ").map(Number);
      const value = (type === "water" ? water : elect) || 0;
      prev.push({ point: [x, y, 0], value });
      return prev;
    }, [] as { point: [number, number, number]; value: number }[]);

    this.setData([{
      id: campusId,
      name: `${campusId}-资产热力图`,
      mapdata,
      style: "default",
      data: {},
    }]);
  }

  async render(campusId: CampusId, type: "water" | "electricity" = "water") {
    await this.removeAll();
    await this.fetchData(campusId, type);
    // 渲染
    const list = Array.from(this.layerDataMap.values());
    const result = await this.add(list);
    this.focus(campusId, { rotation: { pitch: -90, yaw: -90 }, distanceFactor: 1 });
    return result;
  }
}

export default new WaterElectricityHeatMap();
