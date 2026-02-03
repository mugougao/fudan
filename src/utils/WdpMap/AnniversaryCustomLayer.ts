import CustomLayer from "./code/CustomLayer";
import wdpMap from "./wdpMap";

class AnniversaryCustomLayer extends CustomLayer {
  layerId: string = "anniversaryCustomLayer";
  layerName: string = "校庆特效";

  cacheCameraInfo = {};
  cacheSkylightTime = "";
  cacheSceneWeather = "";

  running = false;
  runTimer: any = null;

  onCreate() {

  }

  onUnmount() {
    this.close();
  }

  runControlFireworks() {
    if (!this.app) return;
    if (!this.running) {
      clearTimeout(this.runTimer);
      this.runTimer = null;
      return;
    }
    this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "ControlFireworks",
      args: { time: "0.1", num: "3" },
    });
    this.runTimer = setTimeout(() => {
      this.runControlFireworks();
    }, 15 * 1000);
  }

  async render() {
    if (!this.app) return;
    // 隐藏所有图层
    wdpMap.layerList.forEach((layer: any) => {
      if (layer.hideAll) layer.hideAll();
    });
    // 缓存相机信息
    const { result } = await this.app.CameraControl.GetCameraInfo() || { result: {} };
    if (result) {
      this.cacheCameraInfo = {
        targetPosition: result?.location,
        rotation: result?.rotation,
        distance: 200,
        flyTime: 1,
      };
    }
    // 缓存天气信息
    const { result: { skylightTime } } = await this.app.Environment.GetSkylightTime() || { result: { skylightTime: "9:00" } };
    const { result: { sceneWeather } } = await this.app.Environment.GetSceneWeather() || { result: { sceneWeather: "9:00" } };
    this.cacheSkylightTime = skylightTime;
    this.cacheSceneWeather = sceneWeather;
    // 设置天气信息
    this.app.Environment.SetSkylightTime("23:00", 3, false);
    this.app.Environment.SetSceneWeather("Sunny", 3, false);

    this.running = true;
    this.runControlFireworks();
    this.app.CameraControl.FlyTo({
      targetPosition: [121.5035840835837, 31.29458310377919, 241.42358382832623],
      rotation: { pitch: -10.113301277160645, yaw: -106.00617980957031 },
      distance: 100,
      flyTime: 1,
    });
  }

  close() {
    this.running = false;
    this.runTimer && clearTimeout(this.runTimer);
    this.runTimer = null;
    if (!this.app) return;
    // 显示所有图层
    wdpMap.layerList.forEach((layer: any) => {
      if (layer.showAll) layer.showAll();
    });
    this.app?.Environment.SetSkylightTime(this.cacheSkylightTime, 3, false);
    this.app?.Environment.SetSceneWeather(this.cacheSceneWeather, 3, false);
    this.app?.CameraControl.FlyTo(this.cacheCameraInfo);
  }
}

export default new AnniversaryCustomLayer();
