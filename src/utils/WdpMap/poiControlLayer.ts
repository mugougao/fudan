import layerPoint from "@/assets/json/layer-dianwei.json";
import PoiLayer from "./code/PoiLayer.ts";
import { poiTypeTextStyleMap } from "./code/poiStyle.ts";

interface IData {
  type: string;
  childType: string;
}

class PoiControlLayer extends PoiLayer<IData> {
  readonly layerId: string = "poi-control-layer";
  readonly layerName: string = "poi点位控制图层";

  fetchData() {
    const data = layerPoint.features
      .map((item) => {
        const [x, y] = item.geometry.coordinates;
        const { id, name, lx, lx2 } = item.properties;
        return {
          id: id.toString(),
          name,
          location: [x, y, 0] as [number, number, number],
          data: { type: lx, childType: lx2 },
        };
      });
    this.setData(data);
  }

  getRenderedPoiDataListByName(searchName: string) {
    return Array.from(this.layerDataMap.entries()).reduce(
      (prev, [id, item]) => {
        const poiName = item.name;
        if (this.entityMap.has(id) && poiName.includes(searchName)) {
          prev.push({ id, name: item.name });
        }
        return prev;
      },
      [] as { id: string; name: string }[],
    );
  }

  renderByType(types: string[]) {
    const groupData = Array.from(this.layerDataMap.values())
      .reduce(
        (prev, curr) => {
          const { data } = curr;
          const { type, childType } = data;
          if (types.includes(childType) || types.includes(type)) {
            const poiStyle = [childType, type].reduce(
              (prev: string, currType: string) => poiTypeTextStyleMap[currType] ?? prev,
              "build",
            );
            if (!prev[poiStyle]) prev[poiStyle] = [];
            prev[poiStyle].push(curr);
          }
          return prev;
        },
        {} as Record<string, any[]>,
      );
    return Promise.allSettled(
      Object.entries(groupData)
        .map(([key, values]) => {
          return this.add(values as any[], key);
        }),
    );
  }

  removeByType(types: string[]) {
    const ids: string[] = [];
    Array.from(this.layerDataMap.entries())
      .forEach(([id, item]) => {
        const { data } = item;
        const { type, childType } = data;
        if (types.includes(childType) || types.includes(type)) {
          ids.push(id);
        }
      });
    return this.remove(ids);
  }

  focusOne(id: string) {
    if (!this.entityMap.has(id)) return;
    return super.focus(id);
  }

  focusAll() {
    const ids = Array.from(this.entityMap.keys());
    if (!ids.length) return;
    return super.focus(ids);
  }

  onCreate(): any {
    this.fetchData();
  }

  onUnmount(): any {
    this.remove(Array.from(this.entityMap.keys()));
    this.clearData();
    this.clearEntity();
  }
}

export default new PoiControlLayer();
