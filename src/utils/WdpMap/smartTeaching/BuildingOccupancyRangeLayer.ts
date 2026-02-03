import to from "await-to-js";
import { getBuildingVectorData } from "@/api/smartTeaching";
import RangeLayer from "../code/RangeLayer";

class BuildingOccupancyRangeLayer extends RangeLayer<any> {
  readonly layerId: string = "buildingOccupancyRangeLayer";
  readonly layerName: string = "教学楼使用率";

  onCreate() {
    this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }

  removeAll() {
    this.closeDark();
    return super.removeAll();
  }

  async fetchData() {
    const [err, res] = await to(getBuildingVectorData());
    if (err) return;
    this.setData(
      (res?.resultData?.features || [])?.map((item) => {
        const { geometry, properties } = item;
        const { coordinates } = geometry;
        const { id, mc } = properties;
        return {
          id,
          name: mc,
          outerRingCoordinates: Array.from(
            new Set(coordinates.flat(2).map(item => item.join(","))),
            item => item.split(",").map(Number) as [number, number],
          ),
          data: properties,
        };
      }),
    );
  }

  async render(params: { id: string; color: string }[]) {
    this.openDark();
    const list = params.reduce((prev, curr) => {
      if (this.hasData(curr.id)) {
        const data = this.getData(curr.id);
        prev.push({
          ...data,
          style: {
            shape: "polygon",
            type: "box_wave",
            fillAreaType: "block",
            height: data?.data?.g,
            strokeWeight: 10,
            color: curr.color,
          },
        });
      }
      return prev;
    }, [] as any[]);
    const result = await this.add(list);
    this.focusAll();
    return result;
  }
}

export default new BuildingOccupancyRangeLayer();
