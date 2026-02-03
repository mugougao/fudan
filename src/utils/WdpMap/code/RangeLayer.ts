import type Range from "wdpapi/dist/modules/scene/covering/Range";
import type { IRangeStyleKey } from "@/utils/WdpMap/code/rangeStyle.ts";
import { easyClone } from "@/utils";
import rangeStyle from "@/utils/WdpMap/code/rangeStyle.ts";
import BaseLayer from "./BaseLayer.ts";

interface IRangeDataItem<T> {
  id: string;
  name: string;
  // 外环 坐标
  outerRingCoordinates: [number, number][];
  // 内环 坐标
  innerRingCoordinates?: [number, number][];
  style?: IRangeStyleKey | Record<string, any>;
  data: T;
}

type IRange = InstanceType<typeof Range>;

export default abstract class RangeLayer<T = any> extends BaseLayer<IRangeDataItem<T>, IRange> {
  abstract readonly layerId: string;
  abstract readonly layerName: string;

  add(
    data: IRangeDataItem<T> | IRangeDataItem<T>[],
    style: IRangeStyleKey | Record<string, any> = "campus",
  ) {
    if (!this.app) return;
    const Range = this.app.Range;
    const _data = Array.isArray(data) ? data : [data];
    const _rangeStyle = easyClone(
      typeof style === "string"
        ? rangeStyle[style] || rangeStyle.campus
        : style,
    );
    _data.forEach((item) => {
      const { id, name, outerRingCoordinates, innerRingCoordinates, style: customStyle, data } = item;
      const rangeStyleOption = easyClone(
        (
          customStyle && typeof customStyle === "string"
            ? rangeStyle[customStyle]
            : customStyle
        ) || _rangeStyle,
      );
      const jsonData = {
        entityName: name,
        customId: id,
        customData: { data },
        polygon2D: {
          coordinates: [
            [ // 外环坐标数据
              ...outerRingCoordinates,
            ],
            [ // 内环坐标数据
              ...(innerRingCoordinates || []),
            ],
          ],
        },
        rangeStyle: rangeStyleOption,
        bVisible: true,
      };
      const entity = new Range(jsonData);
      const params = { name, id, entity, data: item };
      (entity as any).__onClick__ = this.__emitHandler.bind(this, "click", params);
      (entity as any).__onMouseEnter__ = this.__emitHandler.bind(this, "mouseEnter", params);
      (entity as any).__onMouseOut__ = this.__emitHandler.bind(this, "mouseOut", params);
      this.pushEntity(id, entity);
    });
    const entitys = Array.from(this.entityMap.values());
    return this.app.Scene.Add(
      entitys,
      { calculateCoordZ: { coordZRef: "ground", coordZOffset: 0 } },
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

  onClick(callback: (params: { name: string; id: string; data: T; entity: IRange }) => void) {
    this.eventEmitter.on("click", callback);
  }

  onMouseEnter(callback: (params: { name: string; id: string; data: T; entity: IRange }) => void) {
    this.eventEmitter.on("mouseEnter", callback);
  }

  onMouseOut(callback: (params: { name: string; id: string; data: T; entity: IRange }) => void) {
    this.eventEmitter.on("mouseOut", callback);
  }
}
