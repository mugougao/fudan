import to from "await-to-js";
import { getSchoolBuildLayer } from "@/api/smartTeaching";
import PoiLayer from "../code/PoiLayer";

// 教学楼 点位
class SchoolBuildPoiLayer extends PoiLayer<any> {
  readonly layerId: string = "schoolBuildLayer";
  readonly layerName: string = "教学楼点位";

  activeBuildId: string = "";
  activeBuildFloor: string = "";

  // 炸开的楼栋
  doBuildingRaise_buildId = "";

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }

  async fetchData(campusId: string) {
    const [,res] = await to(getSchoolBuildLayer(campusId));
    this.setData(
      (res?.resultData?.features || [])?.map((item: any) => {
        const { geometry: { coordinates }, properties } = item;
        const id = item.properties.id;
        const name = item.properties.mc;
        return {
          id,
          name,
          location: [...coordinates, 0] as [number, number, number],
          data: properties,
        };
      }),
    );
  }

  async render(campusId: string) {
    await this.fetchData(campusId);
    const res = await this.add(
      Array.from(this.layerDataMap.values()),
      "marker",
    );
    this.focusAll();
    return res;
  }

  // 炸开楼层  - 需要先炸开才能 楼层抽出
  // async doBuildingRaise(buildId: string) {
  //   this.cloudMap?.SuperAPI("DoBuildingRaise", { BuildID: buildId, Raise: "1" });
  //   this.doBuildingRaise_buildId = buildId;
  //   await sleep(3000);
  // }

  // // 关闭炸开楼栋
  // closeBuildingRaise() {
  //   if (!this.doBuildingRaise_buildId) return;
  //   this.cloudMap?.SuperAPI("DoBuildingRaise", { BuildID: this.doBuildingRaise_buildId, Raise: "0" });
  //   this.doBuildingRaise_buildId = "";
  // }

  // // 楼层抽出
  // async splitBuild(buildId: string, floor: number) {
  //   this.activeBuildId = buildId;
  //   if (!this.doBuildingRaise_buildId) {
  //     await this.doBuildingRaise(buildId);
  //   }
  //   this.activeBuildFloor = floor.toString();
  //   this.cloudMap?.SuperAPI("DrawerSplit", { BuildID: buildId, Floor: floor });
  // }

  // // 清空楼宇拆解
  // async clearSplitBuild() {
  //   // if (!this.activeBuildId) return;
  //   // 关闭抽出的楼层
  //   // this.cloudMap?.SuperAPI("DrawerSplit", { BuildID: this.activeBuildId, Floor: 100 });
  //   this.closeBuildingRaise();
  //   this.activeBuildId = "";
  //   this.activeBuildFloor = "";
  // }

  // /**
  //  * 楼层视角 聚焦
  //  * @param _buildId
  //  * @param _floor
  //  */
  // focusFloor(_buildId: string, _floor: number) {
  //   const result = floorCameraInfo.find(({ buildId, floorId }) => {
  //     return buildId === _buildId && floorId === _floor;
  //   });
  //   if (!result) {
  //     window.$message.warning("当前教学楼楼层无法聚焦!!!");
  //     return;
  //   }
  //   return this.cloudMap?.SuperAPI("SetCameraInfo", result.cameraInfo);
  // }

  // /**
  //  * 教室视角 聚焦
  //  * @param _buildId
  //  * @param _roomId
  //  */
  // async focusFloorRoom(_buildId: string, _roomId: string) {
  //   const { cameraInfo } = floorRoomCameraInfo.find(({ roomId, buildId }) => {
  //     return roomId === _roomId && buildId === _buildId;
  //   }) || {};
  //   if (!cameraInfo) {
  //     window.$message.warning("当前教学楼教室无法聚焦!!!");
  //     return;
  //   }
  //   // 镜头解除限制
  //   return this.cloudMap?.SuperAPI(
  //     "ResetCameraSpace",
  //     { state: "free" },
  //     (_back: any) => {
  //       this.cloudMap?.SuperAPI("SetCameraInfo", cameraInfo);
  //     },
  //   );
  //   // return this.cloudMap?.SuperAPI("SetCameraInfo", cameraInfo);
  // }

  // /**
  //  * 聚焦覆盖物
  //  * @param ids
  //  * @param distance
  //  * @param yaw
  //  * @param covering_type
  //  * @param cameraConfig
  //  */
  // async focusCovering(ids: string | string[], distance = 1000, yaw: number = 0, covering_type?: CoveringType, cameraConfig = {}) {
  //   if (typeof ids === "string") {
  //     const cameraInfoMap = {
  //       140: {
  //         center_coord: "121.499979,31.298285",
  //         coord_z: "10.88",
  //         arm_distance: "223.539734",
  //         pitch: "30.0",
  //         yaw: "0.0",
  //       },
  //       141: {
  //         center_coord: "121.500057,31.298110",
  //         coord_z: "10.24",
  //         arm_distance: "278.422699",
  //         pitch: "30.0",
  //         yaw: "0.0",
  //       },
  //     };
  //     if (cameraInfoMap[ids]) {
  //       return this.cloudMap?.SuperAPI(
  //         "SetCameraInfo",
  //         {
  //           ...cameraInfoMap[ids],
  //           ...cameraConfig,
  //         },
  //       );
  //     }
  //   }
  //   return super.focusCovering(ids, distance, yaw, covering_type, cameraConfig);
  // }
}

export default new SchoolBuildPoiLayer();
