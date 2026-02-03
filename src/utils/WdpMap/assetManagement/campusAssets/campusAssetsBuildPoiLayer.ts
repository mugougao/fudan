import to from "await-to-js";
import { cloneDeep, set } from "lodash";
import { fetchCampusWithCollegePoi } from "@/api/assetManagement/instrument.ts";
import { type CampusId, campusIdFormat } from "@/enums";
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
    const [, res] = await to(fetchCampusWithCollegePoi(campusIdFormat(campusId, "")));
    const result = (res?.resultData?.features || []).map((item) => {
      const { geometry: { coordinates }, properties } = item;
      // console.log("🚀 ~ CampusAssetsBuildPoiLayer ~ fetchData ~ properties:", properties);
      const id = properties.no || properties.mc;
      const style = cloneDeep(poiStyle.marker);
      const cj = properties.cj;
      set(style, "visible2D", this.visible2DLevelMap[cj]);
      return {
        id,
        name: properties.mc,
        location: [...coordinates, 0],
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
