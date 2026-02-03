import type Text3D from "wdpapi/dist/modules/scene/covering/Text3D";
import type { ITextStyle } from "@/utils/WdpMap/code/textStyle.ts";
import { set } from "lodash";
import { easyClone } from "@/utils";

import textStyle from "@/utils/WdpMap/code/textStyle.ts";
import BaseLayer from "./BaseLayer.ts";

interface IText3DDataItem<T> {
  id: string;
  name: string;
  // 坐标
  location: [number, number, number];
  rotator?: { pitch?: number; yaw?: number; roll?: number };
  scale3d?: [number, number, number];
  style?: ITextStyle | Record<string, any>;
  data: T;
}

type IText3D = InstanceType<typeof Text3D>;
export default abstract class TextLayer<T = any> extends BaseLayer<IText3DDataItem<T>, IText3D> {
  abstract readonly layerId: string;
  abstract readonly layerName: string;

  add(
    data: IText3DDataItem<T> | IText3DDataItem<T>[],
    style: ITextStyle | Record<string, any> = "roamingRoute",
    calculateCoordZ?: { coordZRef?: "surface" | "ground"; coordZOffset?: number },
  ) {
    if (!this.app) return;
    const Text3D = this.app.Text3D;
    const _data = Array.isArray(data) ? data : [data];
    const _style = easyClone(
      typeof style === "string"
        ? textStyle[style] || textStyle.roamingRoute
        : style,
    );
    _data.forEach((item) => {
      const { id, name, location, style: customStyle, data, rotator, scale3d = [100, 30, 30] } = item;
      const styleOption = easyClone(
        (
          customStyle && typeof customStyle === "string"
            ? textStyle[customStyle]
            : customStyle
        ) || _style,
      );
      set(styleOption, "text", name);
      const jsonData = {
        location: location as number[],
        rotator: {
          pitch: rotator?.pitch ?? 0,
          yaw: rotator?.yaw ?? 30,
          roll: rotator?.roll ?? 0,
        },
        scale3d: scale3d as number[],
        text3DStyle: styleOption,
        bVisible: true,
        entityName: name,
        customId: id,
        customData: {
          data,
        },
      };
      const entity = new Text3D(jsonData);
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
          coordZOffset: calculateCoordZ?.coordZOffset ?? 0,
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

  remove(ids: string | string[]) {
    if (!this.app) return;
    const _ids = Array.isArray(ids) ? ids : [ids];
    const result = Promise.allSettled(_ids.reduce((prev, id) => {
      const entity = this.getEntity(id);
      if (entity) {
        prev.push(entity.Delete());
      }
      return prev;
    }, [] as Promise<any>[]));

    // const result = this.app.Scene.ClearByCustomId(_ids);
    this.removeEntity(..._ids);
    return result;
  }

  abstract onCreate(): any | Promise<any>;

  abstract onUnmount(): any | Promise<any>;

  onClick(callback: (params: { name: string; id: string; data: T; entity: IText3D }) => void) {
    this.eventEmitter.on("click", callback);
  }

  onMouseEnter(callback: (params: { name: string; id: string; data: T; entity: IText3D }) => void) {
    this.eventEmitter.on("mouseEnter", callback);
  }

  onMouseOut(callback: (params: { name: string; id: string; data: T; entity: IText3D }) => void) {
    this.eventEmitter.on("mouseOut", callback);
  }
}
