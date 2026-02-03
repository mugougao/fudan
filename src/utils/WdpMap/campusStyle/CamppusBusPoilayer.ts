import bclx from "@/assets/json/bclx.json";
import PoiLayer from "../code/PoiLayer.ts";

class CamppusBusPoilayer extends PoiLayer<any> {
  layerId: string = "CamppusBusPoilayer";
  layerName: string = "校园巴士起点终点图层";

  fetchData() {
    this.clearData();
    return new Promise((resolve) => {
      bclx.features.forEach((item) => {
        const { Id, mc } = item.properties;
        const { coordinates } = item.geometry;
        const startPoint = coordinates[0] as [number, number];
        const endPoint = coordinates[coordinates.length - 1] as [number, number];
        const [startName, endName] = mc.split("-");

        this.pushData({
          id: `${Id.toString()}-start`,
          name: `起点:${startName}`,
          location: [...startPoint, 0],
          data: {
            id: Id.toString(),
            pathName: mc,
            name: startName,
            isStart: true,
            idEnd: false,
          },
        });
        this.pushData({
          id: `${Id.toString()}-end`,
          name: `终点:${endName}`,
          location: [...endPoint, 0],
          data: {
            id: Id.toString(),
            pathName: mc,
            name: endName,
            isStart: false,
            idEnd: true,
          },
        });
      });
      resolve(Array.from(this.layerDataMap.values()));
    });
  }

  render(id: string) {
    const startPoi = this.getData(`${id}-start`);
    const endPoi = this.getData(`${id}-end`);
    if (!startPoi || !endPoi) return;
    return this.add([startPoi, endPoi], "busNew");
  }

  onCreate() {
    this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }
}

export default new CamppusBusPoilayer();
