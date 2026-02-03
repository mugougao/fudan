import { CampusId } from "@/enums";

export default {
  return: "返回",
  campusName: {
    邯郸: "邯郸",
    江湾: "江湾",
    枫林: "枫林",
    张江: "张江",
  },
  headerToolbar: {
    openAnniversary: "开启校庆",
    closeAnniversary: "关闭校庆",
    layerControl: "图层控制",
    weatherControl: "天气控制",
    signOut: "退出登录",
    adminMgr: "后台管理",
  },
  message: {
    login: "请先登录",
    noPermission: "无权限访问",
    noData: "暂无数据",
    noDataTip: "暂无数据",
    logout: "退出登录",
    logoutTip: "您确定要退出登录吗？",
  },
  // 校区
  campus: [
    { id: CampusId.Overview, title: "概览" },
    { id: CampusId.HanDan, title: "邯郸" },
    { id: CampusId.JiangWan, title: "江湾" },
    { id: CampusId.FengLin, title: "枫林" },
    { id: CampusId.ZhangJiang, title: "张江" },
  ],
  // 底部导航
  footerNav: {
    viewFuDan: "瞰见复旦",
    campusBus: "校园班车",
    culturalCalendar: "文化日历",

    smartsTeaching: "智慧教学",
    lifeServices: "生活服务",
    venueFacilities: "场馆设施",
    campusAccess: "校园出入",

    campusAssets: "校园资产",
    assetMgr: "资产管理",
    largeInstruments: "大型仪器",
    research: "科研中心",

    dormitoryMgr: "宿舍管理",

    financial: "财务管理",
    financialEnergy: "能耗管理",
    financialOverview: "财务总览",

    construction: "校园建设",
    constructionRepair: "校园修缮",
    constructionBuild: "新建楼宇",
    constructionBuildMgr: "楼宇管理",

    network: "网络监控",
    overviw: "综合态势",

    alert: "预警监控",
    evacuate: "人流疏散预警",
  },
  // 瞰见复旦
  viewFuDan: {
    promotionalVideo: "宣传片",
    classicPunchIn: "经典打卡",
    embraceNature: "拥抱自然",
    studyTour: "Study Tour",
    checkInPoints: "打卡点",
    roamingPlay: "漫游玩",
  },
  // 校园班车
  campusBus: {
    dataScreen: "校车快递数据大屏",
    rightTitle: "校车时刻表",
    rightSubTitle: "最近车次",
  },
  // 智慧教学
  smartsTeaching: {
    campusOverview: "校园概览",
    schoolBuilding: "教学楼",
    classroom: "教室数",
    classroomTypeDistribution: "教室类型分布",
    classroomNumberDistribution: "教室数量分布",

    classroomPosture: "教室态势",
    classroomOccupancy: "教室使用率（近七天）",
    buildingOccupancy: "教学楼栋使用率",
    heatmap: "热力图",

    buildOverview: "教学楼概览",
    busyDay: "当天繁忙度",
    roomTotal: "教室总数",
    useScales: "使用比例",
    courseTypeDistribution: "课程类型分布",
    class: "课时",
    course: "课程",
    buildName: "楼宇名称",
    currentUsage: "当前使用率",
    currentDayUsage: "当天使用率",

    classroomDetails: "教室详情",
    classroomNumber: "教室编号",
    classroomStatus: "教室状态",
    classroomBusyness: "教室繁忙度",

    courseInformation: "课程信息",
    courseName: "课程名称",
    courseCode: "课程代码",
    teacher: "授课教师",
    classSize: "上课人数",
  },
  // 场馆设施
  venueFacilities: {
    venueUsageData: "场馆实际使用数据",
    facilityScreen: "场馆设施数据大屏",
    todayAppointments: "今日预约场次",
    annualAppointments: "本年度预约总场次",
    todayOrder: "今日预约订单数",
    appointmentStatistics: "预约场次统计(含未来1天预约信息)",

    natatoriumOverview: "游泳馆数据概览",
    natatoriumLocation: "游泳馆位置",
    monthlyAttendance: "昨日各时段人次分布",
    monthTotal: "本月总人数",
    personnelDistribution: "游泳场馆人员分布",
    nearlySevenDaysToll: "近七天游泳馆场馆人数",
    floorControl: "楼层控制",
  },
  // 校园出入
  campusAccess: {
    campusOverview: "校园概览",
    entranceAndExitNumber: "四校区出入口数量",
    numberOfEntriesByCard: "人员刷卡进校数量",
    todayEnterTheSchoolTotal: "今日进校总人次",
    todayEnterTheSchoolDistribution: "今日进校人次分布",

    entranceAndExitSituation: "校区出入口态势",
    entranceAndExit: "出入口",
    swipeDevice: "刷卡设备",
    enterTheSchoolToday: "今日进校",
    onCampus: "校内",
    outside: "校外",
    footTrafficDistribution: "人流量分布",
    useHeatMapsForEachEntrance: "各出入口使用热力图",
    percentageOfCardSwipingTypes: "刷卡类型占比",

    gatePostSituation: "门岗态势",
    theNameOfTheGate: "门岗名称",
    personnelOnCampus: "校内人员",
    offCampusPersonnel: "校外人员",
    // 门岗人流量分布: "人流量分布",
    // footTrafficDistribution: "人流量分布",
    personnelOnCampusDistribution: "校内人员分布",
    offCampusPersonnelDistribution: "校外人员分布",
    numberOfSchoolAttendances: "进校人次",
    average: "平均进校人次",
  },
  // 资产管理
  assetMgr: {
    campusOverview: "校区总览",
    totalAssets: "总资产数",
    totalAmount: "总金额数",
    device: "设备",
    furniture: "家具",
    software: "软件",
    campusAssetsNumberDistribution: "四校区资产数量分布",
    campusAssetsExpireDistribution: "四校区资产已使用年限分布",
    campusLargeInstrumentsDistribution: "四校区大型仪器分布",
    assetsExpireDistribution: "资产到期分布",
    largeInstrumentsDistribution: "大型仪器分布",
    instrumentsTotal: "仪器总数",

    biBigScreen: "Bi资产管理大屏",
    facultyAssetQuery: "院系资产查询",

    propertyInformation: "房产信息",
    grossFloorArea: "建筑面积",
    usableArea: "使用面积",
    yearOfConstruction: "建设年份",
    buildingNature: "楼宇性质",
    assetInformation: "资产信息",
    buildTotalAssets: "总资产",
    buildTotalAmount: "总资产金额",
    largeInstrumentsNumber: "大型仪器数量",
    assetDistribution: "资产分布",
    assetsNumberDistribution: "资产数量分布",
    assetsAmountDistribution: "资产金额分布",
    assetsTotal: "资产总量",
    assetsTotalAmount: "资产总额",

    assetsTotal2: "总资产数",
  },
  // 大型仪器
  largeInstruments: {
    campusOverview: "校区总览",
    mainUseDirection: "主要使用方向",
    largeScaleInstrumentDistribution: "校区大型仪器分布",
    terminalInstrumentsAreInstalled: "已安装终端仪器数量",
    facultiesLargeInstrumentsList: "院系大型仪器列表",
    facultiesQuery: "院系查询",
    informationInquiry: "信息查询",
    buildDistribution: "楼宇分布",
    pointDistribution: "楼宇点位分布",
    buildInfoQuery: "楼宇信息查询",
    facultiesInfoQuery: "院系信息查询",
    largeInstrumentMonitoringScreen: "大型仪器数据大屏",

    totalDevices: "总设备数",
    totalAmount: "总金额数",

    faculties: "院系",
    devicesNumber: "设备数量",
    amount: "金额",
    TerminalsNumber: "终端数量",

    buildName: "楼宇名称",
    useDirections: "使用方向",
    device: "设备",
    number: "数量",

    pleaseEnterFaculties: "请输入院系名称",
    pleaseEnterBuilding: "请输入楼宇名称",
  },
  // 宿舍管理
  dormitory: {
    // 校区
    campus: {
      campusOverview: "校园概览",
      dormitoryBuild: "宿舍楼宇",
      roomNumber: "房间数",
      bedNumber: "床位数",
      personnelDistribution: "人员分布",
      totalNumber: "总人数",
      campusEnergyConsumption: "校园能耗",
      buyPower: "购电",
      usePower: "用电",
      monthBuyPower: "本月购电",
      buyPowerAmount: "购电金额",
      yearOverYearGrowthRate: "同比增长率",
      lastMonthBuyPowerAmount: "上月购电金额",
      monthBuyPowerAmount: "本月购电金额",
      largePropertyDataScreen: "物业数据大屏",
    },
    // 宿舍区
    area: {
      parkBaseOverview: "园区基本概况",
      occupancyRate: "入住率分布",
      build: "宿舍楼宇",
      rooms: "房间数",
      beds: "床位数",
      supervisors: "督导员",
      roomOccupancy: "房间入住率",
      bedOccupancy: "床位占用率",
      occupiedRoom: "已入住房间",
      noShowroom: "未入住房间",
      occupiedBed: "已入住床位",
      noShowBed: "未入住床位",
      personnelBaseInfo: "人员基本信息",
      totalOccupancy: "总入住人数",
      facultiesTop5: "入住人数Top5的院系",
      faculties: "院系分布",
      checkInTime: "入住时间分布",
      electricityPurchases: "购电情况",
      yesterdayBuyPower: "昨日购电",
      electricityConsumption: "用电情况",
      yesterdayUsePower: "昨日用电",
      approvalData: "审批数据",
      approveToday: "昨日完成审批事项",
      retreatToday: "昨日完成退宿",
    },
    // 宿舍楼
    build: {
      dormitoryInformation: "宿舍信息",
      floorTables: "楼层表",
      park: "园区",
      build: "楼宇",
      rooms: "房间",
      beds: "床位",
      supervisors: "督导员",
      parkCommittee: "园委会成员",
      supervisorsColumns: ["姓名", "园区", "联系电话"],
      parkCommitteeColumns: ["姓名", "院系", "学号"],
      supervisorsTitle: "值班督导员信息",
      parkCommitteeTitle: "值班园委会成员信息",

      personnelInformation: "人员信息",
      occupancyRate: "入住率",
      totalPeople: "总人数",
      personnelInfoColumns: ["序号", "院系", "人数", "占比"],

      energyConsumptionInformation: "能耗信息",
      top5RoomsElectric: "用电量Top5房间",
      yesterdayUsePower: "昨日用电量",
      yesterdayBuyPower: "昨日购电量",
      top5RoomsDetails: "用电量Top5房间详情",
      top5RoomsDetailsField: ["房间名称", "用电量"],

      focusOnStudent: "重点关注学生信息",
      lengthOfStay: "累计住宿时长",
      checkOutTime: "预计退宿时间",

      personnelWarn: "人员预警",
      warnTotalPeople: "预警总人数",
      personnelWarnColumns: ["序号", "学号", "姓名", "手机号", "房间号", "院系"],
    },
    // 宿舍房间
    room: {
      roomDetails: "房间详情",
      civilizedDormitory: "文明寝室",
      roomDetailsField: [
        "所在园区",
        "所在楼宇",
        "所在楼层",
        "房间号",
        "房间类别",
        "房间性别",
      ],
      HouseType_3D: "三维户型",
      over: "俯视",
      roam: "漫游",

      personnelInformation: "人员信息",
      personnelInformationField: [
        "所属学院",
        "学生学历",
        "预计毕业时间",
      ],

      energyInformation: "能耗信息",
      yearEnergyInformation: "年度能耗信息",
      currentYearUsePower: "本年度用电量",
      currentYearBuyPowerAmount: "本年度购电量",

      monthUsePowerInfo: "当月用电信息",
      monthUsePower: "当月用电",

      monthBuyPowerInfo: "当月购电信息",
      monthBuyPower: "当月购电",

    },
  },
  // 网络监控
  network: {
    campusOverview: "校区AP总览",
    campusAPDistribution: "四校区AP数量分布",
    deviceNumberCount: "AP数量统计",
    apNumberCount: "AP数量统计",
    healthDistribution: "健康度分布",
    ssidChannelDistribution: "SSID信道分布",
    fiveGChannelDistribution: "5G信号占比",
    campusUserStatistics: "校园用户统计",
    campusOnlineUserAndTerminalDistribution: "四校区在线用户&终端分布",
    userAndTerminalChangeTrend: "用户/终端变化趋势",
    trafficComparison: "流量对比",
    wirelessAPStatistics: "无线AP统计",
    personnelDistributionBuildingTop5: "人员分布楼宇Top5",
  },
  financial: {
    index: {
      schoolOverview: "校区概览",
      // 资产净值
      assetNetValue: "资产净值",
      // 年度用电
      yearUsePower: "年度用电",
      // 年度用水
      yearUseWater: "年度用水",
      // 安保物业
      safetyProperty: "安保物业",
      // 校园修缮
      campusRepair: "校园修缮",
      // 点位标记
      pointMark: "点位标记",
      // 校区银行
      campusBank: "校区银行",
      // 自助报账机
      selfServiceBillingMachine: "自助报账机",
      // 自助补卡机
      selfServiceCardMachine: "自助补卡机",
      // 四校区概览
      overview: "四校区概览",
      // overview
      campusOverview: "校区概览",
      // 设备
      device: "设备",
      // 家具
      furniture: "家具",
      // 软件
      software: "软件",
      // 动植物
      animal: "动植物",
      // 总计
      total: "总计",
      // 金额
      amount: "金额",
      // 资产净值
      netAssets: "资产净值",
      // 总资产数
      totalNumber: "总资产数",
      // 四校区资产数量分布
      campusAssetsDistribution: "四校区资产数量分布",
      // 大型仪器
      largeInstruments: "大型仪器",
      // 总收费金额
      totalChargeAmount: "总收费金额",
      // 校内收费
      internalCharge: "校内收费",
      // 校外收费
      externalCharge: "校外收费",
      // 总览
      electricityUseOverview: "总览",
      // 用电能耗
      electricityUse: "用电能耗",
      // 用电金额
      electricityAmount: "用电金额",
      // 昨日
      yesterday: "昨日",
      // 本月
      month: "本月",
      // 年度
      year: "年度",
      // 四校区用电统计
      campusElectricityStatistics: "四校区用电统计",
      // 四校区用水统计
      campusWaterStatistics: "四校区用水统计",
      // 用水能耗
      waterUse: "用水能耗",
      // 用水金额
      waterAmount: "用水金额",
      // 年度安保费
      annualInsurance: "年度安保费",
      // 四校区安保费用分布
      insuranceDistribution: "四校区安保费用分布",
      // 四校区物业费用分布
      propertyDistribution: "四校区物业费用分布",
      // 修缮总金额
      totalRepairAmount: "修缮总金额",
      // 年度修缮总数
      totalRepairNum: "本年度修缮总数",
      // 正在进行修缮数
      ongoingRepairNum: "进行中修总缮数",
      // 四校区修缮分布
      repairDistribution: "四校区修缮分布",
      // 校区资产分布
      assetsDistribution: "校区资产分布",
      // 楼宇用电分布
      buildingElectricDistribution: "楼宇用电分布",
      // 楼宇用水分布
      buildingWaterDistribution: "楼宇用水分布",
      // 楼宇分布
      buildingDistribution: "楼宇分布",
    },
    energy: {
      campusTotal: "校区总览",
      campusOverview: "校区概览",
      campusChargingQueryMap: "校园充电查询地图",
      energyDataOverview: "能耗数据概览",
      yesterdayEnergy: "昨日用电能耗",
      thisMonthEnergy: "本月用电能耗",
      thisYearEnergy: "年度用电能耗",
      yesterdayWater: "昨日用水能耗",
      thisMonthWater: "本月用水能耗",
      thisYearWater: "年月用水能耗",
      chargingPile: "充电桩",
      chargingPileCharge: "充电量",
      chargingPileChargeAmount: "充电金额",
      electricCar: "电动车",
      newEnergy: "新能源",
      energy: "用电",
      water: "用水",
      energyStatistics: "本年度四校区用能统计",
      energyStatisticsTop5: "年度楼宇能耗TOP5",
      chargingPileChargeTotal: "本年度累计充电量",
      energyStatisticsTotal: "累计总金额",
      electricCarChargeTotal: "电动车充电量",
      electricChargeTotal: "新能源车充电量",
      totalConsumptionAmount: "总消费金额",
      energyMonitoring: "能源监控",
      yearBuildingEnergyDetail: "年度楼宇能耗明细",
    },
  },
  construction: {
    index: {
      basicInformation: "基本信息",
      implementUnit: "实施单位",
      projectProgress: "项目进度",
      constructionScale: "建设规模",
      effectPicture: "效果图",
    },
    repair: {
      campusOverview: "校区总览",
      dailyRepair: "日常修缮",
      scaleRepair: "规模修缮",
      yearTotalRepair: "本年度修缮总数",
      ongoingRepair: "进行中修缮数",
      totalRepair: "修缮总数",
      repairList: "修缮列表",
      earlyWarn: "预警信息",
    },
  },
  overviw: {
    campusOverview: "校区总览",
    todayCampus: "今日校园",
    basicInfo: "基本情况",
    campusCount: "校区数量",
    campusArea: "占地面积",
    hospital: "附属医院",
    libraryBook: "校图书馆藏书",
    campusPeople: "在校人数",
    peopleDistribution: "人员分布",
    majorDistribution: "专业分布",
    campusGate: "校园门岗",
    campusAssets: "校园资产",
    energyStatistics: "能耗统计",
    bigScreenLink: "大屏链接",
    undergraduate: "本科生",
    graduate: "研究生",
    internationalStudent: "学历留学生",
    teacher: "教学科研人员",
    acad: "院士(含双聘)",
    undergraduateMajor: "本科专业",
    firstLevelMaster: "一级学科硕士点",
    firstLevelDoctor: "一级学科博士点",
    masterMajor: "硕士专业学位授权点",
    doctorMajor: "博士专业学位授权点",
    todayIn: "今日进校人次",
    totalAssets: "总资产数",
    totalAmount: "总金额",
    totalNetValue: "资产净值",
    totalSavings: "年度累计同比节能",
    totalElectricity: "今年用电",
    totalElectricityLastYear: "去年用电",
    totalWater: "今年用水",
    totalWaterLastYear: "去年用水",
  },
};
