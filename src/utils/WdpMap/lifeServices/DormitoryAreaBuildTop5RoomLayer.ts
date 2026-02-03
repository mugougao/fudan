import to from "await-to-js";
import { getBuildRoomTable, getBuildTop5Room } from "@/api/lifeServices";
import CustomLayer from "../code/CustomLayer";

class DormitoryAreaBuildTop5RoomLayer extends CustomLayer {
  readonly layerId: string = "DormitoryAreaBuildTop5RoomLayer";
  readonly layerName: string = "楼宇用电TOP5";

  showVectorFacesBuildId: string | null = null;

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
    const [err, res] = await to(getBuildTop5Room(buildId));
    if (err) {
      window?.$message?.error("楼宇房间TOP5数据获取失败");
      return;
    }
    const resultData = res?.resultData || [];
    if (!resultData.length) {
      window?.$message?.error("楼宇房间TOP5数据获取为空");
      return;
    }
    const success = await this.toggleBuildVectorFaces(buildId, true);
    if (!success) {
      return;
    }
    this.showVectorFacesBuildId = buildId;

    const tasks = resultData.map((item) => {
      const { id, fjmc } = item;
      this.pushData({ name: fjmc, ...item });
      return this.app?.Customize.RunCustomizeApi({
        apiClassName: "CustomAPI",
        apiFuncName: "SetBuildNormalColor",
        args: {
          id,
          alpha: "0.5",
          type: "wlm",
          color: "#A5242EFF",
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

export default new DormitoryAreaBuildTop5RoomLayer();
