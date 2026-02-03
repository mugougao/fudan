import type WdpApi from "wdpapi";
import type BaseLayer from "./BaseLayer.ts";
import type CustomLayer from "./CustomLayer.ts";
import EventListener from "@/utils/WdpMap/code/EventListener.ts";

type AppInstance = InstanceType<typeof WdpApi>;

export default abstract class MapLayerControl extends EventListener {
  abstract app: AppInstance | undefined;
  layerList: (BaseLayer | CustomLayer)[] = [];
  abstract status: "loading" | "ready" | "error" | undefined;
  mountLayering: boolean = false;

  hasLayer(layer: BaseLayer | CustomLayer) {
    return this.layerList.includes(layer);
  }

  async runLayerMount(layer: BaseLayer | CustomLayer) {
    if (layer.mounted) return;
    if (!layer.mount) return;
    try {
      const result = layer.mount(this.app!);
      console.log(`run - mount: ${layer.layerName} `);
      if (typeof result === "object" && (result as Promise<any>).then) {
        await (result as Promise<any>);
      }
      layer.mounted = true;
    }
    catch (error) {
      console.error(`layer.mount error: ${layer.layerName}`, error);
      window.$message.error("layer.mount error");
    }
  }

  // 挂载图层
  async mountLayers() {
    this.mountLayering = false;
    const layerList = [...this.layerList].filter(layer => !layer.mounted);
    while (layerList.length) {
      const layer = layerList.shift();
      if (!layer) continue;
      await this.runLayerMount(layer);
    }
  }

  async addLayer(...layers: (BaseLayer | CustomLayer)[]): Promise<void> {
    if (!layers.length) return Promise.resolve();
    this.layerList.push(
      ...layers.filter(layer => !this.hasLayer(layer)),
    );
    if (this.mountLayering) return;
    await Promise.resolve();
    if (this.status === "ready") {
      await this.mountLayers();
    }
    return Promise.resolve();
  }

  async removeLayer(...layers: (BaseLayer | CustomLayer)[]) {
    if (!layers.length) return;
    layers.forEach((layer) => {
      const index = this.layerList.indexOf(layer);
      if (index === -1) return;
      this.layerList.splice(index, 1);
      layer.unmount();
      layer.mounted = false;
    });
  }
}
