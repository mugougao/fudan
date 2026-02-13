import { pick } from "lodash";
import studyTourData from "@/assets/json/study_tour(1).json";
import embraceNatureData from "@/assets/json/拥抱自然.json";
// import { getLandmark } from "@/api/campusStyle/index.ts";
import PoiLayer from "../code/PoiLayer.ts";
import cameraInfo from "./RoamingRoutePoiCameraInfo.json";

class RoamingRoutePoiLayer extends PoiLayer<any> {
  layerId: string = "RoamingRoutePoiLayer";
  layerName: string = "漫游路线Poi图层";

  typeMap = { 1: "经典打卡", 2: "study tour", 3: "拥抱自然" };

  async fetchData(type: "1" | "2" | "3") {
    const _type = this.typeMap[type];
    console.log(`[RoamingRoutePoiLayer] 加载${_type}数据`);

    // const [err, res] = await to(getLandmark(_type));
    // if (err) {
    //   window.$message.error(`${this.layerName}-数据获取失败!!!`);
    //   return;
    // }
    // if (!res?.resultData) {
    //   window.$message.warning(`暂无${_type}数据!!!`);
    //   return;
    // }
    let res: any = {};
    if (_type === "经典打卡") {
      res = { resultData: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.495043,
                31.299473,
              ],
            },
            properties: {
              FID_: 1,
              Shape__: "点",
              dbmc: "相辉堂",
              X: 121.495043,
              Y: 31.299473,
              lb: "经典打卡",
              xq: "相辉堂是复旦校园内最具有历史意义的建筑之一，是复旦人共同的精神家园。相辉堂原名登辉堂， 始建于1947年2月。 1947 年7月5日， 老校长李登辉对当时所有复旦学子讲到：“ 服务、 牺牲、 团结是复旦的精神， 更是你们的责任。” 登辉堂落成以后， 一直是全校师生集会的主要场所。 1985 年， 学校为永远纪念马相伯和李登辉两位老校长， 将其改名为“ 相辉堂”。相辉堂是全校师生重要活动的场所， 苏联最高苏维埃主席伏罗希洛夫、 法国总统德斯坦、 法国共产党总书记马歇、 美国总统里根等都曾在相辉堂做报告。 2006 年2月相辉堂被批准为上海市第四批优秀历史建筑。 ",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.49587,
                31.298323,
              ],
            },
            properties: {
              FID_: 3,
              Shape__: "点",
              dbmc: "校史馆",
              X: 121.49587,
              Y: 31.298323,
              lb: "经典打卡",
              xq: "校史馆前身是建成于1921年的奕住堂，位于校园西侧登辉环路草坪南面，毗邻复旦大学老校门，与复旦大学“相辉堂”相望。1930年，为纪念薛仙舟先生改名“仙舟图书馆”，后成为中文系、经济系办公场地。2005年百年校庆之际，改为复旦大学校史馆。校史馆用千余幅照片， 367 件实物， 辅以若干声像视频， 以时间为线索， 分11个时期立体展现复旦百年的历史和发展。 一楼展厅展示复旦从公学到大学、 从私立到国立、 新中国成立到文革结束的发展脉络。 二楼展厅展示改革开放以来复旦逐步迈向世界一流大学的改革创新历程。 ",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.500734,
                31.301953,
              ],
            },
            properties: {
              FID_: 9,
              Shape__: "点",
              dbmc: "光华楼",
              X: 121.500734,
              Y: 31.301953,
              lb: "经典打卡",
              xq: "光华楼位于邯郸校区的校园最佳地理标志物奠基于2002年12月，至2005年复旦大学百年校庆之际正式落成，至今已经近20多年历史。凭借着142米的高度与楼前「狭窄」的走廊，光华楼不仅成为了邯郸校区最为高大醒目的地标式建筑，也引起其周围空气向两侧「挤压」，导致光华楼附近风特别大，成了复旦学子口中的「光华妖风」。光华楼名与复旦的校名同样取自《 尚书大传· 虞夏传》 的「 日月光华， 旦复旦兮」， 外观取义「 双峰日出」， 建筑面积12万平方米， 地上30层， 地下两层。 两栋主楼分别由东、 西塔楼组成—— 西主楼以文史哲学科为主， 而东主楼则由数学等理科学院入驻。 西侧辅楼为教学楼， 东侧辅楼为各种类型的报告厅和教室， 常举办重要讲座和活动。 ",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.497812,
                31.299661,
              ],
            },
            properties: {
              FID_: 11,
              Shape__: "点",
              dbmc: "校训墙",
              X: 121.497812,
              Y: 31.299661,
              lb: "经典打卡",
              xq: "1915年，为纪念复旦创校十周年，时任校长李登辉组织国文系教授商议并最终由马相伯老校长选定复旦校训：“博学而笃志，切问而近思。”校训出自《论语·子张》“博学而笃志，切问而近思，仁在其中矣”。校训墙是复旦百年校庆时重新建造的。 ",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.499214,
                31.299528,
              ],
            },
            properties: {
              FID_: 12,
              Shape__: "点",
              dbmc: "毛主席像",
              X: 121.499214,
              Y: 31.299528,
              lb: "经典打卡",
              xq: "毛泽东像位于校门正后方，绿树成荫，鲜花遍地。雕像人身高7.1米，象征着建党之日；底座5.16米，对应毛主席起草的「五一六通知」；全像总高12.26米，代表伟人生辰。",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.496299,
                31.298202,
              ],
            },
            properties: {
              FID_: 14,
              Shape__: "点",
              dbmc: "老校门",
              X: 121.496299,
              Y: 31.298202,
              lb: "经典打卡",
              xq: "复旦大学老校门位于邯郸校区燕园西侧，2005年在百年校庆时仿1921年最早的校门新建而成。重建的老校门是一座牌楼式的仿古建筑，它高6.1米，宽11米，大门内外各有3节台阶、2个坡道，采用芝麻灰色的花岗岩基座，牌楼顶部飞檐翘角，屋脊的两头各有1个螭吻，两大两小，整体庄重典雅而古朴；南北两面，衙门式杉木栏门的正中是正圆的铜质复旦校徽；上方校名匾仍然沿用了毛主席题写的“复旦大学”四字。",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.496959,
                31.29818,
              ],
            },
            properties: {
              FID_: 15,
              Shape__: "点",
              dbmc: "燕园",
              X: 121.496959,
              Y: 31.29818,
              lb: "经典打卡",
              xq: "燕园原为王、谢二姓富商的私家花园，它插在复旦校园和排球场之间，师生深感不便。1943年12月，复旦校董会决定向业主购买该园。李登辉校长取意古诗“旧时王谢堂前燕，飞入寻常百姓家”而命名。",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.499479,
                31.29881,
              ],
            },
            properties: {
              FID_: 23,
              Shape__: "点",
              dbmc: "正门（东南2门）",
              X: 121.499479,
              Y: 31.29881,
              lb: "经典打卡",
              xq: "复旦大学正门作为学校的标志性建筑之一，见证了学校多年来的发展与变迁，承载着丰富的历史文化内涵，是复旦历史的重要见证者。白底红字的校名为毛主席亲笔题名。",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.494781,
                31.299077,
              ],
            },
            properties: {
              FID_: 24,
              Shape__: "点",
              dbmc: "蔡冠深人文馆（博物馆）",
              X: 121.494781,
              Y: 31.299077,
              lb: "经典打卡",
              xq: "复旦大学博物馆坐落于环境幽雅的校园西区，为两栋上下两层的仿古建筑，原有展览面积约两千六百平方米。该馆于一九九二年元旦正式开馆，现有藏品约两千多件，分别为复旦大学旧藏、国家文物局调拨（河南省博物馆、洛阳文物工作队移交）以及上海博物馆等单位的捐赠品。从种类来看涉及陶瓷器、青铜器、甲骨、书画、台湾原住民文物等各类艺术珍品。2020 年， 复旦大学博物馆改扩建。 串联复旦大学各校区场馆（ 如祖嘉生物复旦大学博物馆、 病理标本复旦大学博物馆、 人体科学馆等）， 并以主校区（ 邯郸校区） 全新的艺术复旦大学博物馆为核心。 同时， 将艺术与科学融合， 最终打造复旦大学博物馆集群， 并促使该集群与校史馆、 档案馆、 图书馆等交相辉映。 ",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.495731,
                31.299427,
              ],
            },
            properties: {
              FID_: 25,
              Shape__: "点",
              dbmc: "子彬院（吕志和楼）",
              X: 121.495731,
              Y: 31.299427,
              lb: "经典打卡",
              xq: "在复旦大学校园西部的绿树浓荫中，掩映着一座淡灰色的四层楼宇，雍容典雅，仪态万端，同周围的建筑相比，风格迥异，每一个复旦人都熟悉，并把它戏称为“小白宫”，意即其门庭的造型风格可与美国白宫相媲美。子彬院是由著名心理学家郭任远的族叔郭子彬捐资兴建， 于1926年落成， 并作为复旦心理学院用房， 后又作为数学系办公场地。 2005 年， 校董吕志和捐赠改扩建后， 以“ 吕志和楼” 冠名。 ",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.501092,
                31.300854,
              ],
            },
            properties: {
              FID_: 26,
              Shape__: "点",
              dbmc: "光华楼打卡位",
              X: 121.501092,
              Y: 31.300854,
              lb: "经典打卡",
              xq: "12313",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                121.502723,
                31.302532,
              ],
            },
            properties: {
              FID_: 27,
              Shape__: "点",
              dbmc: "东2门",
              X: 121.502723,
              Y: 31.302532,
              lb: "经典打卡",
              xq: "1231312321313",
            },
          },
        ],
      } };
    }
    else if (_type === "拥抱自然") {
      console.log("[RoamingRoutePoiLayer] 使用拥抱自然.json文件数据");
      res = { resultData: embraceNatureData };
    }
    else if (_type === "study tour") {
      console.log("[RoamingRoutePoiLayer] 使用study_tour(1).json文件数据");
      res = { resultData: studyTourData };
    }
    if (!res || !res.resultData || !res.resultData.features || res.resultData.features.length === 0) {
      console.warn(`[RoamingRoutePoiLayer] ${_type}数据为空或格式错误`);
      return;
    }

    const { features = [] } = res.resultData;
    console.log(`[RoamingRoutePoiLayer] 解析${_type}数据，共${features.length}个地标`);
    this.setData(features.map((item: any) => {
      const { geometry, properties } = item;
      const coordinates = geometry.coordinates;
      const { dbmc } = properties;
      const id = String(properties.FID_);
      return {
        id,
        name: dbmc,
        location: coordinates,
        data: item.properties,
      };
    }));
  }

  async render(type: "1" | "2" | "3") {
    await this.fetchData(type);
    await this.add(
      Array.from(this.layerDataMap.values()),
      "buildNew",
    );
  }

  focusById(id: string, pathId: string) {
    console.log("[RoamingRoutePoiLayer] focusById called, id:", id, "pathId:", pathId);
    if (!this.app) {
      console.error("[RoamingRoutePoiLayer] app对象未初始化，无法执行聚焦操作");
      return;
    }
    console.log("[RoamingRoutePoiLayer] app对象存在，开始查找cameraInfo");
    console.log("[RoamingRoutePoiLayer] cameraInfo长度:", cameraInfo.length);

    // 首先尝试直接通过id和pathId查找
    let info = cameraInfo.find(item => item.id === id && item.pathId === pathId);

    // 如果找不到，尝试通过name查找
    if (!info) {
      console.log("[RoamingRoutePoiLayer] 直接id查找失败，尝试通过name查找");
      // 从layerDataMap中获取地标信息
      const formattedId = this.idFormat(id);
      console.log("[RoamingRoutePoiLayer] 格式化后的ID:", formattedId);
      const landmarkData = this.layerDataMap.get(formattedId);
      if (landmarkData) {
        console.log("[RoamingRoutePoiLayer] 找到地标数据:", landmarkData);
        const landmarkName = landmarkData.name;
        // 通过name和pathId查找相机配置
        info = cameraInfo.find(item => item.name === landmarkName && item.pathId === pathId);
        if (info) {
          console.log("[RoamingRoutePoiLayer] 通过name找到相机配置:", info);
        }
        else {
          console.error("[RoamingRoutePoiLayer] 通过name也未找到相机配置，name:", landmarkName, "pathId:", pathId);
          console.log("[RoamingRoutePoiLayer] cameraInfo中所有匹配pathId的项:", cameraInfo.filter(item => item.pathId === pathId).map(item => ({ name: item.name, id: item.id })));
        }
      }
      else {
        console.error("[RoamingRoutePoiLayer] layerDataMap中未找到id对应的地标:", id, "formattedId:", formattedId);
        console.log("[RoamingRoutePoiLayer] layerDataMap中的keys:", Array.from(this.layerDataMap.keys()));
      }
    }

    if (!info) {
      console.error("[RoamingRoutePoiLayer] 未找到匹配的相机配置，id:", id, "pathId:", pathId);
      console.log("[RoamingRoutePoiLayer] cameraInfo中所有项:", cameraInfo.map(item => ({ id: item.id, pathId: item.pathId, name: item.name })));
      return;
    }

    console.log("[RoamingRoutePoiLayer] 找到相机配置:", info);
    const jsonData = {
      ...pick(info, ["targetPosition", "rotation", "distance"]),
      flyTime: 1,
    };
    console.log("[RoamingRoutePoiLayer] 调用CameraControl.FlyTo, 参数:", jsonData);
    this.app.CameraControl.FlyTo(jsonData);
    console.log("[RoamingRoutePoiLayer] FlyTo调用完成");
  }

  onCreate() {

  }

  onUnmount() {
    this.removeAll();
  }
}

export default new RoamingRoutePoiLayer();
