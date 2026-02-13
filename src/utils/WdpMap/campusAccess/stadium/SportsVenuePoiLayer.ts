import PoiLayer from "@/utils/WdpMap/code/PoiLayer.ts";

class SportsVenuePoiLayer extends PoiLayer<any> {
  layerId: string = "SportsVenuePoiLayer";
  layerName: string = "运动场馆Poi图层";

  async fetchData() {
    // 硬编码运动场馆数据，从 tb_arena.csv 中提取
    const hardcodedData = [
      {
        id: "1",
        name: "江湾体育馆 ★",
        location: [121.499069, 31.335651, 0] as [number, number, number],
        data: {
          id: "1",
          mc: "江湾体育馆 ★",
          xq: "江湾",
          geom: "0101000000A35C1ABFF05F5E40A4DE5339ED553F40",
          坐标点数量: 1,
          坐标数据: "(121.499069,31.335651)",
        },
      },
    ];
    this.setData(hardcodedData);
  }

  async render() {
    const result = await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    this.app?.CameraControl.FlyTo({
      targetPosition: [121.49885624935501, 31.33441819030393, 133.03574781903944],
      rotation: { pitch: -30, yaw: -90 },
    });
    return result;
  }

  onCreate() {
    return this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }
}

export default new SportsVenuePoiLayer();
