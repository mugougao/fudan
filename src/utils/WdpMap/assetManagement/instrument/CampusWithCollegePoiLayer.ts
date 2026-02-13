import layerPoint from "@/assets/json/layer-dianwei.json";
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
    // 校区名称到sid的映射
    const campusToSid: Record<string, string> = {
      邯郸: "3",
      江湾: "4",
      枫林: "1",
      张江: "2",
    };

    const targetSid = campusToSid[campusName];
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
