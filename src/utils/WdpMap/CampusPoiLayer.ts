import { centroid } from "@turf/turf";
import to from "await-to-js";
import get from "lodash/get";
import { getCampus } from "@/api/commons";
import { campusNameToId } from "@/enums";
import PoiLayer from "./code/PoiLayer.ts";

interface ICampusPoiLayerData {
  lysl: number;
  mc: string;
  yqsl: number;
  zsry: number;
  id: number;
  mj: string;
}

class CampusPoiLayer extends PoiLayer<ICampusPoiLayerData> {
  readonly layerId: string = "CampusPoiLayer";
  readonly layerName: string = "校区中心点Poi图层";

  async fetchData() {
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
    const result = features.map((item: any) => {
      const geojson = { features: [item], type: "FeatureCollection" } as any;
      const [x, y] = get(centroid(geojson), "geometry.coordinates", []);
      const name = get(item, "properties.mc", "");
      const id = campusNameToId(name);
      return {
        id,
        name,
        location: [x, y, 0],
        data: item.properties as ICampusPoiLayerData,
      };
    });
    this.setData(result);
  }

  render() {
    const list = Array.from(this.layerDataMap.values());
    return this.add(list, "campus");
  }

  async onCreate() {
    await this.fetchData();
    return await this.render();
  }

  onUnmount(): any {
  }
}

export default new CampusPoiLayer();
