import WdpApi from "wdpapi";
import { sleep } from "@/utils/index.ts";
import waitFor from "@/utils/waitFor.ts";
import MapLayerControl from "./MapLayerControl.ts";

export type AppInstance = InstanceType<typeof WdpApi>;

export type wdpMap = InstanceType<typeof WdpMap>;

export default class WdpMap extends MapLayerControl {
  app: AppInstance | undefined = undefined;
  progress: number = 0;
  status: "loading" | "ready" | "error" | undefined = undefined;
  screenWidth = 1920;
  screenHeight = 1080;

  // 判断参数是否有效
  isValidParam(str: string | null | undefined) {
    return !["undefined", "null", "", null, undefined].includes(str);
  }

  // 获取配置文件
  getConfig(sceneUrl?: string, sceneOrder?: string) {
    let finalSceneUrl = window.__config__.wdp.sceneUrl;
    let finalSceneOrder = window.__config__.wdp.sceneOrder;
    
    // 优先使用传入的参数
    if (this.isValidParam(sceneUrl)) {
      finalSceneUrl = sceneUrl!;
    }
    if (this.isValidParam(sceneOrder)) {
      finalSceneOrder = sceneOrder!;
    }
    
    // 读取配置文件 - url
    const params = new URLSearchParams(window.location.search);

    if (this.isValidParam(params.get("sceneUrl"))) {
      finalSceneUrl = params.get("sceneUrl")!;
    }
    if (this.isValidParam(params.get("sceneOrder"))) {
      finalSceneOrder = params.get("sceneOrder")!;
    }

    // 获取 屏幕宽高
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    return { sceneUrl: finalSceneUrl, sceneOrder: finalSceneOrder, screenWidth, screenHeight };
  }

  resize() {
    if (!this.app || this.status !== "ready") return;
    console.log("🚀 ~ WdpMap ~ resize ~ resize:");
    // 获取 屏幕宽高
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.app.Renderer.SetRendererMode("fixed", [screenWidth, screenHeight]);
  }

  async render(DomId: string, sceneUrl?: string, sceneOrder?: string) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.status = "loading";
    const { sceneUrl: finalSceneUrl, sceneOrder: finalSceneOrder, screenWidth, screenHeight } = this.getConfig(sceneUrl, sceneOrder);
    const app = new WdpApi({
      id: DomId,
      url: finalSceneUrl,
      order: finalSceneOrder,
      // resolution: [3840, 2160],
      resolution: [screenWidth, screenHeight],
      debugMode: "normal", // [选填] none: 无日志输出, normal: 普通级别日志输出，high：高级别日志输出，all：全日志输出
      keyboard: {
        normal: false,
        func: false,
      },
      prefix: "",
      initLog: false,
      bCached: false,
    });
    this.app = app;
    this.registerPendingEvents();
    const res = await app.Renderer.Start();
    if (res?.success) {
      this.resize();
      this.registerEvent();
    }
    else {
      this.emit("error");
    }
  }

  destroy() {
    this.removeLayer(...this.layerList);
    this.offAll();
    this.app?.Renderer.Stop();
    this.app = undefined;
    this.status = undefined;
  }

  // 注册事件
  registerEvent() {
    this.on("onVideoReady", () => {
      // window.$message.success("视频流链接成功");
    });
    this.on("OnWdpSceneIsReady", async (res) => {
      this.progress = res.result.progress;
      if (res.result.progress === 100) {
        if (this.app) {
          await this.app.Scene.Covering.Clear();
        }
        await this.mountLayers();
        await sleep(1000);
        setTimeout(() => {
          window.$message?.success?.("场景加载完成");
        });
        this.status = "ready";
        this.emit("created", res);
      }
    });
    this.on("onStopedRenderCloud", (...args: any[]) => {
      setTimeout(() => {
        window.$message?.error?.("渲染服务中断");
      });
      this.status = "error";
      this.emit("error", ...args);
    });
    this.on("OnValidateError", (res) => {
      console.log("🚀 ~  ~ res: ", res);
    });
    this.on("OnMouseEnterEntity", (res) => {
      document.body.classList.contains("cursor-pointer") || document.body.classList.add("cursor-pointer");
    });
    this.on("OnMouseOutEntity", (res) => {
      document.body.classList.contains("cursor-pointer") && document.body.classList.remove("cursor-pointer");
    });
  }

  onCreated(callback: (app: WdpApi) => void) {
    if (this.status === "ready") {
      waitFor(() => this.layerList.every(layer => layer.mounted))
        .then(() => callback(this.app!));
      return;
    }
    this.on("created", () => {
      callback(this.app!);
    });
  }

  onError(callback: (...args: any[]) => void) {
    this.on("error", (...args) => {
      callback(...args);
    });
  }

  onDestroy(callback: (...args: any[]) => void) {
    this.on("destroy", (...args) => {
      callback(...args);
    });
  }
}
