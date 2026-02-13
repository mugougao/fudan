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
    console.log("🏠 [三维户型] 进入三维模式（无校验）:", {
      buildId,
      roomName,
      说明: "直接执行场景切换，不进行任何后端接口请求和校验",
    });

    try {
      // 保存当前相机位置
      console.log("📷 [三维户型] 保存当前相机位置...");
      const result = await this.app?.CameraControl.GetCameraInfo();
      this.historyCameraInfo = pick(result?.result ?? {}, ["location", "rotation"]);
      console.log("✅ [三维户型] 相机位置已保存");
    } catch (error) {
      console.warn("⚠️ [三维户型] 保存相机位置失败，继续执行:", error);
    }
    
    // 随机选择场景
    const sceneNames = ["L_HD_YBJ", "L_HD_YBJ1", "L_HD_YBJ2", "L_HD_YBJ3", "L_HD_YBJ4"];
    this.sceneName = sceneNames[Math.floor(Math.random() * sceneNames.length)];
    
    console.log("🎬 [三维户型] 随机选择场景:", {
      可用场景: sceneNames,
      选中场景: this.sceneName,
      随机索引: Math.floor(Math.random() * sceneNames.length),
    });

    // 直接执行场景切换，不进行任何后端接口请求和校验
    console.log("🚀 [三维户型] 开始执行场景切换API...");
    
    try {
      const changeSceneResult = await this.app?.Customize.RunCustomizeApi({
        apiClassName: "CustomAPI",
        apiFuncName: "ChangeScene",
        args: {
          sceneName: this.sceneName,
        },
      });

      console.log("✅ [三维户型] 场景切换完成:", {
        场景名称: this.sceneName,
        API结果: changeSceneResult,
      });

      return changeSceneResult;
    } catch (error) {
      console.error("❌ [三维户型] 场景切换失败:", error);
      throw error;
    }
  }

  // 退出三维模式
  async exit3DMode(historyCamera = true) {
    console.log("🚪 [三维户型] 退出三维模式:", {
      恢复历史相机: historyCamera,
      当前场景: this.sceneName,
    });

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
    
    console.log("⌨️ [三维户型] 禁用键盘控制");
    this.app?.System?.SetDefaultKeyboard?.(false);
    this.app?.System?.SetDefaultBrowserFunctionKeyboard?.(false);

    if (this.historyCameraInfo && historyCamera) {
      console.log("📷 [三维户型] 恢复历史相机位置:", this.historyCameraInfo);
      this.app?.CameraControl.FlyTo({
        ...this.historyCameraInfo,
        distance: 100,
        flyTime: 1,
      });
    }
    
    this.historyCameraInfo = null;
    this.sceneName = null;
    console.log("✅ [三维户型] 退出完成");
  }

  // 俯视
  async enterOver() {
    console.log("👁️ [三维户型] 切换到俯视模式:", {
      当前状态: this.status,
      场景名称: this.sceneName,
    });

    if (this.status === "roam") {
      // 移除键盘事件响应
      console.log("⌨️ [三维户型] 禁用键盘控制（从漫游切换）");
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
    console.log("✅ [三维户型] 俯视模式切换完成");
  }

  // 漫游
  async enterRoam() {
    console.log("🚶 [三维户型] 切换到漫游模式:", {
      当前状态: this.status,
      场景名称: this.sceneName,
    });

    // 添加键盘事件响应
    // await this.cloudMap?.SuperAPI("keyboardnofn");
    console.log("⌨️ [三维户型] 启用键盘控制");
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
    console.log("✅ [三维户型] 漫游模式切换完成");
  }
}
