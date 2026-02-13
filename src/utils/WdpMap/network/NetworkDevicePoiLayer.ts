// 导入本地JSON数据
import tbApFloorPointData from "@/assets/json/tb_ap_floor_point.json";
import wlApRoutingFilteredData from "@/assets/json/wl_ap_routing_filtered.json";

import PoiLayer from "../code/PoiLayer";

// ID映射：1019 -> 140, 1020 -> 141
function mapBuildingIdForApi(buildingId: string): string {
  const mapping: Record<string, string> = {
    1019: "140", // 第五教学楼
    1020: "141", // 第六教学楼
  };
  return mapping[buildingId] || buildingId;
}

// 从本地JSON文件获取网络设备数据
function getNetworkDeviceDataFromJson(buildingId: string, floorId: string): any[] {
  // 映射楼栋ID
  const mappedBuildingId = mapBuildingIdForApi(buildingId);

  // 根据楼栋ID和楼层ID过滤位置数据
  const locationData = tbApFloorPointData.filter((item: any) =>
    item.ldid === mappedBuildingId && item.lc === floorId,
  );

  // 构建楼栋名称映射
  const buildingNameMap: Record<string, string> = {
    140: "第五教学楼",
    141: "第六教学楼",
  };
  const targetBuildingName = buildingNameMap[mappedBuildingId];

  // 根据设备ID/名称关联状态数据
  return locationData.map((locationItem: any) => {
    const { id, g, x, y, ldid, lc, fj } = locationItem;

    // 在wl_ap_routing_filtered.json中查找对应的设备状态
    const statusItem = wlApRoutingFilteredData.find((apItem: any) => {
      // 匹配设备名称或MAC地址
      return apItem.name === id
        || (apItem.building_name === targetBuildingName
          && apItem.name.includes(id.substring(0, 10))); // 部分名称匹配
    });

    // 构建与API返回相同格式的数据
    return {
      id,
      g: Number.parseFloat(g) || 0,
      x: Number.parseFloat(x) || 0,
      y: Number.parseFloat(y) || 0,
      status: statusItem?.status || "UNKNOWN",
      ldid,
      lc,
      fj,
      // 从状态数据中获取其他字段
      mac: statusItem?.mac || "",
      vendor: statusItem?.vendor || "",
      model: statusItem?.model || "",
      last_connected_time: statusItem?.last_connected_time || "",
      campus_name: statusItem?.campus_name || "邯郸校区",
      building_name: statusItem?.building_name || targetBuildingName,
      floor_name: statusItem?.floor_name || "",
      ac: statusItem?.ac || "",
      is_enabled: statusItem?.is_enabled || "true",
      reboot_sum: statusItem?.reboot_sum || "0",
      bootstrap_sum: statusItem?.bootstrap_sum || "0",
      client_sum: statusItem?.client_sum || "0",
      ap_health: statusItem?.ap_health || "UNKNOWN",
    };
  });
}

class NetworkDevicePoiLayer extends PoiLayer {
  layerId: string = "NetworkDevicePoiLayer";
  layerName: string = "楼栋楼层网络设备Poi点位";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(buildingId: string, floorId: string) {
    // 从本地JSON文件获取数据，替代API调用
    const deviceData = getNetworkDeviceDataFromJson(buildingId, floorId);

    const result = new Map<string, any>();
    const locations: { id: string; lat: number; lon: number }[] = [];

    deviceData.forEach((item) => {
      const { g, x, y, id, status } = item;
      const style = status === "RUNNING" ? "onLineNetworkDevice" : "offLineNetworkDevice";
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

    // 映射楼栋ID用于坐标转换API
    const mappedBuildingId = mapBuildingIdForApi(buildingId);
    const locationsOffset = await this.latAndLonToOffset(mappedBuildingId, floorId, locations);
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
