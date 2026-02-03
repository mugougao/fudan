import type { CampusId } from "@/enums";
import to from "await-to-js";
import { fetchCampusChargingPilePoint } from "@/api/financial/energy.ts";
import PoiLayer from "../code/PoiLayer";

class ChargingPilesPoiLayer extends PoiLayer {
  layerId: string = "ChargingPilesPoi";
  layerName: string = "充电桩点位";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  poiStyleMap = {
    "新能源-1": "ev_red",
    "新能源-2": "ev_yellow",
    "新能源-3": "ev_green",
    "电瓶车-1": "eBikes_red",
    "电瓶车-2": "eBikes_yellow",
    "电瓶车-3": "eBikes_green",
  };

  async fetchData(campusId: CampusId, type: "electricBicycle" | "newEnergyVehicles") {
    const [, res] = await to(fetchCampusChargingPilePoint(campusId, type));
    this.setData(
      res?.resultData?.features?.map(({ properties, geometry }) => {
        const { id, name, type, num } = properties;
        const { coordinates } = geometry;
        const style = this.poiStyleMap[`${type}-${num}`];
        return {
          id,
          name,
          label: "",
          location: [...coordinates, 0] as [number, number, number],
          data: properties,
          style,
        };
      }),
    );
  }

  async render(campusId: CampusId, type: "electricBicycle" | "newEnergyVehicles") {
    await this.fetchData(campusId, type);
    const result = await this.add(
      Array.from(this.layerDataMap.values()),
    );
    this.focusAll();
    return result;
  }
}

export default new ChargingPilesPoiLayer();
