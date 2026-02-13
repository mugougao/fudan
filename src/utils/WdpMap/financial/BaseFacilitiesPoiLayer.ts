import layerPoint from "@/assets/json/layer-dianwei.json";
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
    // 类型映射：开关类型 -> layer-dianwei.json中的lx字段值
    const typeToLxMap: Record<string, string> = {
      银行: "校区银行",
      自助补卡机: "一卡通自助补卡机",
      自助报账投递机: "自助报账投递机",
    };

    const targetLx = typeToLxMap[type];
    if (!targetLx) {
      this.setData([]);
      return;
    }

    // 校区ID到sid的映射
    const campusIdToSid: Record<string, string> = {
      [CampusId.HanDan]: "3",
      [CampusId.JiangWan]: "4",
      [CampusId.FengLin]: "1",
      [CampusId.ZhangJiang]: "2",
    };

    const targetSid = campusIdToSid[campusId];
    if (!targetSid) {
      this.setData([]);
      return;
    }

    // 从layer-dianwei.json中过滤数据
    const filteredFeatures = layerPoint.features.filter((feature) => {
      const sid = feature.properties.sid?.toString();
      const lx = feature.properties.lx;
      return sid === targetSid && lx === targetLx;
    });

    const list = filteredFeatures.map((feature) => {
      const { properties, geometry } = feature;
      const { id, name } = properties as { id?: number | string; name: string };
      const { coordinates } = geometry as { coordinates: number[] };
      const { icon } = this.iconMap.find(({ verify }) => verify(type, name)) || { icon: "bank" };
      const result = {
        id: id?.toString() || name,
        name,
        label: "",
        location: [coordinates[0] || 0, coordinates[1] || 0, 0] as [number, number, number],
        style: icon,
        type,
        data: { ...properties, type } as any,
      };
      return result;
    });

    this.setData(list);
  }
}
