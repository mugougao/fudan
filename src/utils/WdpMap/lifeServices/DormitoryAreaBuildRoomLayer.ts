import { featureCollection, point, center as turfCenter } from "@turf/turf";
import to from "await-to-js";
import { getDormitoryRoomVector, getRoom } from "@/api/lifeServices";
import TextLayer from "@/utils/WdpMap/code/TextLayer";

class DormitoryAreaBuildRoomLayer extends TextLayer {
  readonly layerId: string = "DormitoryAreaBuildRoomRange";
  readonly layerName: string = "宿舍区楼栋房间面";

  activeBuildId: string = "";
  async onCreate() {
    await this.fetchData();
  }

  onUnmount() {
    this.removeAll();
    this.clearSplitBuild();
  }

  async fetchData() {
    const [, res] = await to(getDormitoryRoomVector());

    this.setData(
      (res?.resultData?.features || [])
        .map(({ geometry, properties }) => {
          const { coordinates } = geometry;
          const { id, mc } = properties;
          const location = turfCenter(
            featureCollection(
              coordinates.flat(2).map(item => point(item)),
            ),
          )?.geometry?.coordinates as [number, number];
          return {
            id,
            name: mc,
            location: [...location, 0],
            rotator: { pitch: -90, yaw: -90, roll: 0 },
            scale3d: [3, 1, 1],
            data: properties,
          };
        }),
    );
  }

  async getRoomDetail(roomId: string) {
    const [err, res] = await to(getRoom(roomId));
    if (err) return {};
    const { lcmc, fjh } = res?.resultData?.fjxx || {};
    return { floor: lcmc?.replace?.(/层/g, "") ?? lcmc, roomName: fjh };
  }

  // 楼宇拆解
  async splitBuild(buildId: string, floor: string) {
    if (!this.app) return;
    this.activeBuildId = buildId;
    const res = await this.app?.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id: buildId,
        floor,
        animation_type: 1,
      },
    });
    const { location } = this.getData(buildId) || {};
    if (!location) {
      this.app.CameraControl.FlyTo({
        targetPosition: location,
        rotation: { pitch: -45, yaw: -90 },
        distance: 10,
        flyTime: 1,
      });
    }
    return res;
  }

  // 清空楼宇拆解
  async clearSplitBuild() {
    if (!this.app) return;
    if (!this.activeBuildId) return;
    const result = await this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "SplitBuild",
      args: {
        build_id: this.activeBuildId,
        floor: 100,
        animation_type: "1",
      },
    });
    this.activeBuildId = "";
    return result;
  }

  // 添加房间 3d 文字
  async addRoomText(roomId: string, roomName: string) {
    if (!this.hasData(roomId)) {
      window?.$message?.error("为查询到该房间矢量面");
      return;
    }
    const data = this.getData(roomId)!;
    return this.add(
      { ...data, name: roomName },
      "room",
      { coordZOffset: 2 },
    );
  }

  async render(buildId: string, roomId: string) {
    const { floor, roomName } = await this.getRoomDetail(roomId);
    if (floor) {
      // 楼宇拆解
      this.splitBuild(buildId, floor);
    }
    if (roomName) {
      // 添加房间 3d文字
      await this.addRoomText(roomId, roomName);
    }
    return await this.focus(roomId, { rotation: { pitch: -90 }, distanceFactor: 0.1 });
  }
}

export default new DormitoryAreaBuildRoomLayer();
