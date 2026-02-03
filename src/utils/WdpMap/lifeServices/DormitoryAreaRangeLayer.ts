import to from "await-to-js";
import { getDormitoryArea } from "@/api/lifeServices";
import RangeLayer from "../code/RangeLayer";

class DormitoryAreaRangeLayer extends RangeLayer<any> {
  readonly layerId: string = "DormitoryAreaRange";
  readonly layerName: string = "宿舍区";

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
        return {
          id,
          name: mc,
          outerRingCoordinates: item.geometry.coordinates.flat(2),
          data: item.properties,
        };
      }),
    );
  }

  async render(campusId: string) {
    await this.fetchData(campusId);
    return this.add(Array.from(this.layerDataMap.values()), "campus");
  }
}

export default new DormitoryAreaRangeLayer();
