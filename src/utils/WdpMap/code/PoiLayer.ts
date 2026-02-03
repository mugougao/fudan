import type CustomPoi from "wdpapi/dist/modules/scene/covering/custom-poi";
import { get } from "lodash";
import set from "lodash/set";
import { easyClone } from "@/utils";
import wdpMap from "../wdpMap.ts";
import BaseLayer from "./BaseLayer.ts";
import poiStyle from "./poiStyle.ts";

interface IPoiDataItem<T> {
  id: string;
  name: string;
  label?: string | string[];
  location: [number, number, number];
  // label?: string[];
  style?: string | Record<string, any>;
  data: T;
}

interface ICustomPoiDataItem<T> {
  id: string;
  name: string;
  location: [number, number, number];
  label: string[];
  style?: string | Record<string, any>;
  data: T;
}

type IPoi = InstanceType<typeof CustomPoi>;

export default abstract class PoiLayer<T = any> extends BaseLayer<IPoiDataItem<T>, IPoi> {
  abstract readonly layerId: string;
  abstract readonly layerName: string;

  async add(
    data: IPoiDataItem<T> | IPoiDataItem<T>[],
    style: string | Record<string, any> = "default",
    calculateCoordZ?: { coordZRef?: "surface" | "ground" | "altitude"; coordZOffset?: number },
  ) {
    if (!this.app) return;
    const Poi = this.app.CustomPoi;
    const _poiStyle = easyClone(
      typeof style === "string"
        ? poiStyle[style] || poiStyle.default
        : style,
    );
    const options: any[] = [];

    (Array.isArray(data) ? data : [data]).forEach((item) => {
      const { id, name, label, location, style: customStyle, data } = item;
      const poiStyleOption
        = easyClone(
          (
            customStyle && typeof customStyle === "string"
              ? poiStyle[customStyle]
              : customStyle
          ) || _poiStyle,
        );
      const _label = label ?? name;
      const labelContent = Array.isArray(_label) ? _label : [_label];
      // 修改标签名称
      set(poiStyleOption, "labelContent", labelContent);

      labelContent.forEach((text, index) => {
        const { fontSize = 12, width, padding = "0 0 0 0" } = get(poiStyleOption, `specificLabelStyle.content${index + 1}`);
        const [,pr = 0,,pl = 0] = padding.split(" ").map(Number);
        const resultWidth = width - pr - pl;
        // 统计中文字符（包括中文标点）
        const chineseChars = (text.match(/[\u4E00-\u9FA5\u3000-\u303F\uFF00-\uFFEF]/g) || []).length;
        // 统计英文字符（包括字母，英文符号和数字）
        const englishChars = (text.match(/[a-z0-9]/gi) || []).length;
        const charWidth = Number(fontSize) / 2;
        const textWidth = chineseChars * charWidth + englishChars * charWidth;
        // 根据文字长度 设置 滚动+速度
        set(poiStyleOption, `specificLabelStyle.content${index + 1}.scrollSpeed`, textWidth > resultWidth ? 1 : 0);
        set(poiStyleOption, `specificLabelStyle.content${index + 1}.fontSize`, fontSize * (wdpMap.screenHeight / wdpMap.screenWidth));

        // const contentPadding = get(poiStyleOption, `specificLabelStyle.content${index + 1}.padding`)
        //   .split(" ")
        //   .map(value => Number(value) * wdpMap.screenHeight / wdpMap.screenWidth)
        //   .join(" ");
        // set(poiStyleOption, `specificLabelStyle.content${index + 1}.padding`, contentPadding);
      });

      const option = {
        poiStyle: poiStyleOption,
        visible2D: poiStyleOption.visible2D,
        location,
        customId: id.startsWith(`${this.layerId}_`) ? id : `${this.layerId}_${id}`,
        entityName: name,
        customData: { data },
      };
      options.push(option);
      const entity = new Poi(option);
      const params = { name, id, entity, data: item };
      this.pushEntity(id, entity);
      (entity as any).__onClick__ = this.__emitHandler.bind(this, "click", params);
      (entity as any).__onMouseEnter__ = this.__emitHandler.bind(this, "mouseEnter", params);
      (entity as any).__onMouseOut__ = this.__emitHandler.bind(this, "mouseOut", params);
    });
    console.log("🚀 ~ PoiLayer ~ add ~ options:", options);

    const entitys = Array.from(this.entityMap.values());
    return await this.app.Scene.Add(
      entitys,
      {
        calculateCoordZ: {
          coordZRef: calculateCoordZ?.coordZRef ?? "surface",
          coordZOffset: calculateCoordZ?.coordZOffset ?? 0,
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

  onClick(callback: (params: { name: string; id: string; data: T; entity: IPoi }) => void) {
    this.eventEmitter.on("click", callback);
  }

  onMouseEnter(callback: (params: { name: string; id: string; data: T; entity: IPoi }) => void) {
    this.eventEmitter.on("mouseEnter", callback);
  }

  onMouseOut(callback: (params: { name: string; id: string; data: T; entity: IPoi }) => void) {
    this.eventEmitter.on("mouseOut", callback);
  }

  onHover(
    mouseEnter: (params: { name: string; id: string; data: T; entity: IPoi }) => void,
    mouseOut: (params: { name: string; id: string; data: T; entity: IPoi }) => void,
  ) {
    this.onMouseEnter(mouseEnter);
    this.onMouseOut(mouseOut);
  }
}
