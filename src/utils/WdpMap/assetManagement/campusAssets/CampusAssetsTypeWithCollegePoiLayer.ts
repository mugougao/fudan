import to from "await-to-js";
import { cloneDeep, set } from "lodash";
import { fetchCampusAssetsTypePoiByCollege } from "@/api/assetManagement/campusAssets.ts";
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
    const [, res] = await to(fetchCampusAssetsTypePoiByCollege(campusName, collegeName));
    const result = (res?.resultData?.features || []).map((item) => {
      const { geometry: { coordinates }, properties } = item;
      const { no: id, mc: name, cj = "1" } = properties;

      const style = cloneDeep(poiStyle.marker);
      set(style, "visible2D", this.visible2DLevelMap[cj]);

      return {
        id,
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
