import layerDianweiData from "@/assets/json/layer-dianwei.json";
import PoiLayer from "../code/PoiLayer";

class DormitoryBuildPoiLayer extends PoiLayer {
  readonly layerId: string = "dormitoryBuildPoi";
  readonly layerName: string = "宿舍区楼栋";

  // 特殊楼栋
  specialBuildingIds = [
    "99b6db0a998d44b99e5b46a897a9ebe6",
    "5fe3e6c08d35465d9724d0effab79df9",
    "c0893dca05594416a25ddd2a55f330cc",
    "e533f6839ff3484e8613c60facef44b0",
    "7ffeb7f555cb4a7f804673e3f21290d4",
  ];

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(dormitoryAreaId: string) {
    // 从本地JSON文件获取数据，根据lx属性筛选宿舍楼，根据id_1属性筛选属于当前分区的点位
    const filteredFeatures = layerDianweiData.features.filter((item: any) =>
      item.properties.lx === "宿舍楼" && item.properties.id_1 === dormitoryAreaId,
    );

    // 模拟API响应结构
    const res = { resultData: { features: filteredFeatures } };

    this.setData(
      (res?.resultData?.features || []).map((item: any) => {
        const { properties, geometry } = item;
        const { id, name } = properties;
        const { coordinates } = geometry;
        return {
          id: String(id),
          name,
          location: [...coordinates, 0] as [number, number, number],
          style: this.specialBuildingIds.includes(String(id)) ? "dormitoryActive" : "dormitory",
          data: properties,
        };
      }),
    );
  }

  async render(dormitoryAreaId: string) {
    await this.fetchData(dormitoryAreaId);
    const result = await this.add(
      Array.from(this.layerDataMap.values()),
    );
    this.focusAll({ distanceFactor: 1 });
    return result;
  }
}

export default new DormitoryBuildPoiLayer();
