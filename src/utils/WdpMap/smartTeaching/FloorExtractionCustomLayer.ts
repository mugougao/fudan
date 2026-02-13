import floorCameraInfo from "@/assets/json/smartTeaching/floorCameraInfo.json";
import roomCameraInfo from "@/assets/json/smartTeaching/roomCameraInfo.json";
import roomCameraMapping from "@/assets/json/smartTeaching/roomCameraMapping.json";
import CustomLayer from "../code/CustomLayer";

// ID映射：1019 -> 140, 1020 -> 141
function mapBuildingIdForApi(buildingId: string): string {
  const mapping: Record<string, string> = {
    1019: "140", // 第五教学楼
    1020: "141", // 第六教学楼
  };
  return mapping[buildingId] || buildingId;
}

class FloorExtractionCustomLayer extends CustomLayer {
  layerId: string = "floorExtractionCustomLayer";
  layerName: string = "楼层抽出";
  mode: "dark" | "light" = "dark";
  splitMethod: "DrawerSplit" | "CrystalSplit" = "CrystalSplit";

  // 当前操作的楼栋
  currentDoBuilding: string = "";
  // 当前操作的楼层
  currentDoFloor: string = "";

  onCreate() {

  }

  onUnmount() {
    this.restore();
  }

  setSplitMethod(method: "DrawerSplit" | "CrystalSplit") {
    this.splitMethod = method;
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

    // 映射楼栋ID用于API调用
    const mappedBuildingId = mapBuildingIdForApi(building);

    const apiFuncName = this.splitMethod === "DrawerSplit"
      ? "DoBuildingRaise"
      : "DoCrystalBuildingRaise";

    const params = {
      apiClassName: "CustomAPI",
      apiFuncName,
      args: {
        BuildID: mappedBuildingId,
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

    // 映射楼栋ID用于API调用
    const mappedBuildingId = mapBuildingIdForApi(this.currentDoBuilding);

    const params = {
      apiClassName: "CustomAPI",
      apiFuncName: this.splitMethod,
      args: {
        BuildID: mappedBuildingId,
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

    // 映射楼栋ID用于API调用
    const mappedBuildingId = mapBuildingIdForApi(this.currentDoBuilding);

    const apiFuncName = this.splitMethod === "DrawerSplit"
      ? "DoBuildingRaise"
      : "DoCrystalBuildingRaise";

    const params = {
      apiClassName: "CustomAPI",
      apiFuncName,
      args: {
        BuildID: mappedBuildingId,
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
    // 映射楼栋ID用于查找相机信息
    const mappedBuildingId = mapBuildingIdForApi(_buildId);

    const result = floorCameraInfo.find(({ buildId, floorId }) => {
      return buildId === mappedBuildingId && floorId === _floor;
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
    // 参数验证
    if (!_buildId || !_floor || !_roomId) {
      console.warn("focusRoom 参数无效:", { _buildId, _floor, _roomId });
      return this.focusFloor(_buildId || "141", Number.parseInt(_floor || "1"));
    }

    // 映射楼栋ID用于查找相机信息
    const mappedBuildingId = mapBuildingIdForApi(_buildId);

    // 提取纯房间号（支持从复合ID如"101_1"中提取"101"）
    const targetRoomNumber = _roomId.includes("_") ? _roomId.split("_")[0] : _roomId;

    // 步骤1：尝试从映射表中查找对应的相机ID
    let cameraId: string | undefined;
    if (roomCameraMapping[mappedBuildingId]?.[_floor]?.[targetRoomNumber]) {
      cameraId = roomCameraMapping[mappedBuildingId][_floor][targetRoomNumber];
      console.log(`从映射表中找到房间 ${mappedBuildingId}-${_floor}-${targetRoomNumber} 的相机ID: ${cameraId}`);
    }

    // 步骤2：如果有映射的相机ID，直接使用它查找相机数据
    let target;
    if (cameraId) {
      target = roomCameraInfo.find(({ id }) => id === cameraId);
      if (!target) {
        console.warn(`映射表中指定的相机ID ${cameraId} 在roomCameraInfo.json中未找到`);
      }
    }

    // 步骤3：如果映射查找失败，回退到原来的模糊匹配逻辑
    if (!target) {
      console.warn(`房间 ${targetRoomNumber} 在楼栋 ${mappedBuildingId} 楼层 ${_floor} 中未找到映射或映射无效，尝试模糊匹配`);

      // 获取同一楼栋楼层的所有可用房间
      const availableRooms = roomCameraInfo.filter(({ id }) => {
        const [,buildId, floor] = id.split("_");
        return buildId === mappedBuildingId && floor.replace("F", "") === _floor;
      });

      if (availableRooms.length === 0) {
        console.warn(`楼栋 ${mappedBuildingId} 楼层 ${_floor} 没有任何房间相机数据，将聚焦到楼层视图`);
        return this.focusFloor(_buildId, Number.parseInt(_floor));
      }

      // 尝试将目标房间号转为数字进行近似匹配
      const targetNum = Number(targetRoomNumber);
      if (!Number.isNaN(targetNum)) {
        // 计算每个可用房间与目标房间的数字差值
        const roomsWithDistance = availableRooms.map((room) => {
          const [, , , roomId] = room.id.split("_");
          const roomNum = Number(roomId);
          const distance = Number.isNaN(roomNum) ? Infinity : Math.abs(roomNum - targetNum);
          return { room, distance, roomId };
        });

        // 按距离排序，选择最接近的房间
        roomsWithDistance.sort((a, b) => a.distance - b.distance);
        const closestRoom = roomsWithDistance[0];

        if (closestRoom.distance !== Infinity) {
          console.warn(`找到最接近的房间 ${closestRoom.roomId}（距离：${closestRoom.distance}），将使用该房间的相机视角`);
          target = closestRoom.room;
        }
      }

      // 如果数字匹配失败，选择同一楼栋楼层的第一个可用房间
      if (!target && availableRooms.length > 0) {
        console.warn(`无法进行数字匹配，将使用楼栋 ${mappedBuildingId} 楼层 ${_floor} 的第一个可用房间`);
        target = availableRooms[0];
      }
    }

    if (!target) {
      // 如果仍然找不到房间匹配，执行楼层聚焦作为回退
      console.warn(mappedBuildingId, _floor, _roomId, "当前房间无法聚焦，将聚焦到楼层视图");
      return this.focusFloor(_buildId, Number.parseInt(_floor));
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
