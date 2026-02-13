import { cloneDeep, set } from "lodash";
import layerPoint from "@/assets/json/layer-dianwei.json";
import poiStyle from "@/utils/WdpMap/code/poiStyle.ts";
import PoiLayer from "../../code/PoiLayer";

class CampusAssetsTypeWithCollegePoiLayer extends PoiLayer {
  readonly layerId: string = "CampusAssetsTypeWithCollegePoiLayer";
  readonly layerName: string = "校区资产分布POI图层";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  visible2DLevelMap = {
    1: {
      camera: { hideDistance: 30000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
    2: {
      camera: { hideDistance: 5000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
    3: {
      camera: { hideDistance: 2000, hideType: "none", scaleMode: "3D" },
      interaction: { clickTop: true, hoverTop: true },
      entity: { overlapOrder: 1 },
    },
  };

  async fetchData(campusName: string, collegeName: string = "") {
    // 校区名称到sid的映射（支持带"校区"后缀和不带后缀）
    const campusNameToSid: Record<string, string> = {
      邯郸: "3",
      邯郸校区: "3",
      江湾: "4",
      江湾校区: "4",
      枫林: "1",
      枫林校区: "1",
      张江: "2",
      张江校区: "2",
    };

    // 提取基础校区名称（去掉"校区"后缀）
    const baseCampusName = campusName.replace("校区", "");
    const targetSid = campusNameToSid[baseCampusName] || campusNameToSid[campusName];

    if (!targetSid) {
      this.setData([]);
      return;
    }

    // 从layer-dianwei.json中过滤对应校区的POI数据，只包含楼宇建筑
    const filteredFeatures = layerPoint.features.filter((feature) => {
      const sid = feature.properties.sid?.toString();
      const lx2 = feature.properties.lx2;
      return sid === targetSid && lx2 === "楼宇建筑";
    });

    const result = filteredFeatures.map((feature) => {
      const { geometry: { coordinates }, properties } = feature;
      const { id, name } = properties as { id?: number | string; name: string };
      // cj字段可能不存在，使用默认值1
      const cj = (properties as any).cj || 1;

      const style = cloneDeep(poiStyle.marker);
      set(style, "visible2D", this.visible2DLevelMap[cj]);

      return {
        id: id?.toString() || name,
        name,
        location: [...coordinates, 0] as [number, number, number],
        data: properties,
        style,
      };
    });
    this.setData(result);
  }

  async render(campusName: string, CollegeName: string = "") {
    await this.fetchData(campusName, CollegeName);
    const points = Array.from(this.layerDataMap.values());
    if (!points.length) return;
    const result = await this.add(points, "marker");
    await this.focusAll();
    return result;
  }
}

export default new CampusAssetsTypeWithCollegePoiLayer();
