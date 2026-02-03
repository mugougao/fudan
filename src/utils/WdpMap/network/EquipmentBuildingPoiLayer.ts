import to from "await-to-js";
import { fetchBuildingWithNetworkDevice } from "@/api/network/campus.ts";
import { CampusId } from "@/enums";
import PoiLayer from "../code/PoiLayer";

class EquipmentBuildingPoiLayer extends PoiLayer {
  layerId: string = "EquipmentBuildingPoiLayer";
  layerName: string = "设备楼栋Poi点位";

  static cameraInfoMap = {
    141: {
      targetPosition: [
        121.50004301931253,
        31.29577669269181,
        149.99999999999997,
      ],
      rotation: {
        pitch: -30,
        yaw: -90,
      },
    },
    140: {
      targetPosition: [
        121.50004963457586,
        31.296244724602023,
        150.49999999999994,
      ],
      rotation: {
        pitch: -30.000064849853516,
        yaw: -90.0000228881836,
      },
    },
  };

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId = CampusId.HanDan) {
    const [,res] = await to(fetchBuildingWithNetworkDevice(campusId));

    this.setData(
      (res?.resultData?.features || []).map(({ properties, geometry }) => {
        const { id, mc } = properties;
        const { coordinates } = geometry;
        return {
          id,
          name: mc,
          location: [...coordinates, 0],
          data: properties,
        };
      }),
    );
  }

  async render(campusId: CampusId = CampusId.HanDan) {
    await this.removeAll();
    await this.fetchData(campusId);
    const list = Array.from(this.layerDataMap.values());
    // const ids = list.map(item => item.id);
    return this.add(list, "buildNew");
  }

  flyTo(id: string, options?: Partial<{ rotation: { pitch?: number; yaw?: number }; distanceFactor: number; flyTime: number }>) {
    if (Object.keys(EquipmentBuildingPoiLayer.cameraInfoMap).includes(id)) {
      return this.app?.CameraControl?.FlyTo({
        ...EquipmentBuildingPoiLayer.cameraInfoMap[id],
        distance: 1,
        flyTime: 1,
      });
    }
    return super.flyTo(id, options);
  }
}

export default new EquipmentBuildingPoiLayer();
