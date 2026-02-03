import to from "await-to-js";
import { fetchCampusWithCollegePoi } from "@/api/assetManagement/instrument.ts";
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
    const [, res] = await to(fetchCampusWithCollegePoi(campusIdToName(campusId, false), collegeName, buildName));
    this.setData(
      (res?.resultData?.features ?? [])
        ?.map((item) => {
          const { geometry: { coordinates }, properties: { no, mc } } = item;
          return {
            id: no || mc,
            name: mc,
            location: [...coordinates, 0] as [number, number, number],
            data: item.properties,
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
