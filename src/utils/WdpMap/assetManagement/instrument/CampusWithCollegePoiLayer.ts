import to from "await-to-js";
import { fetchCampusWithCollegePoi } from "@/api/assetManagement/instrument.ts";
import PoiLayer from "../../code/PoiLayer";

class CampusWithCollegePoiLayer extends PoiLayer<any> {
  readonly layerId: string = "campusWithCollegePoiLayer";
  readonly layerName: string = "校区与学院POI图层";
  onCreate() {
  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusName: string, collegeName: string = "") {
    const [, res] = await to(fetchCampusWithCollegePoi(campusName, collegeName));
    this.setData(
      (res?.resultData?.features || []).map((item) => {
        const { geometry: { coordinates }, properties } = item;
        const { no: id, mc: name } = properties;
        return {
          id: id || name,
          name,
          location: [...coordinates, 0] as [number, number, number],
          data: properties,
        };
      }),
    );
  }

  async renderCampus(campusName: string) {
    await this.fetchData(campusName);
    const result = await this.add(
      Array
        .from(this.layerDataMap.values())
        .map((item) => {
          const { data, name } = item;
          return {
            ...item,
            label: [name, `达标数${data.zs}`],
          };
        }),
      "buildNew_suffix",
    );
    this.focusAll();
    return result;
  }

  async renderCampusWithCollege(campusName: string, CollegeName: string = "") {
    await this.fetchData(campusName, CollegeName);

    const result = await this.add(
      Array
        .from(this.layerDataMap.values())
        .map((item) => {
          const { data, name } = item;
          return {
            ...item,
            label: [name, `${data.zs}台`],
          };
        }),
      "buildNew_suffix",
    );
    this.focusAll();
    return result;
  }
}

export default new CampusWithCollegePoiLayer();
