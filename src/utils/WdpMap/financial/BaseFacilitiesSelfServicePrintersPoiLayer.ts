import type { CampusId } from "@/enums";
import { BaseFacilitiesPoiLayer } from "./BaseFacilitiesPoiLayer";

class BaseFacilitiesSelfServicePrintersPoiLayer extends BaseFacilitiesPoiLayer {
  layerId: string = "BaseFacilitiesSelfServicePrintersPoiLayer";
  layerName: string = "校园总览-基础设施点位-自助补卡机";

  async render(campusId: CampusId) {
    await this.fetchData(campusId, "自助补卡机");
    await this.add(Array.from(this.layerDataMap.values()));
    this.focusAll();
  }
}

export default new BaseFacilitiesSelfServicePrintersPoiLayer();
