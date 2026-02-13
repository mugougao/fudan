import to from "await-to-js";
import { getDormitoryBuildingSpace } from "@/api/lifeServices";
import floorCameraInfo from "@/assets/json/smartTeaching/floorCameraInfo.json";
import { getBuildingUuidByNumericId } from "@/utils/buildingMapping";
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
    console.log("🏢 [DormitoryAreaOneBuildLayer] fetchData 开始:", {
      楼栋数字ID: buildId,
      已有数据: this.hasData(buildId),
    });

    if (this.hasData(buildId)) {
      console.log("🏢 [DormitoryAreaOneBuildLayer] 楼栋数据已存在，跳过获取");
      return;
    }

    const buildingUuid = getBuildingUuidByNumericId(buildId);
    console.log("🏢 [DormitoryAreaOneBuildLayer] ID映射结果:", {
      数字ID: buildId,
      映射UUID: buildingUuid,
      映射成功: !!buildingUuid,
    });

    if (!buildingUuid) {
      console.warn("⚠️ [DormitoryAreaOneBuildLayer] ID映射失败，无法获取楼栋数据");
      return;
    }

    console.log("🏢 [DormitoryAreaOneBuildLayer] 调用API获取楼栋空间数据:", {
      UUID: buildingUuid,
      API地址: `${import.meta.env.VITE_HTTP_BASE_URL}/getBuilding`,
      请求参数: { lyid: buildingUuid },
    });

    const [err, res] = await to(getDormitoryBuildingSpace(buildingUuid));

    if (err) {
      console.error("❌ [DormitoryAreaOneBuildLayer] API调用失败:", err);
      console.warn("⚠️ [DormitoryAreaOneBuildLayer] API超时或失败，尝试使用从layer-dianwei.json获取位置数据");
      
      // 临时方案：从 layer-dianwei.json 获取楼栋位置
      const layerDianweiData = await import("@/assets/json/layer-dianwei.json");
      const building = layerDianweiData.features.find((feature: any) => {
        const { id, lx } = feature.properties;
        return lx === "宿舍楼" && String(id) === buildId;
      });

      if (building) {
        const { geometry, properties } = building;
        const { coordinates } = geometry;
        const { name } = properties;
        
        const poiData = {
          id: buildingUuid,
          name,
          location: [...coordinates, 0] as [number, number, number],
          data: { id: buildingUuid, mc: name },
          style: this.specialBuildingIds.includes(buildingUuid) ? "dormitoryActive" : "dormitory",
        };

        console.log("✅ [DormitoryAreaOneBuildLayer] 使用本地数据创建POI:", poiData);
        this.pushData(poiData);
        return;
      }
      
      console.error("❌ [DormitoryAreaOneBuildLayer] 无法从本地数据获取楼栋信息");
      return;
    }

    const item = res?.resultData?.features?.[0];
    if (!item) {
      console.warn("⚠️ [DormitoryAreaOneBuildLayer] API返回数据为空");
      return;
    }

    const { geometry, properties = {} } = item;
    const { coordinates } = geometry;
    const { id, mc } = properties;

    const poiData = {
      id,
      name: mc,
      location: [...coordinates, 0] as [number, number, number],
      data: properties,
      style: this.specialBuildingIds.includes(id) ? "dormitoryActive" : "dormitory",
    };

    console.log("🏢 [DormitoryAreaOneBuildLayer] 楼栋数据获取成功:", {
      楼栋UUID: id,
      楼栋名称: mc,
      坐标: coordinates,
      是否特殊楼栋: this.specialBuildingIds.includes(id),
      POI样式: poiData.style,
    });

    this.pushData(poiData);
  }

  async render(buildId: string) {
    console.log("🏢 [DormitoryAreaOneBuildLayer] render 开始渲染楼栋:", {
      楼栋数字ID: buildId,
    });

    // 清除上次渲染
    await this.removeAll();

    // 获取数据
    await this.fetchData(buildId);

    // 渲染
    const data = this.getData(buildId);
    if (!data) {
      console.warn("⚠️ [DormitoryAreaOneBuildLayer] 无法获取楼栋数据，渲染失败");
      return;
    }

    console.log("🏢 [DormitoryAreaOneBuildLayer] 准备添加POI到地图:", {
      楼栋数据: data,
    });

    const result = await this.add(data);

    console.log("🏢 [DormitoryAreaOneBuildLayer] POI添加成功，开始飞行动画:", {
      目标楼栋ID: data.id,
      飞行参数: { distanceFactor: 100, rotation: { pitch: -50 } },
    });

    this.flyTo(data.id, { distanceFactor: 100, rotation: { pitch: -50 } });

    console.log("✅ [DormitoryAreaOneBuildLayer] 楼栋渲染完成");

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
