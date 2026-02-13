import geomDormRoomData from "@/assets/json/geom_dorm_room.json";
import layerDianweiData from "@/assets/json/layer-dianwei.json";
import buildingMapping from "@/utils/buildingMapping";
import RangeLayer from "../code/RangeLayer";

class OccupancyRateDistributionLayer extends RangeLayer {
  readonly layerId: string = "occupancyRateDistribution";
  readonly layerName: string = "入住率分布";

  standardMap: { name: string; color: string; verify: (num: number) => boolean }[] = [
    { color: "e74c3c", name: "≥95%", verify: num => num >= 95 },
    { color: "f1c40f", name: "≥80% & <95%", verify: num => num >= 80 && num < 95 },
    { color: "3498db", name: "<80%", verify: num => num < 80 },
  ];

  async onCreate() {
    await this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }

  // 获取数据
  async fetchData() {
    // 从本地JSON文件获取楼栋数据，按 lyid 聚合
    const buildingMap = new Map<string, any>();

    geomDormRoomData.features.forEach((feature: any) => {
      const { geometry, properties } = feature;
      const { coordinates } = geometry;
      const { id, name, lyid, g, d } = properties;

      if (!buildingMap.has(lyid)) {
        buildingMap.set(lyid, {
          id: lyid,
          name,
          coordinates,
          properties: {
            id: lyid,
            mc: name,
            g: Number(g) || 0,
            d: Number(d) || 0,
          },
        });
      }
    });

    this.setData(
      Array.from(buildingMap.values()).map((item) => {
        const { id, name, coordinates, properties } = item;
        const { color } = this.standardMap.find(({ verify }) => verify(Number(properties.d))) || { color: "e74c3c" };

        return {
          id,
          name,
          outerRingCoordinates: Array.from(
            new Set<string>(coordinates[0].map((item: any) => item.join(","))),
            (item: string) => item.split(",").map(Number) as [number, number],
          ),
          data: properties,
          style: {
            shape: "polygon",
            type: "box_wave",
            fillAreaType: "none",
            height: properties.g,
            strokeWeight: 15,
            color: `${color}CC`,
          },
        };
      }),
    );
  }

  async render(dormitoryAreaId: string) {
    // 1. 从layer-dianwei.json中筛选出指定宿舍区的所有宿舍楼栋
    const dormitoryBuildings = layerDianweiData.features.filter((feature: any) => {
      const { lx, id_1 } = feature.properties;
      return lx === "宿舍楼" && id_1 === dormitoryAreaId;
    });

    if (dormitoryBuildings.length === 0) {
      window.$message.warning("该区域暂无宿舍楼数据!!!");
      return;
    }

    // 2. 获取这些楼栋的名称列表
    const buildingNames = dormitoryBuildings.map(({ properties: { name } }: any) => name);
    // 3. 根据楼栋名称找到对应的lyid
    const buildingLyids = buildingNames
      .map(name => buildingMapping[name])
      .filter(lyid => lyid !== undefined);

    if (buildingLyids.length === 0) {
      window.$message.warning("未找到楼栋的几何数据!!!");
      return;
    }

    // 4. 从geom_dorm_room.json中获取这些lyid对应的入住率数据
    const buildingDataMap = new Map<string, { lyid: string; d: number }>();

    geomDormRoomData.features.forEach((feature: any) => {
      const { lyid, d } = feature.properties;
      if (buildingLyids.includes(lyid) && !buildingDataMap.has(lyid)) {
        buildingDataMap.set(lyid, {
          lyid,
          d: Number(d) || 0,
        });
      }
    });

    // 5. 筛选出有数据的楼栋并渲染
    const list = Array.from(buildingDataMap.values())
      .filter(item => this.hasData(item.lyid))
      .map((item) => {
        const data = this.getData(item.lyid);
        if (!data) return null;
        const { color } = this.standardMap.find(({ verify }) => verify(Number(item.d))) || { color: "e74c3c" };
        return {
          ...data,
          style: {
            shape: "polygon",
            type: "box_wave",
            fillAreaType: "none",
            height: data?.data?.g,
            strokeWeight: 15,
            color: `${color}CC`,
          },
        };
      })
      .filter((item: any): item is NonNullable<typeof item> => item !== null);

    if (!list.length) {
      window.$message.warning("该区域暂无数据!!!");
      return;
    }
    const result = await this.add(list);
    this.focusAll();
    return result;
  }
}

export default new OccupancyRateDistributionLayer();
