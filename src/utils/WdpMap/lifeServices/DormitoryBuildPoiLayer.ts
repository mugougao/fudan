import to from "await-to-js";
import { getDormitoryAreaBuilding } from "@/api/lifeServices";
import PoiLayer from "../code/PoiLayer";

class DormitoryBuildPoiLayer extends PoiLayer {
  readonly layerId: string = "dormitoryBuildPoi";
  readonly layerName: string = "宿舍区楼栋";

  // 特殊楼栋
  specialBuildingIds = [
    "99b6db0a998d44b99e5b46a897a9ebe6",
    "5fe3e6c08d35465d9724d0effab79df9",
    "c0893dca05594416a25ddd2a55f330cc",
    "e533f6839ff3484e8613c60facef44b0",
    "7ffeb7f555cb4a7f804673e3f21290d4",
  ];

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(dormitoryAreaId: string) {
    const [, res] = await to(getDormitoryAreaBuilding(dormitoryAreaId));
    this.setData(
      (res?.resultData?.features || []).map((item) => {
        const { properties, geometry } = item;
        const { id, mc } = properties;
        const { coordinates } = geometry;
        return {
          id,
          name: mc,
          location: [...coordinates, 0] as [number, number, number],
          style: this.specialBuildingIds.includes(id) ? "dormitoryActive" : "dormitory",
          data: properties,
        };
      }),
    );
  }

  async render(dormitoryAreaId: string) {
    await this.fetchData(dormitoryAreaId);
    const result = await this.add(
      Array.from(this.layerDataMap.values()),
    );
    this.focusAll({ distanceFactor: 1 });
    return result;
  }
}

export default new DormitoryBuildPoiLayer();
