import type HeatMap from "wdpapi/dist/modules/scene/covering/HeatMap";
import type { IHeatMapStyleKey } from "./heatMapStyle.ts";
import set from "lodash/set";
import { easyClone } from "@/utils";
import BaseLayer from "./BaseLayer.ts";
import heatMapStyle from "./heatMapStyle.ts";

interface IHeatMapDataItem<T> {
  id: string;
  name: string;
  mapdata: { point: [number, number, number]; value: number }[];
  style?: IHeatMapStyleKey | Record<string, any>;
  data: T;
}

type IHeatMap = InstanceType<typeof HeatMap>;

export default abstract class HeatMapLayer<T = any> extends BaseLayer<IHeatMapDataItem<T>, IHeatMap> {
  abstract readonly layerId: string;
  abstract readonly layerName: string;

  async add(
    data: IHeatMapDataItem<T> | IHeatMapDataItem<T>[],
    style: IHeatMapStyleKey | Record<string, any> = "default",
  ) {
    if (!this.app) return;
    const HeatMap = this.app.HeatMap;
    const _style = easyClone(typeof style === "string" ? heatMapStyle[style] || heatMapStyle.default : style);
    (Array.isArray(data) ? data : [data]).forEach((item) => {
      const { id, name, mapdata, style: customStyle, data } = item;
      const styleOption
        = easyClone(
          (
            customStyle && typeof customStyle === "string"
              ? heatMapStyle[customStyle]
              : customStyle
          ) || _style,
        );

      const values = mapdata.map(item => item.value);
      const max = Math.max(...values);
      const min = Math.min(...values);
      set(styleOption, "mappingValueRange", [min, max]);

      const option = {
        heatMapStyle: styleOption,
        bVisible: true,
        entityName: name,
        customId: id,
        customData: { data },
        points: {
          features: mapdata,
        },
      };
      const entity = new HeatMap(option);
      const params = { name, id, entity, data: item };
      (entity as any).__onClick__ = this.__emitHandler.bind(this, "click", params);
      (entity as any).__onMouseEnter__ = this.__emitHandler.bind(this, "mouseEnter", params);
      (entity as any).__onMouseOut__ = this.__emitHandler.bind(this, "mouseOut", params);
      this.pushEntity(id, entity);
    });
    const entitys = Array.from(this.entityMap.values());
    this.openDark();
    return await this.app.Scene.Add(
      entitys,
      {
        calculateCoordZ: {
          coordZRef: "surface",
          coordZOffset: 0,
        },
      },
    ).then((res) => {
      entitys.forEach((entity) => {
        entity.onClick((entity as any).__onClick__);
        entity.onMouseEnter((entity as any).__onMouseEnter__);
        entity.onMouseOut((entity as any).__onMouseOut__);
      });
      return res;
    });
  }

  abstract onCreate(): any | Promise<any>;

  abstract onUnmount(): any | Promise<any>;

  removeAll(): Promise<void> | Promise<any[]> | undefined {
    this.closeDark();
    return super.removeAll();
  }

  onClick(callback: (params: { name: string; id: string; data: T; entity: IHeatMap }) => void) {
    this.eventEmitter.on("click", callback);
  }

  onMouseEnter(callback: (params: { name: string; id: string; data: T; entity: IHeatMap }) => void) {
    this.eventEmitter.on("mouseEnter", callback);
  }

  onMouseOut(callback: (params: { name: string; id: string; data: T; entity: IHeatMap }) => void) {
    this.eventEmitter.on("mouseOut", callback);
  }
}
