import tbAreaData from "@/assets/json/tb_area.json";
// import to from "await-to-js";
// import { getDormitoryArea } from "@/api/lifeServices";
import RangeLayer from "../code/RangeLayer";

class DormitoryAreaRangeLayer extends RangeLayer<any> {
  readonly layerId: string = "DormitoryAreaRange";
  readonly layerName: string = "宿舍区";

  onCreate() {
  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: string) {
    // 从本地JSON文件获取数据，根据校区ID过滤
    const filteredFeatures = tbAreaData.features.filter((item: any) =>
      item.properties.sid === campusId,
    );

    // 模拟API响应结构
    const res = { resultData: { features: filteredFeatures } };

    this.setData(
      (res?.resultData?.features || []).map((item: any) => {
        const { id, mc } = item.properties;
        // coordinates 是三维数组 number[][][]，第一个环是外环
        const outerRingCoordinates: [number, number][] = item.geometry.coordinates[0] || [];
        return {
          id,
          name: mc,
          outerRingCoordinates,
          data: item.properties,
        };
      }),
    );
  }

  async render(campusId: string) {
    await this.fetchData(campusId);
    return this.add(Array.from(this.layerDataMap.values()), "campus");
  }
}

export default new DormitoryAreaRangeLayer();
