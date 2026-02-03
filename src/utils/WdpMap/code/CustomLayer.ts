import type WdpApi from "wdpapi";

export default abstract class CustomLayer<T extends { id: string; name: string } = any> {
  // 图层唯一标识
  abstract readonly layerId: string;
  // 图层唯一标识名称
  abstract readonly layerName: string;

  layerDataMap: Map<string, T & { layerId: string; layerName: string }> = new Map();

  mounted: boolean = false;

  protected app: InstanceType<typeof WdpApi> | undefined;

  abstract onCreate(): any | Promise<any>;

  abstract onUnmount(): any | Promise<any>;

  idFormat(id: string) {
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

  mount(app: InstanceType<typeof WdpApi>): any | Promise<any> {
    this.app = app;
    if (!this.app) return;
    return this.onCreate();
  }

  unmount(): any | Promise<any> {
    this.onUnmount();
    this.app = undefined;
  }
}
