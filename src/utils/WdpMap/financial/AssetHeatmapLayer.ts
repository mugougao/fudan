import type { CampusId } from "@/enums";
import to from "await-to-js";
import { fetchCampusAssetsHeatMap } from "@/api/financial/index.ts";
import HeatMapLayer from "../code/HeatMapLayer";

class AssetHeatmapLayer extends HeatMapLayer {
  layerId: string = "assetHeatmapLayer";
  layerName: string = "资产热力图";

  onCreate() {
  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId) {
    const [,res] = await to(fetchCampusAssetsHeatMap(campusId));
    const mapdata = (res?.resultData || [])
      .reduce(
        (prev, { sl, geom, name }) => {
          // if (name === "燕园宾馆3号楼") return prev;
          if (!geom || !sl) return prev;
          const [x, y] = geom.replace("POINT(", "").replace(")", "").split(" ").map(Number);
          prev.push({ point: [x, y, 0], value: sl });
          return prev;
        },
        [] as { point: [number, number, number]; value: number }[],
      )
      .sort((a, b) => a.value - b.value);

    this.setData([{
      id: campusId,
      name: `${campusId}-资产热力图`,
      mapdata,
      style: "default",
      data: {},
    }]);
  }

  async render(campusId: CampusId) {
    await this.removeAll();
    await this.fetchData(campusId);
    const list = Array.from(this.layerDataMap.values());
    const result = await this.add(list);
    this.focus(campusId, { rotation: { pitch: -90, yaw: -90 }, distanceFactor: 1 });
    return result;
  }
}

export default new AssetHeatmapLayer();
