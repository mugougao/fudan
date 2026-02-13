import type { CampusId } from "@/enums";
import { campusIdToName } from "@/enums";
import to from "await-to-js";
import { fetchUserDistributionTop5More } from "@/api/network/campus.ts";
import campusRangeLayer from "../CampusRangeLayer";
import HeatMapLayer from "../code/HeatMapLayer";
import MOCK_HEAT_MAP_DATA from "@/assets/json/network_heatmap_mock_data.json";

class EquipmentPersonnelHeatMapLayer extends HeatMapLayer {
  layerId: string = "EquipmentPersonnelHeatMapLayer";
  layerName: string = "设备人员热力图";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId) {
    console.log("🗺️ [网络热力图] 🚫 API调用已注释，使用硬编码数据");
    
    // 🚫 注释掉API调用，直接使用硬编码数据
    const campusName = campusIdToName(campusId);
    const mockData = (MOCK_HEAT_MAP_DATA as any)[campusName] || [];
    
    console.log("✅ [网络热力图] 硬编码数据加载完成:", {
      校区名称: campusName,
      楼宇数量: mockData.length,
    });

    /* // 原API调用逻辑已注释
    const [,res] = await to(fetchUserDistributionTop5More(campusId, ""));
    const mockData = res?.resultData || [];
    */

    const mapdata = mockData.reduce((prev: any[], { zds, x, y }: any) => {
      prev.push({ point: [Number(x), Number(y), 0], value: zds });
      return prev;
    }, [] as { point: [number, number, number]; value: number }[]);

    this.setData([{
      id: campusId,
      name: `${campusId}-设备人员热力图`,
      mapdata,
      style: "default",
      data: {},
    }]);
  }

  async render(campusId: CampusId) {
    await this.removeAll();
    await this.fetchData(campusId);
    // 渲染
    const list = Array.from(this.layerDataMap.values());
    const result = await this.add(list);
    // this.focus(campusId, { rotation: { pitch: -90, yaw: -90 }, distanceFactor: 0.1 });

    campusRangeLayer.focusByCampusId(campusId, { pitch: -90, yaw: -90 });
    return result;
  }
}

export default new EquipmentPersonnelHeatMapLayer();
