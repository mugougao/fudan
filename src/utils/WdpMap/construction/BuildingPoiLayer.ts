import layerPoint from "@/assets/json/layer-dianwei.json";
import PoiLayer from "../code/PoiLayer";

class BuildingPoiLayer extends PoiLayer {
  layerId: string = "修缮楼栋Poi点位";
  layerName: string = "buildingPoiLayer";
  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(id: string) {
    // 从layer-dianwei.json中查找对应id的楼宇数据
    const feature = layerPoint.features.find((feature) => {
      const properties = feature.properties;
      // 匹配id字段（可能是数字或字符串）
      const idNum = Number.parseInt(id, 10);
      const featureId = properties.id;
      const featureId1 = properties.id_1;
      // 比较逻辑：featureId可能是数字或字符串，id可能是字符串
      return featureId === idNum || featureId?.toString() === id || featureId1 === id;
    });

    if (!feature) {
      this.setData([]);
      return;
    }

    const { geometry, properties } = feature;
    const [lng, lat] = geometry.coordinates;
    const { id: _id, name } = properties as { id?: number | string; name: string };

    this.setData([{
      id: _id?.toString() || id,
      name,
      location: [lng, lat, 0] as [number, number, number],
      data: properties,
    }]);
  }

  async render(id: string) {
    await this.removeAll();
    await this.fetchData(id);
    const res = await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    this.flyTo(id);
    return res;
  }
}

export default new BuildingPoiLayer();
