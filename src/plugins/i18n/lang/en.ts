import { CampusId } from "@/enums";

export default {
  return: "Return",
  campusName: {
    邯郸: "HanDan",
    江湾: "JiangWan",
    枫林: "FengLin",
    张江: "ZhangJiang",
  },
  headerToolbar: {
    openAnniversary: "Open Anniversary",
    closeAnniversary: "Close Anniversary",
    layerControl: "Layer Control",
    weatherControl: "Weather Control",
    signOut: "Sign Out",
    adminMgr: "Admin Mgr",
  },
  message: {
    login: "please Log In First",
    noPermission: "no Access Permissions",
    noData: "no Data Yet",
    noDataTip: "no Data Yet",
    logout: "sign Out",
    logoutTip: "Are You Sure You Want To Log Out ?",
  },
  // 校区
  campus: [
    { id: CampusId.Overview, title: "All" },
    { id: CampusId.HanDan, title: "HanDan" },
    { id: CampusId.JiangWan, title: "JiangWan" },
    { id: CampusId.FengLin, title: "FengLin" },
    { id: CampusId.ZhangJiang, title: "ZhangJiang" },
  ],

  // 底部导航
  footerNav: {
    viewFuDan: "FD Vision",
    campusBus: "FD Shuttle",
    culturalCalendar: "FD Calendar",

    smartsTeaching: "Teaching",
    lifeServices: "Services",
    venueFacilities: "Venue",
    campusAccess: "Entrance",

    campusAssets: "Assets",
    assetMgr: "Asset",
    largeInstruments: "Equipments",
    research: "Research",

    dormitoryMgr: "Dormitory",

    financial: "Financial",
    financialEnergy: "Energy",
    financialOverview: "Overview",

    construction: "Construction",
    constructionRepair: "Repair",
    constructionBuild: "Build",
    constructionBuildMgr: "Build Mgr",

    network: "Network",
    overviw: "Overviw",
    alert: "Alert",
  },
  // 瞰见复旦
  viewFuDan: {
    promotionalVideo: "Promo Video",
    classicPunchIn: "Classic Tour",
    embraceNature: "Nature Tour",
    studyTour: "Study Tour",
    checkInPoints: "Check In Points",
    roamingPlay: "roaming Play",
  },
  // 校园班车
  campusBus: {
    dataScreen: "large Screen Of SchoolBus Express Data",
    rightTitle: "School Bus Schedules",
    rightSubTitle: "Nearest Trains",
  },
  // 智慧教学
  smartsTeaching: {
    campusOverview: "Campus Overview",
    schoolBuilding: "School Building",
    classroom: "Classroom",
    classroomTypeDistribution: "Classroom Type Distribution",
    classroomNumberDistribution: "Classroom Number Distribution",

    classroomPosture: "Classroom Posture",
    classroomOccupancy: "Classroom Occupancy(7 Days)",
    buildingOccupancy: "Building Occupancy",
    heatmap: "heatmap",

    buildOverview: "Build Overview",
    busyDay: "Busy Day",
    roomTotal: "RoomTotal",
    useScales: "UseScales",
    courseTypeDistribution: "Course Type Distribution",
    class: "Class",
    course: "Course",
    buildName: "Build Name",
    currentUsage: "current Usage",
    currentDayUsage: "current Day Usage",

    classroomDetails: "Classroom Details",
    classroomNumber: "Classroom Number",
    classroomStatus: "Classroom Status",
    classroomBusyness: "Classroom Busyness",

    courseInformation: "Course Information",
    courseName: "Course Name",
    courseCode: "Course Code",
    teacher: "Teacher",
    classSize: "Class Size",
  },
  // 场馆设施
  venueFacilities: {
    venueUsageData: "VenueUsageData",
    facilityScreen: "Facility Screen",
    todayAppointments: "Today Appointments",
    annualAppointments: "Annual Appointments",
    todayOrder: "Today Order",
    appointmentStatistics: "Appointment Statistics",

    natatoriumOverview: "Natatorium Overview",
    natatoriumLocation: "Location",
    monthlyAttendance: "Yesterday Periods PersonTimes",
    monthTotal: "month Total",
    personnelDistribution: "Personnel Distribution",
    nearlySevenDaysToll: "NearlySeven DaysToll",
    floorControl: "Floor Control",
  },
  // 校园出入
  campusAccess: {
    campusOverview: "Campus Overview",
    entranceAndExitNumber: "Entry And Exit Number",
    numberOfEntriesByCard: "Number Of Entries By Card",
    todayEnterTheSchoolTotal: "TodayEnterTotal",
    todayEnterTheSchoolDistribution: "Today Enter The School",

    entranceAndExitSituation: "Entrance And Exit Situation",
    entranceAndExit: "Entry/Exit",
    swipeDevice: "device",
    enterTheSchoolToday: "EnterToday",
    onCampus: "on",
    outside: "off",
    footTrafficDistribution: "Foot Traffic",
    useHeatMapsForEachEntrance: "UseHeatMaps",
    percentageOfCardSwipingTypes: "Percentage Of Card Swiping Types",

    gatePostSituation: "Gate Post Situation",
    theNameOfTheGate: "Gate Name",
    personnelOnCampus: "OnCampus",
    offCampusPersonnel: "OffCampus",
    // 门岗人流量分布: "人流量分布",
    // footTrafficDistribution: "人流量分布",
    personnelOnCampusDistribution: "OnCampus",
    offCampusPersonnelDistribution: "OffCampus",
    numberOfSchoolAttendances: "number Of Entrants",
    average: "average",
  },
  // 资产管理
  assetMgr: {
    campusOverview: "Campus Overview",
    totalAssets: "Total Assets",
    totalAmount: "Total Amount",
    device: "Device",
    furniture: "Furniture",
    software: "Software",
    campusAssetsNumberDistribution: "Assets Number Distribution",
    campusAssetsExpireDistribution: "Assets Expire Distribution",
    campusLargeInstrumentsDistribution: "Campus Large Instruments Distribution",
    assetsExpireDistribution: "Assets Expire Distribution",
    largeInstrumentsDistribution: "Large Instruments Distribution",
    instrumentsTotal: "Instruments Total",

    biBigScreen: "BI Big Screen",
    facultyAssetQuery: "Faculty Asset Query",

    propertyInformation: "Property Information",
    grossFloorArea: "builtArea",
    usableArea: "UsableArea",
    yearOfConstruction: "year",
    buildingNature: "nature",
    assetInformation: "Asset Information",
    buildTotalAssets: "total Assets",
    buildTotalAmount: "total Amount",
    largeInstrumentsNumber: "Large Instruments",
    assetDistribution: "Asset Distribution",
    assetsNumberDistribution: "AssetsNumberDistribution",
    assetsAmountDistribution: "AssetsAmountDistribution",
    assetsTotal: "Assets Total",
    assetsTotalAmount: "Total Amount",
    assetsTotal2: "Assets Total",
  },
  // 大型仪器
  largeInstruments: {
    campusOverview: "Campus Overview",
    mainUseDirection: "Main Use Direction",
    largeScaleInstrumentDistribution: "LargeInstrumentDistribution",
    terminalInstrumentsAreInstalled: "Terminal Instruments Are Installed",
    facultiesLargeInstrumentsList: "Faculties Large Instruments List",
    facultiesQuery: "Faculties Query",
    informationInquiry: "Information Inquiry",
    buildDistribution: "Build Distribution",
    pointDistribution: "Point Distribution",
    buildInfoQuery: "BuildInfo Query",
    largeInstrumentMonitoringScreen: "Large Instrument Data Screen",

    facultiesInfoQuery: "FacultiesInfo Query",
    totalDevices: "Total Devices",

    totalAmount: "Total Amount",
    faculties: "Faculties",
    devicesNumber: "Devices",
    amount: "Amount",
    TerminalsNumber: "Terminals",
    buildName: "Build Name",
    useDirections: "Use Directions",
    device: "Device",
    number: "number",

    pleaseEnterFaculties: "please Enter Faculties",
    pleaseEnterBuilding: "please Enter Building",
  },
  // 宿舍管理
  dormitory: {
    // 校区
    campus: {
      campusOverview: "Campus Overview",
      dormitoryBuild: "Dormitory Build",
      roomNumber: "Room Number",
      bedNumber: "Bed Number",
      personnelDistribution: "Personnel Distribution",
      totalNumber: "Total",
      campusEnergyConsumption: "Campus Energy Consumption",
      buyPower: "Buy Power",
      usePower: "Use Power",
      monthBuyPower: "Month Buy Power",
      buyPowerAmount: "Buy Power Amount",
      yearOverYearGrowthRate: "Year Over Year GrowthRate",
      lastMonthBuyPowerAmount: "Last Month Buy Power Amount",
      monthBuyPowerAmount: "Month Buy Power Amount",
      largePropertyDataScreen: "Large Property Data Screen",
    },
    // 宿舍区
    area: {
      parkBaseOverview: "Park Overview",
      occupancyRate: "OccupancyRate",
      build: "Build",
      rooms: "Rooms",
      beds: "Beds",
      supervisors: "Supervisors",
      roomOccupancy: "RoomOccupancy",
      bedOccupancy: "BedOccupancy",
      occupiedRoom: "OccupiedRoom",
      noShowroom: "NoShowroom",
      occupiedBed: "OccupiedBed",
      noShowBed: "NoShowBed",
      personnelBaseInfo: "Personnel BaseInfo",
      totalOccupancy: "Total Occupancy",
      facultiesTop5: "Faculties Top5",
      faculties: "Faculties",
      checkInTime: "CheckInTime",
      electricityPurchases: "Electricity Purchases",
      yesterdayBuyPower: "Yesterday",
      electricityConsumption: "Electricity Consumption",
      yesterdayUsePower: "Yesterday",
      approvalData: "Approval Data",
      approveToday: "Approve Yesterday",
      retreatToday: "Retreat Yesterday",
    },
    // 宿舍楼
    build: {
      dormitoryInformation: "Dormitory Information",
      floorTables: "Floor Tables",
      park: "Park",
      build: "Build",
      rooms: "Rooms",
      beds: "Beds",
      supervisors: "Supervisors",
      parkCommittee: "Park Committee",
      supervisorsColumns: ["name", "park", "phone"],
      parkCommitteeColumns: ["name", "faculties", "studentID"],
      supervisorsTitle: "DutySupervisorInformation",
      parkCommitteeTitle: "DutyParkCommitteeInformation",

      personnelInformation: "Personnel Information",
      occupancyRate: "Occupancy Rate",
      totalPeople: "Total People",
      personnelInfoColumns: ["index", "faculties", "number", "percent"],

      energyConsumptionInformation: "Energy Consumption Information",
      top5RoomsElectric: "Top5 Rooms Electric",
      yesterdayUsePower: "yesterday Use Power",
      yesterdayBuyPower: "yesterday Buy Power",
      top5RoomsDetails: "top5 Rooms Details",
      top5RoomsDetailsField: ["name", "usePower"],

      focusOnStudent: "Focus On Student",
      lengthOfStay: "Length Of Stay",
      checkOutTime: "Check Out Time",

      personnelWarn: "Personnel Warn",
      warnTotalPeople: "Warn Total People",
      personnelWarnColumns: ["index", "studentID", "name", "phone", "room", "faculties"],
    },

    // 宿舍房间
    room: {
      roomDetails: "room Details",
      civilizedDormitory: "civilized Dormitory",
      roomDetailsField: [
        "Park",
        "Build",
        "Floor",
        "Room",
        "RoomType",
        "RoomSex",
      ],
      HouseType_3D: "3D HouseType",
      over: "over",
      roam: "roam",

      personnelInformation: "personnel Info",
      personnelInformationField: [
        "faculty",
        "degree",
        "graduationTime",
      ],

      energyInformation: "Energy Info",
      yearEnergyInformation: "Year Energy Info",
      currentYearUsePower: "YearUsePower",
      currentYearBuyPowerAmount: "YearBuyPower",

      monthUsePowerInfo: "Use PowerInfo",
      monthUsePower: "UsePower",

      monthBuyPowerInfo: "Buy PowerInfo",
      monthBuyPower: "BuyPower",

    },
  },
  // 网络监控
  network: {
    campusOverview: "Campus Overview",
    campusAPDistribution: "Campus AP Distribution",
    deviceNumberCount: "Device Number Count",
    apNumberCount: "AP Number Count",
    healthDistribution: "Health Distribution",
    ssidChannelDistribution: "SSID Channel Distribution",
    fiveGChannelDistribution: "5G Channel",
    campusUserStatistics: "Campus User Statistics",
    campusOnlineUserAndTerminalDistribution: "Campus OnlineUser&Terminal ",
    userAndTerminalChangeTrend: "user/Terminal Change",
    trafficComparison: "Traffic Comparison",
    wirelessAPStatistics: "Wireless AP Statistics",
    personnelDistributionBuildingTop5: "Personnel Distribution Building Top5",
  },
  financial: {
    index: {
      schoolOverview: "School Overview",
      assetNetValue: "assetNetValue",
      yearUsePower: "yearUsePower",
      yearUseWater: "yearUseWater",
      safetyProperty: "safetyProperty",
      campusRepair: "campusRepair",
      pointMark: "pointMark",
      campusBank: "Bank",
      selfServiceBillingMachine: "Billing Machine",
      selfServiceCardMachine: "Card Machine",
      overview: "overview",
      campusOverview: "Campus Overview",
      device: "device",
      furniture: "furniture",
      software: "software",
      animal: " animal",
      total: "all",
      amount: "amount",
      netAssets: "assets",
      totalNumber: "total",
      campusAssetsDistribution: "Campus Assets Distribution",
      largeInstruments: "largeInstruments",
      totalChargeAmount: "totalChargeAmount",
      internalCharge: "internalCharge",
      externalCharge: "externalCharge",
      electricityUseOverview: "Electricity Use Overview",
      electricityUse: "Use",
      electricityAmount: "Amount",
      yesterday: "yesterday",
      month: "month",
      year: "year",
      campusElectricityStatistics: "Campus Electricity Statistics",
      campusWaterStatistics: "Campus Water Statistics",
      waterUse: "Use",
      waterAmount: "Amount",
      annualInsurance: "annualInsurance",
      insuranceDistribution: "Insurance Distribution",
      propertyDistribution: "Property Distribution",
      totalRepairAmount: "Total Amount",
      totalRepairNum: "TotalRepairNum",
      ongoingRepairNum: "OngoingRepairNum",
      repairDistribution: "Repair Distribution",
      assetsDistribution: "Assets Distribution",
      buildingElectricDistribution: "Building Electric Distribution",
      buildingWaterDistribution: "Building Water Distribution",
      buildingDistribution: "Building Distribution",
    },
    energy: {
      // 校区总览
      campusTotal: "Campus Total",
      // 校区概览
      campusOverview: "Campus Overview",
      // 校园充电查询地图
      campusChargingQueryMap: "Campus Charging Query Map",
      // 能耗数据概览
      energyDataOverview: "Energy Data Overview",
      // 昨日用电能耗
      yesterdayEnergy: "Yesterday Energy",
      // 本月用电能耗
      thisMonthEnergy: "This Month Energy",
      // 年度用电能耗
      thisYearEnergy: "This Year Energy",
      // 昨日用水能耗
      yesterdayWater: "Yesterday Water",
      // 本月用水能耗
      thisMonthWater: "This Month Water",
      // 年月用水能耗
      thisYearWater: "This Year Water",
      // 充电桩
      chargingPile: "Charging Pile",
      // 电动车充电量
      chargingPileCharge: "Charge",
      // 总消费金额
      chargingPileChargeAmount: "Amount",
      // 电动车
      electricCar: "Electric Car",
      // 新能源
      newEnergy: "New Energy",
      // 用电
      energy: "energy",
      // 用水
      water: "water",
      // 本年度四校区用能统计
      energyStatistics: "Energy Statistics",
      // 年度楼宇能耗TOP5
      energyStatisticsTop5: "Energy Statistics Top5",
      // 本年度累计充电量
      chargingPileChargeTotal: "Year Charge Total",
      // 累计总金额
      energyStatisticsTotal: "Total Amount",
      // 电动车充电量
      electricCarChargeTotal: "Charge",
      // 电车充电量
      electricChargeTotal: "Charge",
      // 总消费金额
      totalConsumptionAmount: "Amount",
      // 能源监控
      energyMonitoring: "Energy Monitoring",
      // 年度楼宇能耗明细
      yearBuildingEnergyDetail: "Year Building Energy Detail",
    },
  },
  construction: {
    index: {
      // 基本信息
      basicInformation: "Basic Information",
      // 实施单位
      implementUnit: "Implement Unit",
      // 项目进度
      projectProgress: "Project Progress",
      // 建设规模
      constructionScale: "Construction Scale",
      // 效果图
      effectPicture: "Effect Picture",
    },
    repair: {
      // 校区总览
      campusOverview: "Campus Overview",
      // 日常修缮
      dailyRepair: "Daily Repair",
      // 规模修缮
      scaleRepair: "Scale Repair",
      // 本年度修缮总数
      yearTotalRepair: "Year Total Repair",
      // 正在进行修缮数
      ongoingRepair: "Ongoing Repair",
      // 修缮总数
      totalRepair: "Total Repair",
      // 修缮列表
      repairList: "Repair List",
      // 预警信息
      earlyWarn: "Early Warn",
    },
  },
  overviw: {
    // 校区总览
    campusOverview: "Campus Overview",
    // 今日校园
    todayCampus: "Today Campus",
    // 基本情况
    basicInfo: "Basic Info",
    // 校区数量
    campusCount: "Campus Count",
    // 占地面积
    campusArea: "Campus Area",
    // 附属医院
    hospital: "Hospital",
    // 校图书馆藏书
    libraryBook: "Library Book",
    // 在校人数
    campusPeople: "Campus People",
    // 人员分布
    peopleDistribution: "People Distribution",
    // 专业分布
    majorDistribution: "Major Distribution",
    // 校园门岗
    campusGate: "Campus Gate",
    // 校园资产
    campusAssets: "Campus Assets",
    // 能耗统计
    energyStatistics: "Energy Statistics",
    // 大屏链接
    bigScreenLink: "Big Screen Link",
    // 本科生
    undergraduate: "Undergraduate",
    // 研究生
    graduate: "Graduate",
    // 学历留学生
    internationalStudent: "International Student",
    // 教学科研人员
    teacher: "Teacher",
    // 院士(含双聘)
    acad: "Acad",
    // 本科专业
    undergraduateMajor: "Undergraduate Major",
    // 一级学科硕士点
    firstLevelMaster: "First Level Master",
    // 一级学科博士点
    firstLevelDoctor: "First Level Doctor",
    // 硕士专业学位授权点
    masterMajor: "Master Major",
    // 博士专业学位授权点
    doctorMajor: "Doctor Major",
    // 今日进校人次
    todayIn: "Today In",
    // 总资产数
    totalAssets: "Total Assets",
    // 总金额
    totalAmount: "Total Amount",
    // 资产净值
    totalNetValue: "Total Net Value",
    // 年度累计同比节能
    totalSavings: "Total Savings",
    // 今年用电
    totalElectricity: "Energy",
    // 去年用电
    totalElectricityLastYear: "EnergyLastYear",
    // 今年用水
    totalWater: "Water",
    // 去年用水
    totalWaterLastYear: "WaterLastYear",
  },
};
