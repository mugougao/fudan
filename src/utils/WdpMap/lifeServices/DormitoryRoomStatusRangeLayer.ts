import to from "await-to-js";
import { getBuildingRoomStatus, getBuildRoomTable } from "@/api/lifeServices";
import { getBuildingUuidByNumericId } from "@/utils/buildingMapping";
import CustomLayer from "../code/CustomLayer";

class DormitoryRoomStatusRangeLayer extends CustomLayer {
  readonly layerId: string = "dormitoryRoomStatus";
  readonly layerName: string = "宿舍房间状态";

  showVectorFacesBuildId: string | null = null;

  // 渲染 过的 range 配置
  renderedRangeMap = new Map<string, any>();

  onCreate() {

  }

  onUnmount() {
    this.remove();
  }

  // 隐藏显示 楼栋 矢量面
  async toggleBuildVectorFaces(buildId: string, visible: boolean): Promise<boolean> {
    console.log("🎨 [入住率分布] toggleBuildVectorFaces 开始:", {
      输入buildId: buildId,
      visible,
    });

    // 尝试将数字ID转换为UUID
    let actualBuildId = buildId;
    const uuid = getBuildingUuidByNumericId(buildId);
    if (uuid) {
      console.log("🔄 [入住率分布] 数字ID转换为UUID:", {
        原始数字ID: buildId,
        转换后UUID: uuid,
      });
      actualBuildId = uuid;
    }

    // 拥有矢量面的楼栋
    const haveVectorBuilds = [
      "140",
      "141",
      "5fe3e6c08d35465d9724d0effab79df9",
      "99b6db0a998d44b99e5b46a897a9ebe6",
      "c0893dca05594416a25ddd2a55f330cc",
      "7ffeb7f555cb4a7f804673e3f21290d4",
      "e533f6839ff3484e8613c60facef44b0",
    ].includes(actualBuildId);

    console.log("🔍 [入住率分布] 检查楼栋是否有矢量面:", {
      检查的buildId: actualBuildId,
      有矢量面: haveVectorBuilds,
      支持的楼栋列表: [
        "140",
        "141",
        "5fe3e6c08d35465d9724d0effab79df9",
        "99b6db0a998d44b99e5b46a897a9ebe6",
        "c0893dca05594416a25ddd2a55f330cc",
        "7ffeb7f555cb4a7f804673e3f21290d4",
        "e533f6839ff3484e8613c60facef44b0",
      ],
    });

    if (!haveVectorBuilds) {
      console.warn("❌ [入住率分布] 该楼栋没有矢量面数据");
      window.$message.error("该楼栋暂不支持入住率分布功能");
      return false;
    }

    console.log("📞 [入住率分布] 调用ShowRoomByName API:", {
      name: actualBuildId,
      state: visible ? "true" : "false",
    });

    this.app?.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "ShowRoomByName",
      args: {
        name: actualBuildId,
        state: visible ? "true" : "false",
      },
    });

    if (visible) {
      console.log("📊 [入住率分布] 获取楼盘表数据...", { buildId });
      const [err, res] = await to(getBuildRoomTable(buildId));
      if (!err) {
        console.log("✅ [入住率分布] 楼盘表数据获取成功，房间数:", res?.resultData?.length);
        const tasks = (res?.resultData || []).reduce((prev, item) => {
          (item?.children || []).forEach(({ id }) => {
            prev.push(
              this.app?.Customize.RunCustomizeApi({
                apiClassName: "CustomAPI",
                apiFuncName: "SetBuildNormalColor",
                args: {
                  id,
                  alpha: "0.5",
                  type: "wlm",
                  color: "#FFFFFFFF",
                },
              }),
            );
          });
          return prev;
        }, [] as Promise<any>[]);
        console.log("🎨 [入住率分布] 设置默认颜色，任务数:", tasks.length);
        await Promise.allSettled(tasks);
        console.log("✅ [入住率分布] 默认颜色设置完成");
      } else {
        console.error("❌ [入住率分布] 楼盘表数据获取失败:", err);
      }
    }

    return true;
  }

  async render(buildId: string) {
    console.log("🎨 [入住率分布] render 开始:", { buildId });
    const success = await this.toggleBuildVectorFaces(buildId, true);
    if (!success) {
      console.warn("❌ [入住率分布] toggleBuildVectorFaces 失败，render 中止");
      return;
    }
    this.showVectorFacesBuildId = buildId;
    console.log("📊 [入住率分布] 获取房间状态数据...", { buildId });
    const [err, res] = await to(getBuildingRoomStatus(buildId));
    if (err) {
      console.error("❌ [入住率分布] 房间状态获取失败:", err);
      window?.$message?.error("楼宇房间状态获取失败");
      return;
    }
    const resultData = res?.resultData || [];
    console.log("✅ [入住率分布] 房间状态数据获取成功，房间数:", resultData.length);
    if (!resultData.length) {
      console.warn("⚠️ [入住率分布] 房间状态数据为空");
      window?.$message?.error("楼宇房间状态获取为空");
      return;
    }
    const color = { 空置房间: "5EA778", 空置床位房间: "AEA872", 住满房间: "A5242E" };

    console.log("🎨 [入住率分布] 开始设置房间颜色...");
    const tasks = (res.resultData || []).map(({ fjid, type }) => {
      return this.app?.Customize.RunCustomizeApi({
        apiClassName: "CustomAPI",
        apiFuncName: "SetBuildNormalColor",
        args: {
          id: fjid,
          alpha: "0.5",
          type: "wlm",
          color: `#${color[type]}FF`,
        },
      });
    });
    console.log("🎨 [入住率分布] 颜色设置任务数:", tasks.length);
    const result = await Promise.all(tasks);
    console.log("✅ [入住率分布] render 完成!");
    return result;
  }

  async remove() {
    console.log("🧹 [入住率分布] remove 开始:", {
      showVectorFacesBuildId: this.showVectorFacesBuildId,
    });
    if (!this.showVectorFacesBuildId) {
      console.warn("⚠️ [入住率分布] showVectorFacesBuildId 为空，跳过清理");
      return false;
    }
    const success = await this.toggleBuildVectorFaces(this.showVectorFacesBuildId, false);
    this.showVectorFacesBuildId = null;
    console.log("✅ [入住率分布] remove 完成:", { success });
    return success;
  }
}

export default new DormitoryRoomStatusRangeLayer();
