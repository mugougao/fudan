import to from "await-to-js";
import { getDormitoryBuildingSpace } from "@/api/lifeServices";
import floorCameraInfo from "@/assets/json/smartTeaching/floorCameraInfo.json";
import PoiLayer from "../code/PoiLayer";

class DormitoryAreaOneBuildLayer extends PoiLayer {
  readonly layerId: string = "dormitoryAreaOneBuildLayer";
  readonly layerName: string = "宿舍区指定楼宇";
  activeBuildId: string = "";
  // 特殊楼栋
  specialBuildingIds = [
    "99b6db0a998d44b99e5b46a897a9ebe6",
    "5fe3e6c08d35465d9724d0effab79df9",
    "c0893dca05594416a25ddd2a55f330cc",
    "e533f6839ff3484e8613c60facef44b0",
    "7ffeb7f555cb4a7f804673e3f21290d4",
  ];

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(buildId: string) {
    if (this.hasData(buildId)) return;
    const [, res] = await to(getDormitoryBuildingSpace(buildId));
    const item = res?.resultData?.features?.[0];
    if (!item) return;
    const { geometry, properties = {} } = item;
    const { coordinates } = geometry;
    const { id, mc } = properties;
    this.pushData({
      id,
      name: mc,
      location: [...coordinates, 0] as [number, number, number],
      data: properties,
      style: this.specialBuildingIds.includes(id) ? "dormitoryActive" : "dormitory",
    });
  }

  async render(buildId: string) {
    // 清除上次渲染
    await this.removeAll();
    // 获取数据
    await this.fetchData(buildId);
    // 渲染
    const data = this.getData(buildId);
    if (!data) return;
    const result = await this.add(data);
    this.flyTo(data.id, { distanceFactor: 100, rotation: { pitch: -50 } });
    return result;
  }

  // 楼宇拆解
  async splitBuild(buildId: string, floor: string) {
    // const result = await this.cloudMap?.SuperAPI("SplitBuild", { build_id: buildId, floor, animation_type: "1" });
    // this.activeBuildId = buildId;
    // const { coord } = this.getLayerData(buildId);
    // this.SetCameraInfo(coord, 20 * Number(floor), 0, { pitch: 89, yaw: 0 });
    // return result;
    if (!this.app) return;
    this.activeBuildId = buildId;
    const result = this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id: buildId,
        floor,
        animation_type: "1",
      },
    });
    const cameraInfo = floorCameraInfo.find((item) => {
      return item.buildId === buildId && item.floorId === Number(floor);
    });
    if (cameraInfo) {
      this.app?.CameraControl?.FlyTo({
        ...cameraInfo.cameraInfo,
        distance: 1,
        flyTime: 1,
      });
    }

    return result;
  }

  // 清空楼宇拆解
  async clearSplitBuild() {
    // if (!this.activeBuildId) return;
    // const params = {
    //   build_id: this.activeBuildId,
    //   animation_type: "1",
    //   floor: 100,
    // };
    // console.log("=>(DormitoryAreaOneBuildLayer.ts:85) params", params);
    // const result = await this.cloudMap?.SuperAPI("SplitBuild", params);
    // this.activeBuildId = "";
    // return result;

    if (!this.activeBuildId) return;
    if (!this.app) return;
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id: this.activeBuildId,
        animation_type: "1",
        floor: 100,
      },
    });
  }
}

export default new DormitoryAreaOneBuildLayer();
