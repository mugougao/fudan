import to from "await-to-js";
import { getCampus } from "@/api/commons";
import { CampusId } from "@/enums";
import RangeLayer from "@/utils/WdpMap/code/RangeLayer.ts";

interface ICampusRangeLayer {
  lysl: number;
  mc: string;
  yqsl: number;
  zsry: number;
  id: number;
  mj: string;
}

class CampusRangeLayer extends RangeLayer<ICampusRangeLayer> {
  layerId: string = "CampusRangeLayer";
  layerName: string = "校区范围图层";

  async fetchData() {
    // 获取校区数据
    const [err, res] = await to(getCampus());
    if (err) {
      // window.$message.error("校区区域数据获取失败!!!");
      return;
    }
    if (!res?.resultData) {
      // window.$message.warning("暂无校区区域数据!!!");
      return;
    }
    const { features = [] } = res.resultData;
    this.setData(
      features.map((item) => {
        const { geometry = {}, properties = {} } = item;
        const { coordinates = [] } = geometry as any;
        const { mc, id } = properties as ICampusRangeLayer;
        return {
          id: id.toString(),
          name: mc,
          outerRingCoordinates: coordinates.flat(2),
          data: properties,
        };
      }),
    );
  }

  render() {
    const list = Array.from(this.layerDataMap.values());
    return this.add(list, "campus");
  }

  focusByCampusId(campusId: CampusId = CampusId.Overview, rotation?: { pitch: number; yaw: number }) {
    if (campusId === CampusId.Overview || campusId == null) {
      return this.focusAll({ distanceFactor: 0.5 });
    }
    const { pitch = -30, yaw = -90 } = (rotation || {}) as any;
    return this.focus(campusId, { distanceFactor: 0.8, rotation: { pitch, yaw } });
  }

  async onCreate() {
    await this.fetchData();
    return this.render();
  }

  onUnmount(): any {

  }
}

export default new CampusRangeLayer();
