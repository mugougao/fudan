import type WdpApi from "wdpapi";
import { pick } from "lodash";

export class ThreeDimensionalHouseType {
  app: WdpApi | null = null;
  // 获取楼栋对应三维户型的模式
  // 目前只有 邯郸-北区- 119栋/45栋 有 三维户型 模式
  modeMap: Record<string, (roomName: string) => string> = {
    // 119 栋
    "5fe3e6c08d35465d9724d0effab79df9": (roomName: string) => {
      // 房间名以02结尾
      return roomName.endsWith("02") ? "L_HD_YBJ1" : "L_HD_YBJ3";
    },
    // 45栋
    "99b6db0a998d44b99e5b46a897a9ebe6": (roomName: string) => {
      return roomName.endsWith("02") ? "L_HD_YBJ" : "L_HD_YBJ2";
    },
  };

  // 切换 户型模式前 历史相机信息
  historyCameraInfo: any = null;

  // 获取当前场景名称
  sceneName: string | null = null;
  // 状态 ： over - 俯视 roam - 漫游
  status: "over" | "roam" = "over";

  constructor(app: WdpApi) {
    this.app = app;
  }

  // 判断楼栋是否支持三维户型
  has3DMode(buildId: string) {
    return this.modeMap[buildId];
  }

  // 进入三维模式
  async enter3DMode(buildId: string, roomName: string) {
    // const result = await this.cloudMap?.SuperAPI("GetCameraInfo", { coord_type: 0 });
    const result = await this.app?.CameraControl.GetCameraInfo();
    this.historyCameraInfo = pick(result?.result ?? {}, ["location", "rotation"]);
    const _roomName = (roomName || "").replace(/[a-z]/gi, "");
    const func = this.modeMap[buildId]!;
    this.sceneName = func ? func(_roomName) : "L_HD_YBJ";
    // return this.cloudMap?.SuperAPI("ChangeScene", { sceneName: this.sceneName });
    return this.app?.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "ChangeScene",
      args: {
        sceneName: this.sceneName,
      },
    });
  }

  // 退出三维模式
  async exit3DMode(historyCamera = true) {
    // await this.cloudMap?.SuperAPI("ChangeScene", { sceneName: "normal" });
    // await this.cloudMap?.SuperAPI("SetEnvTime", { env_time: "auto", direction: "clockwise" });
    // await this.cloudMap?.SuperAPI("removekeyboard");
    // await this.cloudMap?.SuperAPI("ResetCamera", { state: "default" });

    await this.app?.Customize.RunCustomizeApi(
      {
        apiClassName: "CustomAPI",
        apiFuncName: "ChangeScene",
        args: {
          sceneName: "normal",
        },
      },
    );
    this.app?.System?.SetDefaultKeyboard?.(false);
    this.app?.System?.SetDefaultBrowserFunctionKeyboard?.(false);

    if (this.historyCameraInfo && historyCamera) {
      this.app?.CameraControl.FlyTo({
        ...this.historyCameraInfo,
        distance: 100,
        flyTime: 1,
      });
    }
    this.historyCameraInfo = null;
    this.sceneName = null;
  }

  // 俯视
  async enterOver() {
    if (this.status === "roam") {
      // 移除键盘事件响应
      this.app?.System?.SetDefaultKeyboard?.(false);
      this.app?.System?.SetDefaultBrowserFunctionKeyboard?.(false);
    }
    // await this.cloudMap?.SuperAPI("ChangeScene", { sceneName: this.sceneName, type: "1" });
    this.app?.Customize.RunCustomizeApi(
      {
        apiClassName: "CustomAPI",
        apiFuncName: "ChangeCameraType",
        args: {
          sceneName: this.sceneName,
          type: "1",
        },
      },
    );
    this.status = "over";
  }

  // 漫游
  async enterRoam() {
    // 添加键盘事件响应
    // await this.cloudMap?.SuperAPI("keyboardnofn");
    this.app?.System?.SetDefaultKeyboard?.(true);
    this.app?.System?.SetDefaultBrowserFunctionKeyboard?.(true);
    this.app?.Customize.RunCustomizeApi(
      {
        apiClassName: "CustomAPI",
        apiFuncName: "ChangeCameraType",
        args: {
          sceneName: this.sceneName,
          type: "2",
        },
      },
    );
    this.status = "roam";
  }
}
