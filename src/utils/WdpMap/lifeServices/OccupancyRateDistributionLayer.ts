import to from "await-to-js";
import { getCheckInRate, getDormitoryBuildingVector } from "@/api/lifeServices";
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
    const [, res] = await to(getDormitoryBuildingVector());

    this.setData(
      (res?.resultData?.features || []).map((item) => {
        const { geometry, properties } = item;
        const { coordinates } = geometry;
        const { id, mc, g, d } = properties;
        const { color } = this.standardMap.find(({ verify }) => verify(Number(d))) || { color: "e74c3c" };

        return {
          id,
          name: mc,
          outerRingCoordinates: Array.from(
            new Set(coordinates.flat(2).map(item => item.join(","))),
            item => item.split(",").map(Number) as [number, number],
          ),
          data: properties,
          style: {
            shape: "polygon",
            type: "box_wave",
            fillAreaType: "none",
            height: g,
            strokeWeight: 15,
            color: `${color}CC`,
          },
        };
      }),
    );
  }

  async render(dormitoryAreaId: string) {
    const [, res] = await to(getCheckInRate(dormitoryAreaId));
    const list = (res?.resultData || []).reduce(
      (prev, curr) => {
        const { num, lyid } = curr;
        if (this.hasData(lyid)) {
          const data = this.getData(lyid);
          const { color } = this.standardMap.find(({ verify }) => verify(Number(num))) || { color: "e74c3c" };
          prev.push({
            ...data,
            style: {
              shape: "polygon",
              type: "box_wave",
              fillAreaType: "none",
              height: data?.data?.g,
              strokeWeight: 15,
              color: `${color}CC`,
            },
          });
        }
        return prev;
      },
      [] as any[],
    );
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
