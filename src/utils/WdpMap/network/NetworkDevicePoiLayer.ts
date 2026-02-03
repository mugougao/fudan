import to from "await-to-js";
import { fetchBuildingFloorNetworkDevice } from "@/api/network/campus.ts";
import PoiLayer from "../code/PoiLayer";

class NetworkDevicePoiLayer extends PoiLayer {
  layerId: string = "NetworkDevicePoiLayer";
  layerName: string = "楼栋楼层网络设备Poi点位";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(buildingId: string, floorId: string) {
    const [,res] = await to(fetchBuildingFloorNetworkDevice(buildingId, floorId));

    const result = new Map<string, any>();
    const locations: { id: string; lat: number; lon: number }[] = [];

    (res?.resultData || []).forEach((item) => {
      const { g, x, y, id } = item;
      const style = item.status === "RUNNING" ? "onLineNetworkDevice" : "offLineNetworkDevice";
      locations.push({ id, lon: x, lat: y });
      result.set(
        id,
        {
          id,
          name: id,
          label: "",
          location: [x, y, g],
          data: item,
          style,
        },
      );
    });
    const locationsOffset = await this.latAndLonToOffset(buildingId, floorId, locations);
    locationsOffset.forEach(({ id, location: [,,z] }) => {
      const [x, y] = result.get(id).location;
      result.get(id).location = [x, y, z];
    });
    // console.log("🚀 ~ NetworkDevicePoiLayer ~ fetchData ~ Array.from(result.values()):", Array.from(result.values()));
    this.setData(Array.from(result.values()));
  }

  async render(buildingId: string, floorId: string) {
    await this.removeAll();
    await this.fetchData(buildingId, floorId);
    const list = Array.from(this.layerDataMap.values());
    const coordZOffset = Math.max(...list.map(item => item.location[2]));
    return this.add(
      Array.from(this.layerDataMap.values()),
      "offLineNetworkDevice",
      { coordZRef: "altitude", coordZOffset },
    );
  }
}

// class NetworkDevicePoiLayer extends PoiLayer {
//   layerId: string = "NetworkDevicePoiLayer";
//   layerName: string = "楼栋楼层网络设备Poi点位";

//   onCreate() {

//   }

//   onUnmount() {
//     this.removeAll();
//   }

//   async fetchData(buildingId: string, floorId: string) {
//     const [,res] = await to(fetchBuildingFloorNetworkDevice(buildingId, floorId));
//     this.setData(
//       (res?.resultData || []).map((item) => {
//         const { g, x, y, id } = item;
//         return {
//           id,
//           name: id,
//           location: [x, y, g] as [number, number, number],
//           data: item,
//           style: item.status === "RUNNING" ? "onLineNetworkDevice" : "offLineNetworkDevice",
//         };
//       }),
//     );
//   }

//   async render(buildingId: string, floorId: string) {
//     await this.removeAll();
//     await this.fetchData(buildingId, floorId);
//     const list = Array.from(this.layerDataMap.values());
//     const coordZOffset = Math.max(...list.map(item => item.location[2]));
//     return this.add(
//       Array.from(this.layerDataMap.values()),
//       "offLineNetworkDevice",
//       { coordZRef: "ground", coordZOffset },
//     );
//   }
// }

export default new NetworkDevicePoiLayer();
