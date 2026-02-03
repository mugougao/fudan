import PoiLayer from "../../code/PoiLayer";

class ResearchRoomPoiLayer extends PoiLayer {
  layerId: string = "ResearchRoomPoiLayer";
  layerName: string = "科研中心房间poi点位";
  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData() {
    const buildId = "141";
    const floorId = "4";
    const data = [
      {
        id: "517",
        name: "电镜中心",
        location: ["121.500013168873", "31.2968837722683", "0"],
        data: { buildId, floorId },
        style: "dormitory",
      },
    ];

    const dataMap = new Map<string, any>();

    data.forEach((item) => {
      dataMap.set(item.id, item);
    });

    const result = await this.latAndLonToOffset(
      buildId,
      floorId,
      data.map(({ id, location }) => ({
        id,
        lat: location[1],
        lon: location[0],
      })),
    );
    // console.log("🚀 ~ ResearchRoomPoiLayer ~ fetchData ~ result:", result);
    result.forEach(({ id, location }, index) => {
      const rawLocation = data[index].location || [];
      const [x, y] = rawLocation;
      dataMap.get(id).location = [x, y, location[2]];
    });
    this.setData(Array.from(dataMap.values()));
  }

  async render() {
    await this.fetchData();
    const list = Array.from(this.layerDataMap.values());
    this.add(
      list,
      "dormitory",
      { coordZRef: "altitude", coordZOffset: Math.max(...list.map(item => item.location[2])) },
    );
  }
}

export default new ResearchRoomPoiLayer();
