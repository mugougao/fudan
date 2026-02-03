import to from "await-to-js";
import { fetchVenueFacilities } from "@/api/campusAccess/stadium";
import PoiLayer from "@/utils/WdpMap/code/PoiLayer.ts";

class SportsVenuePoiLayer extends PoiLayer<any> {
  layerId: string = "SportsVenuePoiLayer";
  layerName: string = "运动场馆Poi图层";

  async fetchData() {
    const [,res] = await to(fetchVenueFacilities());
    const result = (res?.resultData?.features ?? [])
      ?.map((item: any) => {
        const { id, mc } = item.properties;
        const coordinates = item.geometry.coordinates as [number, number];
        return {
          id,
          name: mc,
          location: [...coordinates, 0],
          data: item.properties,
        };
      });
    this.setData(result);
  }

  async render() {
    const result = await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    this.app?.CameraControl.FlyTo({
      targetPosition: [121.49885624935501, 31.33441819030393, 133.03574781903944],
      rotation: { pitch: -30, yaw: -90 },
    });
    return result;
  }

  onCreate() {
    return this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }
}

export default new SportsVenuePoiLayer();
