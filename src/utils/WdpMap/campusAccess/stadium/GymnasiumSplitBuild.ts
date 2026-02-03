import CustomLayer from "../../code/CustomLayer";
import GymnasiumRoomCameraInfo from "./GymnasiumRoomCameraInfo.json";

//
class GymnasiumSplitBuild extends CustomLayer {
  layerId: string = "SwimmingPoolSplitBuild";
  layerName: string = "游泳场馆拆楼图层";

  currentBuildingId: string = "";

  fetchData(roomName: string) {
    return GymnasiumRoomCameraInfo.find(item => item.name == roomName);
  }

  splitRoom(roomName: string) {
    if (!this.app) return;
    const data = this.fetchData(roomName);
    if (!data) return;
    const { cameraInfo, floor, build_id } = data;
    this.currentBuildingId = build_id;
    this.app.CameraControl.FlyTo({
      ...cameraInfo,
      flyTime: 1,
    });
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id,
        floor,
        animation_type: 1,
      },
    });
  }

  splitFloor(floor: string) {
    if (!this.app) return;
    this.currentBuildingId = "JW_TYG";
    this.app.CameraControl.FlyTo({
      targetPosition: [121.49907945440704, 31.334455789089947, 150.5926487935174],
      rotation: { pitch: -45.21757507324219, yaw: -91.21257019042969 },
      distance: 10,
      flyTime: 1,
    });
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id: "JW_TYG",
        floor,
        animation_type: 1,
      },
    });
  }

  close() {
    if (!this.app) return;
    if (!this.currentBuildingId) return;
    const build_id = this.currentBuildingId;
    this.currentBuildingId = "";
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id,
        floor: 1000,
        animation_type: 1,
      },
    });
  }

  onCreate() {

  }

  onUnmount() {
    this.close();
  }
}

export default new GymnasiumSplitBuild();
