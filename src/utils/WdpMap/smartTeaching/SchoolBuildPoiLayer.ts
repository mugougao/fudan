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
    // 硬编码教学楼点位数据，从CSV文件中提取
    // 原始CSV数据格式：id,mc,campus,geom,坐标点数量,"坐标数据(X,Y)",supnme
    const campusNameMap = {
      3: "邯郸校区",
      4: "江湾校区",
      1: "枫林校区",
      2: "张江校区",
    };

    const targetCampusName = campusNameMap[campusId as unknown as keyof typeof campusNameMap];

    // 硬编码教学楼数据
    const buildingData = [
      { id: "141", mc: "H6 ★", campus: "邯郸校区", coordinates: [121.500003, 31.29699], supnme: "JXL6" },
      { id: "140", mc: "H5 ★", campus: "邯郸校区", coordinates: [121.499796, 31.297452], supnme: "JXL5" },
      { id: "144", mc: "JB", campus: "江湾校区", coordinates: [121.499611, 31.338676], supnme: "" },
      { id: "143", mc: "JA", campus: "江湾校区", coordinates: [121.50071, 31.338324], supnme: "" },
      { id: "139", mc: "H4", campus: "邯郸校区", coordinates: [121.497003, 31.300505], supnme: "" },
      { id: "178", mc: "H光学楼", campus: "邯郸校区", coordinates: [121.497003, 31.299887], supnme: "" },
      { id: "170", mc: "H光华东辅楼", campus: "邯郸校区", coordinates: [121.501594, 31.301953], supnme: "" },
      { id: "171", mc: "H光华西辅楼", campus: "邯郸校区", coordinates: [121.500054, 31.301953], supnme: "" },
      { id: "142", mc: "HQ新闻", campus: "邯郸校区", coordinates: [121.505211, 31.30164], supnme: "" },
      { id: "138", mc: "H3", campus: "邯郸校区", coordinates: [121.49978, 31.300105], supnme: "" },
      { id: "137", mc: "H2", campus: "邯郸校区", coordinates: [121.499969, 31.299669], supnme: "" },
      { id: "264", mc: "H元创中心", campus: "邯郸校区", coordinates: [121.500595, 31.302801], supnme: "" },
    ];

    // 根据校区过滤数据
    const filteredData = buildingData.filter(building =>
      targetCampusName ? building.campus === targetCampusName : true,
    );

    // 转换为图层需要的格式
    const features = filteredData.map(building => ({
      id: building.id,
      name: building.mc,
      location: [...building.coordinates, 0] as [number, number, number],
      data: {
        id: building.id,
        mc: building.mc,
        campus: building.campus,
        supnme: building.supnme,
      },
    }));

    this.setData(features);

    // 注释掉原来的API调用
    // const [,res] = await to(getSchoolBuildLayer(campusId));
    // this.setData(
    //   (res?.resultData?.features || [])?.map((item: any) => {
    //     const { geometry: { coordinates }, properties } = item;
    //     const id = item.properties.id;
    //     const name = item.properties.mc;
    //     return {
    //       id,
    //       name,
    //       location: [...coordinates, 0] as [number, number, number],
    //       data: properties,
    //     };
    //   }),
    // );
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
  //   this.cloudMap?.SuperAPI("CrystalSplit", { BuildID: buildId, Floor: floor });
  // }

  // // 清空楼宇拆解
  // async clearSplitBuild() {
  //   // if (!this.activeBuildId) return;
  //   // 关闭抽出的楼层
  //   // this.cloudMap?.SuperAPI("CrystalSplit", { BuildID: this.activeBuildId, Floor: 100 });
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
