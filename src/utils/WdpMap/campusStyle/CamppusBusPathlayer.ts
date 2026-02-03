import bclx from "@/assets/json/bclx.json";
import PathLayer from "../code/PathLayer.ts";

class CamppusBusPathlayer extends PathLayer<any> {
  layerId: string = "CamppusBusPathlayer";
  layerName: string = "校园巴士Path图层";

  fetchData() {
    this.clearData();
    return new Promise((resolve) => {
      bclx.features.forEach((item) => {
        const { Id, mc } = item.properties;
        const { coordinates } = item.geometry;
        this.pushData({
          id: Id.toString(),
          name: mc,
          coordinates: coordinates as [number, number][],
          data: {},
        });
      });
      resolve(Array.from(this.layerDataMap.values()));
    });
  }

  render(id: string) {
    const path = this.getData(id);
    if (!path) return;
    this.add(path, "bus");
  }

  onCreate() {
    this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }
}

export default new CamppusBusPathlayer();
