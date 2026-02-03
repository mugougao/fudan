import type WdpApi from "wdpapi";
import CustomEvent from "./CustomEvent.ts";

interface ILayerDateItem {
  id: string;
  name: string;
}

export default abstract class BaseLayer<T extends ILayerDateItem = any, E = any> {
  // 图层唯一标识
  abstract readonly layerId: string;
  // 图层唯一标识名称
  abstract readonly layerName: string;

  protected app: InstanceType<typeof WdpApi> | undefined;

  mounted: boolean = false;

  layerDataMap: Map<string, T & { layerId: string; layerName: string }> = new Map();
  entityMap: Map<string, E> = new Map();

  eventEmitter = new CustomEvent();

  abstract onCreate(): any | Promise<any>;

  abstract onUnmount(): any | Promise<any>;

  __emitHandler = (eventName: string, params: { name: string; id: string; data: T; entity: E }) => {
    this.eventEmitter.emit(eventName, params);
  };

  mount(app: InstanceType<typeof WdpApi>): any | Promise<any> {
    this.app = app;
    if (!this.app) return;
    return this.onCreate();
  }

  unmount(): any | Promise<any> {
    this.onUnmount();
    this.clearData();
    this.clearEntity();
    this.app = undefined;
  }

  idFormat(id: string) {
    if (!this.layerId) return id;
    if (id.toString().startsWith(this.layerId)) return id;
    return `${this.layerId}_${id}`;
  }

  setData(data: T[]) {
    this.clearData();
    data.forEach((item) => {
      this.pushData(item);
    });
  }

  pushData(data: T) {
    this.layerDataMap.set(
      this.idFormat(data.id),
      {
        ...data,
        layerId: this.layerId,
        layerName: this.layerName,
      },
    );
  }

  hasData(id: string) {
    return this.layerDataMap.has(this.idFormat(id));
  }

  getData(id: string) {
    return this.layerDataMap.get(this.idFormat(id));
  }

  removeData(...ids: string[]) {
    ids.forEach((id) => {
      this.layerDataMap.delete(this.idFormat(id));
    });
  }

  clearData() {
    this.layerDataMap.clear();
  }

  setEntity(data: { id: string;entity: E }[]) {
    this.clearEntity();
    data.forEach((item) => {
      this.pushEntity(item.id, item.entity);
    });
  }

  pushEntity(id: string, entity: E) {
    this.entityMap.set(this.idFormat(id), entity);
  }

  hasEntity(id: string) {
    return this.entityMap.has(this.idFormat(id));
  }

  getEntity(id: string) {
    return this.entityMap.get(this.idFormat(id));
  }

  removeEntity(...ids: string[]) {
    ids.forEach((id) => {
      this.entityMap.delete(this.idFormat(id));
    });
  }

  clearEntity() {
    this.entityMap.clear();
  }

  flyTo(id: string, options?: Partial<{ rotation: { pitch?: number; yaw?: number }; distanceFactor: number; flyTime: number }>) {
    if (!this.app) return;
    const entity = this.getEntity(id);
    if (!entity) return;
    const { rotation = {}, distanceFactor = 0.002, flyTime = 1 } = options || {};
    const { pitch = -30, yaw = -90 } = (rotation || {}) as any;

    if (distanceFactor > 1) {
      return (entity as any).GetLocation().then(({ success, result }) => {
        if (!success) return;
        return this.app?.CameraControl.FlyTo({
          targetPosition: result,
          rotation: { pitch, yaw },
          distance: distanceFactor,
          flyTime,
        });
      });
    }

    const jsondata = {
      rotation: { pitch, yaw },
      distanceFactor,
      flyTime: 1,
      entity: [entity],
    };
    this.app.CameraControl.Focus(jsondata);
  }

