import type Path from "wdpapi/dist/modules/scene/covering/Path";
import type { IPathStyle } from "@/utils/WdpMap/code/pathStyle.ts";
import { easyClone } from "@/utils";
import pathStyle from "@/utils/WdpMap/code/pathStyle.ts";
import BaseLayer from "./BaseLayer.ts";

interface IPathDataItem<T> {
  id: string;
  name: string;
  // 坐标
  coordinates: [number, number][];
  style?: IPathStyle | Record<string, any>;
  data: T;
}

type IPath = InstanceType<typeof Path>;

export default abstract class RangeLayer<T = any> extends BaseLayer<IPathDataItem<T>, IPath> {
  abstract readonly layerId: string;
  abstract readonly layerName: string;

  add(
    data: IPathDataItem<T> | IPathDataItem<T>[],
    style: IPathStyle | Record<string, any> = "roamingRoute",
    calculateCoordZ?: { coordZRef?: "surface" | "ground"; coordZOffset?: number },
  ) {
    if (!this.app) return;
    const Path = this.app.Path;
    const _data = Array.isArray(data) ? data : [data];
    const _style = easyClone(
      typeof style === "string"
        ? pathStyle[style] || pathStyle.roamingRoute
        : style,
    );
    _data.forEach((item) => {
      const { id, name, coordinates, style: customStyle, data } = item;
      const styleOption = easyClone(
        (
          customStyle && typeof customStyle === "string"
            ? pathStyle[customStyle]
            : customStyle
        ) || _style,
      );
      const jsonData = {
        polyline: {
          coordinates,
        },
        pathStyle: styleOption,
        bVisible: true,
        entityName: name,
        customId: id,
        customData: {
          data,
        },
      };
      const entity = new Path(jsonData);
      const params = { name, id, entity, data: item };
      (entity as any).__onClick__ = this.__emitHandler.bind(this, "click", params);
      (entity as any).__onMouseEnter__ = this.__emitHandler.bind(this, "mouseEnter", params);
      (entity as any).__onMouseOut__ = this.__emitHandler.bind(this, "mouseOut", params);
      this.pushEntity(id, entity);
    });
    const entitys = Array.from(this.entityMap.values());
    return this.app.Scene.Add(
      entitys,
      {
        calculateCoordZ: {
          coordZRef: calculateCoordZ?.coordZRef ?? "surface",
          coordZOffset: calculateCoordZ?.coordZOffset ?? 100,
        },
      },
    ).then(() => {
      entitys.forEach((entity) => {
        entity.onClick((entity as any).__onClick__);
        entity.onMouseEnter((entity as any).__onMouseEnter__);
        entity.onMouseOut((entity as any).__onMouseOut__);
      });
    });
  }

  abstract onCreate(): any | Promise<any>;

  abstract onUnmount(): any | Promise<any>;

  onClick(callback: (params: { name: string; id: string; data: T; entity: IPath }) => void) {
    this.eventEmitter.on("click", callback);
  }

  onMouseEnter(callback: (params: { name: string; id: string; data: T; entity: IPath }) => void) {
    this.eventEmitter.on("mouseEnter", callback);
  }

  onMouseOut(callback: (params: { name: string; id: string; data: T; entity: IPath }) => void) {
    this.eventEmitter.on("mouseOut", callback);
  }
}
