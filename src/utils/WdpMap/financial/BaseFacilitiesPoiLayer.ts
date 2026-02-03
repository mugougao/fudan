import to from "await-to-js";
import { fetchInfrastructurePoint } from "@/api/financial/index.ts";
import { CampusId } from "@/enums";
import PoiLayer from "../code/PoiLayer";

export class BaseFacilitiesPoiLayer extends PoiLayer {
  layerId: string = "BaseFacilitiesPoiLayer";
  layerName: string = "校园总览-基础设施点位";

  iconMap = [
    {
      icon: "chinaBank",
      verify: (type: string, name: string) => type === "银行" && name.includes("中国银行"),
    },
    {
      icon: "agricultureBank",
      verify: (type: string, name: string) => type === "银行" && name.includes("农业银行"),
    },
    {
      icon: "postalBank",
      verify: (type: string, name: string) => type === "银行" && (name.includes("邮政银行") || name.includes("邮局")),
    },
    {
      icon: "cardReplacementMachine",
      verify: (type: string) => type === "自助补卡机",
    },
    {
      icon: "selfServiceExpenseReportKiosk",
      verify: (type: string) => type === "自助报账投递机",
    },
  ];

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: CampusId = CampusId.Overview, type: string) {
    const [,res] = await to(fetchInfrastructurePoint(campusId, type));
    const list = (res?.resultData?.features ?? []).map((item) => {
      const { properties = {}, geometry = {} } = item;
      const { id, name } = properties;
      const { coordinates = [] } = geometry;
      const { icon } = this.iconMap.find(({ verify }) => verify(type, name)) || { icon: "bank" };
      const result = {
        id,
        name,
        label: "",
        location: [...coordinates, 0] as [number, number, number],
        style: icon,
        type,
        data: { ...properties, type },
      };
      return result;
    });
    this.setData(list);
  }
}