  async focus(ids: string | string[], options?: Partial<{ rotation: { pitch?: number; yaw?: number }; distanceFactor: number; flyTime: number }>) {
    if (!this.app) return Promise.resolve();
    // debugger;
    const _ids = (Array.isArray(ids) ? ids : [ids]).map(id => this.idFormat(id));
    if (!_ids.length) return Promise.resolve();
    const { rotation = {}, distanceFactor, flyTime = 1 } = options || {};
    const { pitch = -30, yaw = -90 } = (rotation || {}) as any;
    const jsondata = {
      rotation: { pitch, yaw },
      distanceFactor: distanceFactor ?? (distanceFactor ?? _ids.length < 5 ? 0.1 : 1.05),
      flyTime,
      entity: _ids.map(id => this.entityMap.get(id)),
    };
    return this.app.CameraControl.Focus(jsondata);
  }

  focusAll(options?: Partial<{ rotation: { pitch?: number; yaw?: number }; distanceFactor: number; flyTime: number }>) {
    if (!this.app) return;
    return this.focus(Array.from(this.entityMap.keys()), options);
  }

  async visible(ids: string | string[], visible: boolean) {
    const _ids = (Array.isArray(ids) ? ids : [ids]);
    return await Promise.allSettled(
      _ids.reduce((prev, id) => {
        const entity = this.entityMap.get(id);
        if (entity) {
          prev.push((entity as any).SetVisible(visible));
        }
        return prev;
      }, [] as Promise<any>[]),
    );
  }

  // 隐藏其他
  hideOthers(id: string) {
    const ids = Array.from(this.entityMap.keys()).filter(item => item != this.idFormat(id));
    return this.visible(ids, false);
  }

  hide(ids: string | string[]) {
    return this.visible(ids, false);
  }

  show(ids: string | string[]) {
    return this.visible(ids, true);
  }

  hideAll() {
    return this.visible(Array.from(this.entityMap.keys()), false);
  }

  showAll() {
    return this.visible(Array.from(this.entityMap.keys()), true);
  }

  remove(ids: string | string[]) {
    if (!this.app) return;
    const _ids = Array.isArray(ids) ? ids : [ids];
    const entitys = _ids.map(id => this.entityMap.get(this.idFormat(id))).filter(item => Boolean(item));
    if (!entitys.length) return Promise.resolve();
    return Promise.all(
      entitys.map((entity) => {
        return (entity as any).Delete();
      }),
    ).then((res) => {
      this.removeEntity(..._ids);
      return res;
    });
    // const _ids = (Array.isArray(ids) ? ids : [ids]).map(val => this.idFormat(val));
    // return this.app.Scene.GetByCustomId(_ids)
    //   .then((re) => {
    //     if (re.success && re.result.length > 0) {
    //       // re.result[0].Delete();
    //       this.removeEntity(..._ids);
    //       return Promise.allSettled(re.result.map(item => item.Delete()));
    //     }
    //   });
  }

  removeAll() {
    if (!this.app) return;
    const entitys = Array.from(this.entityMap.values());
    if (!entitys.length) return Promise.resolve();
    const result = Promise.all(
      entitys.map((entity) => {
        return (entity as any).Delete()?.catch(err => err);
      }),
    );
    this.clearEntity();
    return result;
  }

  async latAndLonToOffset(buildingId: string, floorId: string, list: { id: string; lat: number | string; lon: number | string }[]): Promise<{ id: string; location: [number, number, number] }[]> {
    if (!this.app) return [];
    const res = await this.app.Customize
      .RunCustomizeApi({
        apiClassName: "CustomAPI",
        apiFuncName: "GetDrawerOffset",
        args: { BuildID: buildingId, Floor: floorId, DataArray: list },
      });
    return (res?.result?.newDataArray || []).map(({ iD, lat, lon, height }) => {
      return {
        id: iD,
        location: [lon, lat, height],
      };
    });
  }

  openDark() {
    if (!this.app) return;
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "EC_DoCrystal",
      args: { state: true },
    });
  }

  closeDark() {
    if (!this.app) return;
    return this.app.Customize.RunCustomizeApi({
      apiClassName: "CustomAPI",
      apiFuncName: "EC_DoCrystal",
      args: { state: false },
    });
  }
}
