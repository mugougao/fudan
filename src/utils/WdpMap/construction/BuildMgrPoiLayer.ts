import type { CampusId } from "@/enums";
import to from "await-to-js";
import { cloneDeep, set } from "lodash";
import { fetchBuildPoints } from "@/api/construction/build.ts";
import poiStyle from "@/utils/WdpMap/code/poiStyle.ts";
import CampusRangeLayer from "../CampusRangeLayer";
import PoiLayer from "../code/PoiLayer";

class BuildMgrPoiLayer extends PoiLayer {
  layerId: string = "楼栋管理Poi点位";
  layerName: string = "BuildMgrPoiLayer";

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

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId, params: { name?: string; area?: string; type?: string }) {
    const [,res] = await to(fetchBuildPoints(campusId, params));

    const result = (res?.resultData || []).map((item) => {
      const { id, name, x, y, level } = item;
      const style = cloneDeep(poiStyle.landmark);
      set(style, "visible2D", this.visible2DLevelMap[level]);

      return {
        id,
        name,
        location: [x, y, 0] as [number, number, number],
        data: item,
        style,
      };
    });

    this.setData(result);
  }

  async render(campusId: CampusId, params: { name?: string; area?: string; type?: string }) {
    await this.removeAll();
    await this.fetchData(campusId, params);
    const res = await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    if (params.area) {
      this.focusAll();
    }
    else {
      CampusRangeLayer.focusByCampusId(campusId);
    }
    return res;
  }
}

export default new BuildMgrPoiLayer();
