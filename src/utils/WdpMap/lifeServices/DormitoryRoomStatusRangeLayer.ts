import to from "await-to-js";
import { getBuildingRoomStatus, getBuildRoomTable } from "@/api/lifeServices";
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
    // 拥有矢量面的楼栋
    const haveVectorBuilds = [
      "140",
      "141",
      "5fe3e6c08d35465d9724d0effab79df9",
      "99b6db0a998d44b99e5b46a897a9ebe6",
      "c0893dca05594416a25ddd2a55f330cc",
      "7ffeb7f555cb4a7f804673e3f21290d4",
      "e533f6839ff3484e8613c60facef44b0",
    ].includes(buildId);

    if (!haveVectorBuilds) {
      // window.$message.error("该楼栋没有矢量面");
      return false;
    }

    this.app?.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "ShowRoomByName",
      args: {
        name: buildId,
        state: visible ? "true" : "false",
      },
    });

    if (visible) {
      const [err, res] = await to(getBuildRoomTable(buildId));
      if (!err) {
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
        await Promise.allSettled(tasks);
      }
    }

    return true;
  }

  async render(buildId: string) {
    const success = await this.toggleBuildVectorFaces(buildId, true);
    if (!success) {
      return;
    }
    this.showVectorFacesBuildId = buildId;
    const [err, res] = await to(getBuildingRoomStatus(buildId));
    if (err) {
      window?.$message?.error("楼宇房间状态获取失败");
      return;
    }
    const resultData = res?.resultData || [];
    if (!resultData.length) {
      window?.$message?.error("楼宇房间状态获取为空");
      return;
    }
    const color = { 空置房间: "5EA778", 空置床位房间: "AEA872", 住满房间: "A5242E" };

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
    return Promise.all(tasks);
  }

  async remove() {
    if (!this.showVectorFacesBuildId) {
      return false;
    }
    const success = await this.toggleBuildVectorFaces(this.showVectorFacesBuildId, false);
    this.showVectorFacesBuildId = null;
    return success;
  }
}

export default new DormitoryRoomStatusRangeLayer();
