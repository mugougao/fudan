import layerPoint from "@/assets/json/layer-dianwei.json";
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
    // 从layer-dianwei.json中过滤第五教学楼和第六教学楼的数据
    const targetBuildings = ["第五教学楼", "第六教学楼"];

    // 校区ID到sid的映射（排除Overview）
    const campusIdToSid: Partial<Record<CampusId, string>> = {
      [CampusId.FengLin]: "1",
      [CampusId.ZhangJiang]: "2",
      [CampusId.HanDan]: "3",
      [CampusId.JiangWan]: "4",
    };

    const targetSid = campusIdToSid[campusId];

    const filteredFeatures = layerPoint.features.filter((feature) => {
      const { name, sid, lx } = feature.properties;
      const sidStr = sid?.toString();
      // 只获取楼宇建筑类型且名称匹配的目标教学楼，并按校区过滤
      // 如果是概览视图（campusId为"0"），不按校区过滤
      const campusMatch = campusId === CampusId.Overview || sidStr === targetSid;
      return lx === "楼宇建筑" && targetBuildings.includes(name) && campusMatch;
    });

    this.setData(
      filteredFeatures.map(({ properties, geometry }) => {
        const { id, name } = properties;
        const { coordinates } = geometry;
        return {
          id: id?.toString() || name,
          name,
          location: [...coordinates, 0] as [number, number, number],
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
