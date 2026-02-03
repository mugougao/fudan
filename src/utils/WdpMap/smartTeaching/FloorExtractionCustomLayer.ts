import floorCameraInfo from "@/assets/json/smartTeaching/floorCameraInfo.json";
import roomCameraInfo from "@/assets/json/smartTeaching/roomCameraInfo.json";
import CustomLayer from "../code/CustomLayer";

class FloorExtractionCustomLayer extends CustomLayer {
  layerId: string = "floorExtractionCustomLayer";
  layerName: string = "楼层抽出";
  mode: "dark" | "light" = "dark";

  // 当前操作的楼栋
  currentDoBuilding: string = "";
  // 当前操作的楼层
  currentDoFloor: string = "";

  onCreate() {

  }

  onUnmount() {
    this.restore();
  }

  openDark() {
    if (!this.app) return;
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "EC_DoCrystal",
      args: { state: true },
    });
  }

  closeDark() {
    if (!this.app) return;
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "EC_DoCrystal",
      args: { state: false },
    });
  }

  // 散开 楼栋
  disperse(building: string, mode: "dark" | "light" = "dark") {
    this.mode = mode;
    if (this.currentDoBuilding === building) return;
    this.restore();
    if (!this.app) return;
    this.currentDoBuilding = building;

    if (this.mode === "dark") {
      this.openDark();
    }

    const params = this.mode === "dark"
      ? {
          apiClassName: "CustomAPI",
          apiFuncName: "DoCrystalBuildingRaise",
          args: {
            BuildID: building,
            Raise: "1",
          },
        }
      : {
          apiClassName: "CustomAPI",
          apiFuncName: "DoBuildingRaise",
          args: {
            BuildID: building,
            Raise: "1",
          },
        };
    return this.app.Customize.RunCustomizeApi(params);
  }

  // 抽出楼层
  extract(floor: string) {
    // debugger;
    if (!this.app) return;
    if (!this.currentDoBuilding) {
      throw new Error("抽出楼层前请选择散开楼栋: disperse");
    }
    this.currentDoFloor = floor;
    const params = this.mode === "dark"
      ? {
          apiClassName: "CustomAPI",
          apiFuncName: "CrystalSplit",
          args: {
            BuildID: this.currentDoBuilding,
            Floor: floor,
          },
        }
      : {
          apiClassName: "CustomAPI",
          apiFuncName: "DrawerSplit",
          args: {
            BuildID: this.currentDoBuilding,
            Floor: floor,
          },
        };

    return this.app.Customize.RunCustomizeApi(params);
  }

  // 恢复楼栋
  restore() {
    if (!this.currentDoBuilding) return;
    if (!this.app) return;
    if (this.mode === "dark") {
      this.closeDark();
    }
    const params = this.mode === "dark"
      ? {
          apiClassName: "CustomAPI",
          apiFuncName: "DoCrystalBuildingRaise",
          args: {
            BuildID: this.currentDoBuilding,
            Raise: "0",
          },
        }
      : {
          apiClassName: "CustomAPI",
          apiFuncName: "DoBuildingRaise",
          args: {
            BuildID: this.currentDoBuilding,
            Raise: "0",
          },
        };
    return this.app.Customize
      .RunCustomizeApi(params)
      .then((res) => {
        this.mode = "dark";
        this.currentDoBuilding = "";
        this.currentDoFloor = "";
        return res;
      });
  }

  /**
   * 楼层视角 聚焦
   * @param _buildId
   * @param _floor
   */
  focusFloor(_buildId: string, _floor: number) {
    const result = floorCameraInfo.find(({ buildId, floorId }) => {
      return buildId === _buildId && floorId === _floor;
    });
    if (!result) {
      window.$message.warning("当前教学楼楼层无法聚焦!!!");
      return;
    }
    return this.app?.CameraControl?.FlyTo({
      ...(this.mode === "dark" ? result.darkCameraInfo : result.cameraInfo),
      distance: 1,
      flyTime: 1,
    });
  }

  /**
   * 房间视角 聚焦
   * @param _buildId
   * @param _floor
   * @param _roomId
   */
  focusRoom(_buildId: string, _floor: string, _roomId: string) {
    // lon, lat, Height, Pitch, Yaw
    const target = roomCameraInfo.find(({ id }) => {
      // id: cam_141_1F_576
      const [,buildId, floor, roomId] = id.split("_");
      return buildId === _buildId
        && floor.replace("F", "") === _floor
        && roomId === _roomId;
    });

    if (!target) {
      window.$message.warning("当前房间无法聚焦!!!");
      return;
    }
    const { lon, lat, Height, Pitch, Yaw } = target;
    return this.app?.CameraControl?.FlyTo({
      targetPosition: [lon, lat, Height].map(Number),
      rotation: { pitch: Number(Pitch), yaw: Number(Yaw) },
      distance: 0,
      flyTime: 1,
    });
  }
}

export default new FloorExtractionCustomLayer();
