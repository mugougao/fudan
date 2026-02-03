import type { CampusId } from "@/enums";
import { BaseFacilitiesPoiLayer } from "./BaseFacilitiesPoiLayer";

class BaseFacilitiesBankPoiLayer extends BaseFacilitiesPoiLayer {
  layerId: string = "BaseFacilitiesBankPoiLayer";
  layerName: string = "校园总览-基础设施点位-银行";

  async render(campusId: CampusId) {
    await this.fetchData(campusId, "银行");
    await this.add(Array.from(this.layerDataMap.values()));
    this.focusAll();
  }
}

export default new BaseFacilitiesBankPoiLayer();
