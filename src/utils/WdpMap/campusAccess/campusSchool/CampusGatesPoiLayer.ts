import to from "await-to-js";
import { fetchCampusGate } from "@/api/campusAccess/campusSchool";
import { CampusId, campusIdToName } from "@/enums";
import PoiLayer from "@/utils/WdpMap/code/PoiLayer.ts";

class CampusGatesPoiLayer extends PoiLayer<any> {
  readonly layerId: string = "campusGatesPoi";
  readonly layerName: string = "校园出入口大门";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId) {
    if (campusId === CampusId.Overview) return;
    const campusName = campusIdToName(campusId);
    if (!campusName) return;
    const [,res] = await to(fetchCampusGate(campusName));

    const result = (res?.resultData?.features || []).map((item: any) => {
      const coord = item.geometry.coordinates;
      const id = item.properties?.mc;
      return {
        id,
        name: id,
        location: [...coord, 0],
        data: item.properties,
      };
    });

    this.setData(result);
  }

  async render(campusId: CampusId) {
    await this.removeAll();
    await this.fetchData(campusId);
    const poiList = Array.from(this.layerDataMap.values());
    const result = await this.add(poiList, "buildNew");
    await this.focusAll();
    return result;
  }
}

export default new CampusGatesPoiLayer();
