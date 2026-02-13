import { cloneDeep, set } from "lodash";
import layerPoint from "@/assets/json/layer-dianwei.json";
import { CampusId } from "@/enums";
import poiStyle from "@/utils/WdpMap/code/poiStyle.ts";
import PoiLayer from "../../code/PoiLayer";

class CampusAssetsBuildPoiLayer extends PoiLayer {
  readonly layerId: string = "CampusAssetsBuildPoiLayer";
  readonly layerName: string = "校区资产建筑POI";

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

  async fetchData(campusId: CampusId) {
    // 校区ID到sid的映射（排除Overview）
    const campusIdToSid: Partial<Record<CampusId, string>> = {
      [CampusId.FengLin]: "1",
      [CampusId.ZhangJiang]: "2",
      [CampusId.HanDan]: "3",
      [CampusId.JiangWan]: "4",
    };

    const targetSid = campusIdToSid[campusId];
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
      const id = properties.id?.toString() || properties.name;
      const style = cloneDeep(poiStyle.marker);
      // cj字段可能不存在，使用默认值1
      const cj = (properties as any).cj || 1;
      set(style, "visible2D", this.visible2DLevelMap[cj]);
      return {
        id,
        name: properties.name,
        location: [...coordinates, 0] as [number, number, number],
        data: properties,
        style,
      };
    });
    this.setData(result);
  }

  async render(campusId: CampusId, showCount: boolean = false) {
    await this.removeAll();
    await this.fetchData(campusId);
    const list = Array.from(this.layerDataMap.values())
      .map((item) => {
        const { name, data = {} } = item;
        const { zs } = data;
        return { ...item, label: showCount ? `${name} ${zs}台` : name };
      });
    return this.add(list, "marker");
  }
}

export default new CampusAssetsBuildPoiLayer();
