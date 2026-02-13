import RangeLayer from "../code/RangeLayer";

class BuildingOccupancyRangeLayer extends RangeLayer<any> {
  readonly layerId: string = "buildingOccupancyRangeLayer";
  readonly layerName: string = "教学楼使用率";

  onCreate() {
    this.fetchData();
  }

  onUnmount() {
    this.removeAll();
  }

  removeAll() {
    this.closeDark();
    return super.removeAll();
  }

  async fetchData() {
    // 硬编码建筑矢量面数据，从CSV文件中提取
    // 解析坐标字符串函数
    const parseCoordinates = (coordStr: string): [number, number][] => {
      if (!coordStr) return [];
      return coordStr.split(";").map((point) => {
        const match = point.match(/\(([^,]+),([^)]+)\)/);
        if (match) {
          const lon = Number.parseFloat(match[1].trim());
          const lat = Number.parseFloat(match[2].trim());
          return [lon, lat] as [number, number];
        }
        return [0, 0] as [number, number];
      }).filter(([lon, lat]) => lon !== 0 && lat !== 0);
    };

    // 硬编码建筑多边形数据，从geom_teach_building.csv中提取
    const buildingPolygonData = [
      {
        id: "141",
        mc: "H6",
        supnme: "JXL6",
        coordinates: "(121.500003,31.29699)", // 简化的点坐标，实际应为多边形
        g: 14.0,
      },
      {
        id: "175",
        mc: "H光华东主楼",
        supnme: "",
        coordinates: "(121.49983,31.301937); (121.501775,31.302512); (121.501974,31.302016); (121.500029,31.301441); (121.49983,31.301937)",
        g: 162.0,
      },
      {
        id: "178",
        mc: "H光学楼",
        supnme: "",
        coordinates: "(121.497069,31.299941); (121.49729,31.300038); (121.497394,31.299903); (121.497142,31.299755); (121.496402,31.299373); (121.496334,31.299477); (121.496397,31.29951); (121.496375,31.299544); (121.49632,31.299515); (121.496158,31.299755); (121.496259,31.299809); (121.496398,31.299602); (121.497069,31.299941)",
        g: 36.5,
      },
      {
        id: "137",
        mc: "H2",
        supnme: "",
        coordinates: "(121.499719,31.299431); (121.499557,31.299843); (121.499694,31.299886); (121.499748,31.299757); (121.499791,31.29977); (121.499835,31.299665); (121.500221,31.299784); (121.500238,31.299751); (121.500413,31.299813); (121.500468,31.299673); (121.499719,31.299431)",
        g: 26.0,
      },
      {
        id: "138",
        mc: "H3",
        supnme: "",
        coordinates: "(121.500073,31.300193); (121.500125,31.300211); (121.500308,31.300275); (121.500429,31.299966); (121.500411,31.299959); (121.500252,31.299909); (121.500184,31.300086); (121.499517,31.299889); (121.499438,31.300064); (121.500057,31.300252); (121.500073,31.300193)",
        g: 29.0,
      },
      {
        id: "140",
        mc: "H5",
        supnme: "JXL5",
        coordinates: "(121.499796,31.297452)", // 简化的点坐标
        g: 14.0,
      },
      {
        id: "264",
        mc: "H元创中心",
        supnme: "",
        coordinates: "(121.500206,31.302548); (121.500836,31.302741); (121.500906,31.302574); (121.500276,31.30238); (121.500206,31.302548)",
        g: 33.8,
      },
    ];

    // 转换为图层需要的格式
    const features = buildingPolygonData.map((building) => {
      const outerRingCoordinates = parseCoordinates(building.coordinates);
      // 如果只有单个点坐标（简化的），创建一个小的矩形区域
      if (outerRingCoordinates.length === 1) {
        const [lon, lat] = outerRingCoordinates[0];
        outerRingCoordinates.push(
          [lon + 0.0001, lat],
          [lon + 0.0001, lat + 0.0001],
          [lon, lat + 0.0001],
          [lon, lat], // 闭合多边形
        );
      }

      return {
        id: building.id,
        name: building.mc,
        outerRingCoordinates,
        data: {
          id: building.id,
          mc: building.mc,
          supnme: building.supnme,
          g: building.g,
        },
      };
    });

    this.setData(features);

    // 注释掉原来的API调用
    // const [err, res] = await to(getBuildingVectorData());
    // if (err) return;
    // this.setData(
    //   (res?.resultData?.features || [])?.map((item) => {
    //     const { geometry, properties } = item;
    //     const { coordinates } = geometry;
    //     const { id, mc } = properties;
    //     return {
    //       id,
    //       name: mc,
    //       outerRingCoordinates: Array.from(
    //         new Set(coordinates.flat(2).map(item => item.join(","))),
    //         item => item.split(",").map(Number) as [number, number],
    //       ),
    //       data: properties,
    //     };
    //   }),
    // );
  }

  async render(params: { id: string; color: string }[]) {
    this.openDark();
    const list = params.reduce((prev, curr) => {
      if (this.hasData(curr.id)) {
        const data = this.getData(curr.id);
        prev.push({
          ...data,
          style: {
            shape: "polygon",
            type: "box_wave",
            fillAreaType: "block",
            height: data?.data?.g,
            strokeWeight: 10,
            color: curr.color,
          },
        });
      }
      return prev;
    }, [] as any[]);
    const result = await this.add(list);
    this.focusAll();
    return result;
  }
}

export default new BuildingOccupancyRangeLayer();
