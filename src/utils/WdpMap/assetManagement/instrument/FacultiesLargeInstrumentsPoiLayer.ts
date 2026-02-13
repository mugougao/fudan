import layerPoint from "@/assets/json/layer-dianwei.json";
import { type CampusId, campusIdToName } from "@/enums";
import PoiLayer from "../../code/PoiLayer";

class FacultiesLargeInstrumentsPoiLayer extends PoiLayer<any> {
  readonly layerId: string = "facultiesLargeInstrumentsPoiLayer";
  readonly layerName: string = "院系大型仪器poi";

  onCreate() {
  }

  onUnmount() {
  }

  async fetchData(campusId: CampusId, collegeName: string = "", buildName: string = "") {
    // 校区名称到sid的映射
    const campusNameToSid: Record<string, string> = {
      邯郸: "3",
      江湾: "4",
      枫林: "1",
      张江: "2",
    };

    const campusName = campusIdToName(campusId, false);
    const targetSid = campusNameToSid[campusName];
    if (!targetSid) {
      this.setData([]);
      return;
    }

    // 从layer-dianwei.json中过滤对应校区的POI数据
    const filteredFeatures = layerPoint.features.filter((feature) => {
      const sid = feature.properties.sid?.toString();
      return sid === targetSid;
    });

    this.setData(
      filteredFeatures.map((feature) => {
        const { geometry: { coordinates }, properties } = feature;
        const { id, name } = properties;
        return {
          id: id?.toString() || name,
          name,
          location: [...coordinates, 0] as [number, number, number],
          data: properties,
        };
      }),
    );
  }

  async render(campusId: CampusId, collegeName: string = "", buildName: string = "") {
    this.removeAll();
    await this.fetchData(campusId, collegeName, buildName);
    const result = await this.add(
      Array.from(this.layerDataMap.values()),
      "buildNew",
    );
    const id = [...this.entityMap.keys()]?.[0];
    id ? this.flyTo(id) : this.focusAll();
    return result;
  }
}

export default new FacultiesLargeInstrumentsPoiLayer();
