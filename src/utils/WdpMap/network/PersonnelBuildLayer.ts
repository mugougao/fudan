import PoiLayer from "../code/PoiLayer";

class PersonnelBuildLayer extends PoiLayer {
  layerId: string = "PersonnelBuildLayer";
  layerName: string = "人员分布楼宇";
  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async render(buildingId: string, name: string, x: string, y: string) {
    await this.removeAll();
    this.setData([
      {
        id: buildingId,
        name,
        location: [Number(x), Number(y), 0],
        data: {
          id: buildingId,
          name,
        },
      },
    ]);
    await this.add(Array.from(this.layerDataMap.values()), "buildNew");
    return this.flyTo(buildingId);
  }
}

export default new PersonnelBuildLayer();
