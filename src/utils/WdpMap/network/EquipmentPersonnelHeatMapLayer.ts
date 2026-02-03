import type { CampusId } from "@/enums";
import to from "await-to-js";
import { fetchUserDistributionTop5More } from "@/api/network/campus.ts";
import campusRangeLayer from "../CampusRangeLayer";
import HeatMapLayer from "../code/HeatMapLayer";

class EquipmentPersonnelHeatMapLayer extends HeatMapLayer {
  layerId: string = "EquipmentPersonnelHeatMapLayer";
  layerName: string = "设备人员热力图";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId) {
    const [,res] = await to(fetchUserDistributionTop5More(campusId, ""));

    const mapdata = (res?.resultData || []).reduce((prev, { zds, x, y }) => {
      prev.push({ point: [Number(x), Number(y), 0], value: zds });
      return prev;
    }, [] as { point: [number, number, number]; value: number }[]);

    this.setData([{
      id: campusId,
      name: `${campusId}-设备人员热力图`,
      mapdata,
      style: "default",
      data: {},
    }]);
  }

  async render(campusId: CampusId) {
    await this.removeAll();
    await this.fetchData(campusId);
    // 渲染
    const list = Array.from(this.layerDataMap.values());
    const result = await this.add(list);
    // this.focus(campusId, { rotation: { pitch: -90, yaw: -90 }, distanceFactor: 0.1 });

    campusRangeLayer.focusByCampusId(campusId, { pitch: -90, yaw: -90 });
    return result;
  }
}

export default new EquipmentPersonnelHeatMapLayer();
