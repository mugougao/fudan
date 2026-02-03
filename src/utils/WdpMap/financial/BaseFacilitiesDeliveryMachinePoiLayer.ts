import type { CampusId } from "@/enums";
import { BaseFacilitiesPoiLayer } from "./BaseFacilitiesPoiLayer";

class BaseFacilitiesDeliveryMachinePoiLayer extends BaseFacilitiesPoiLayer {
  layerId: string = "BaseFacilitiesDeliveryMachinePoiLayer";
  layerName: string = "校园总览-基础设施点位-自助报账投递机";

  async render(campusId: CampusId) {
    await this.fetchData(campusId, "自助报账投递机");
    await this.add(Array.from(this.layerDataMap.values()));
    this.focusAll();
  }
}

export default new BaseFacilitiesDeliveryMachinePoiLayer();
