import CustomLayer from "../code/CustomLayer";

// 漫游路线播放
class RoamingRoutesPlay extends CustomLayer {
  layerId: string = "RoamingRoutesPlay";
  layerName: string = "漫游路线播放图层";

  // 正在播放 的 漫游路线 ID
  playRoam: string | null = null;
  playing = false;

  static roamMap = [
    { id: "1", name: "经典打卡", roamName: "HD_MY1" },
    { id: "3", name: "study tour", roamName: "HD_MY2" },
    { id: "2", name: "拥抱自然", roamName: "HD_MY3" },
  ] as const;

  onCreate() {

  }

  onUnmount() {

  }

  setPlayRoam(id: string | null) {
    this.playRoam = id;
    // localStorage.setItem("playRoam", id || "");
  }

  ControlSuence(operate: "Create", descriptor: typeof RoamingRoutesPlay.roamMap[number]["roamName"]);
  ControlSuence(operate: "Play" | "Pause", descriptor: "");
  ControlSuence(operate: "Stop", descriptor: boolean);
  ControlSuence(operate: "Seek", descriptor: number);
  ControlSuence(operate: "Create" | "Play" | "Stop" | "Seek" | "Pause", descriptor: string | boolean | number) {
    if (!this.app) return;
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "ControlSuence",
      args: { id: "my1", operate, descriptor },
    });
  }

  create(id: string) {
    this.setPlayRoam(id);
    const descriptor
     = RoamingRoutesPlay.roamMap
       .find(item => item.id === id)
       ?.roamName as typeof RoamingRoutesPlay.roamMap[number]["roamName"];
    return this.ControlSuence("Create", descriptor);
  }

  async play(id: string) {
    let result: any;
    if (!this.playRoam) {
      result = await this.create(id);
    }
    else if (this.playRoam !== id) {
      await this.destroy();
      result = await this.create(id);
    }
    else {
      this.playing = true;
      result = await this.ControlSuence("Play", "");
    }
    this.playing = true;
    return result;
  }

  pause() {
    this.playing = false;
    return this.ControlSuence("Pause", "");
  }

  seek(number: number) {
    if (number < 0) {
      number = 0;
    }
    if (number > 1) {
      number = 1;
    }
    return this.ControlSuence("Seek", number);
  }

  destroy() {
    if (!this.playRoam) {
      return Promise.resolve();
    }
    this.playing = false;
    this.setPlayRoam(null);
    return this.ControlSuence("Stop", true);
  }

  clear() {
    if (this.playRoam) {
      return this.ControlSuence("Stop", false);
    }
    return Promise.resolve();
  }
}

export default new RoamingRoutesPlay();
