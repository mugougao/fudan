import type { RouteRecordRaw } from "vue-router";

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/campusStyle",
    name: "campusStyle",
    component: () => import("@/views/campusStyle/index.vue"),
    meta: { title: "瞰见复旦", layout: "default", permissions: "campusStyle", showCampus: true },
  },
  {
    path: "/campusShuttleBus",
    name: "campusStyle.campusShuttleBus",
    component: () => import("@/views/campusStyle/campusShuttleBus/index.vue"),
    meta: { title: "校园班车", layout: "default", permissions: "campusStyle.campusShuttleBus", showCampus: true, relation: "campusStyle" },
  },
  {
    path: "/smartTeaching",
    name: "smartTeaching",
    component: () => import("@/views/smartTeaching/index.vue"),
    meta: { title: "智慧教学", layout: "default", permissions: "smartTeaching", showCampus: false },
  },
  {
    path: "/campusAccess",
    name: "campusAccess",
    // component: () => import("@/views/campusAccess/index.ts"),
    meta: { title: "生活服务", layout: "default", permissions: "campusAccess", showCampus: true },
    children: [
      {
        path: "stadium",
        name: "campusAccess.stadium",
        component: () => import("@/views/campusAccess/stadium/index.vue"),
        meta: { title: "场馆设施", permissions: "campusAccess.stadium", showCampus: true },
      },
      {
        path: "campusSchool",
        name: "campusAccess.campusSchool",
        component: () => import("@/views/campusAccess/campusSchool/index.vue"),
        meta: { title: "校园出入", permissions: "campusAccess.campusSchool", showCampus: true },
      },
    ],
  },
  {
    path: "/assetManagement",
    name: "assetManagement",
    // component: () => import("@/views/assetManagement/index.ts"),
    meta: { title: "校园资产", layout: "default", permissions: "assetManagement", showCampus: true },
    children: [
      {
        path: "campusAssets",
        name: "assetManagement.campusAssets",
        component: () => import("@/views/assetManagement/campusAssets/index.vue"),
        meta: { title: "资产管理", permissions: "assetManagement.campusAssets", showCampus: true },
      },
      {
        path: "instrument",
        name: "assetManagement.instrument",
        component: () => import("@/views/assetManagement/instrument/index.vue"),
        meta: { title: "大型仪器", permissions: "assetManagement.instrument", showCampus: true },
      },
      {
        path: "research",
        name: "assetManagement.research",
        component: () => import("@/views/assetManagement/research/index.vue"),
        meta: { title: "科研中心", permissions: "assetManagement.instrument", showCampus: false },
      },
      {
        path: "researchDevice",
        name: "assetManagement.researchDevice",
        component: () => import("@/views/assetManagement/research/device.vue"),
        meta: { title: "科研中心", permissions: "assetManagement.instrument", showCampus: false, relation: "assetManagement.research" },
      },
    ],
  },
  {
    path: "/lifeServices",
    name: "lifeServices",
    meta: { title: "宿舍管理", layout: "default", permissions: "lifeServices", showCampus: true },
    children: [
      {
        path: "",
        name: "lifeServices.index",
        component: () => import("@/views/lifeServices/index.vue"),
        meta: { title: "整体视角", permissions: "lifeServices", showCampus: true },
      },
      {
        path: "campus",
        name: "lifeServices.campusSchool",
        component: () => import("@/views/lifeServices/campus/index.vue"),
        meta: { title: "校区视角", permissions: "lifeServices", showCampus: false },
      },
      {
        path: "campusPark",
        name: "lifeServices.campusPark",
        component: () => import("@/views/lifeServices/campusPark/index.vue"),
        meta: { title: "园区视角", permissions: "lifeServices", showCampus: false },
      },
      {
        path: "building",
        name: "lifeServices.building",
        component: () => import("@/views/lifeServices/building/index.vue"),
        meta: { title: "楼宇视角", permissions: "lifeServices", showCampus: false },
      },
      {
        path: "cubicles",
        name: "lifeServices.cubicles",
        component: () => import("@/views/lifeServices/cubicles/index.vue"),
        meta: { title: "房间视角", permissions: "lifeServices", showCampus: false },
      },
    ],
  },
  /* {
    path: "/comprehensiveSituation",
    name: "comprehensiveSituation",
    component: () => import("@/views/comprehensiveSituation/index.vue"),
    meta: { title: "综合态势", permissions: "comprehensiveSituation", layout: "default", showCampus: false },
  },
  {
    path: "/campusSecurity",
    name: "campusSecurity",
    component: () => import("@/views/campusSecurity/index.vue"),
    meta: { title: "校园安防", permissions: "campusSecurity", layout: "default", showCampus: false },
  },
  {
    path: "/smartLogistics",
    name: "smartLogistics",
    component: () => import("@/views/smartLogistics/index.vue"),
    meta: { title: "智慧后勤", permissions: "smartLogistics", layout: "default", showCampus: false },
  },
  {
    path: "/networkMonitoring",
    name: "networkMonitoring",
    component: () => import("@/views/networkMonitoring/index.vue"),
    meta: { title: "网络监控", permissions: "networkMonitoring", layout: "default", showCampus: false },
  }, */

  {
    path: "/financial",
    name: "financial",
    meta: { title: "财务管理", permissions: "financial", layout: "default", showCampus: true },
    children: [
      {
        path: "",
        name: "financial.index",
        component: () => import("@/views/financial/index.vue"),
        meta: { title: "财务总览", permissions: "financial", showCampus: true },
      },
      {
        path: "campus",
        name: "financial.campus",
        component: () => import("@/views/financial/campus.vue"),
        meta: { title: "财务总览", permissions: "financial", showCampus: true, relation: "financial.index" },
      },
      {
        path: "energy",
        name: "financial.energy",
        component: () => import("@/views/financial/energy.vue"),
        meta: { title: "能耗管理", permissions: "financial", showCampus: true },
      },
      {
        path: "energyCampus",
        name: "financial.energyCampus",
        component: () => import("@/views/financial/energyCampus.vue"),
        meta: { title: "能耗管理", permissions: "financial", showCampus: true, relation: "financial.energy" },
      },
    ],
  },
  {
    path: "/construction",
    name: "construction",
    meta: { title: "校园建设", permissions: "construction", layout: "default", showCampus: true },
    children: [
      {
        path: "",
        name: "construction.index",
        component: () => import("@/views/construction/index.vue"),
        meta: { title: "校园建设", permissions: "construction", showCampus: true },
      },
      {
        path: "repair",
        name: "construction.repair",
        component: () => import("@/views/construction/repair.vue"),
        meta: { title: "校园修缮", permissions: "construction", showCampus: true },
      },
      {
        path: "repairCampus",
        name: "construction.repairCampus",
        component: () => import("@/views/construction/repairCampus.vue"),
        meta: { title: "校园修缮", permissions: "construction", showCampus: true, relation: "construction.repair" },
      },
      {
        path: "build",
        name: "construction.build",
        component: () => import("@/views/construction/build.vue"),
        meta: { title: "楼宇管理", permissions: "construction", showCampus: false },
      },
    ],
  },
  {
    path: "/network",
    name: "network",
    meta: { title: "网络监控", permissions: "network", layout: "default", showCampus: true },
    children: [
      // 总览 视角
      {
        path: "",
        name: "network.index",
        component: () => import("@/views/network/index.vue"),
        meta: { title: "网络管理", permissions: "network", showCampus: true },
      },
      // 校区 视角
      {
        path: "campus",
        name: "network.campus",
        component: () => import("@/views/network/campus.vue"),
        meta: { title: "网络管理", permissions: "network", showCampus: true },
      },
    ],
  },
  {
    path: "/overviw",
    name: "overviw",
    meta: { title: "综合态势", permissions: "overviw", layout: "default", showCampus: true },
    children: [
      {
        path: "",
        name: "overviw.index",
        component: () => import("@/views/overviw/index.vue"),
        meta: { title: "综合态势", permissions: "overviw", showCampus: true },
      },
      {
        path: "campus",
        name: "overviw.campus",
        component: () => import("@/views/overviw/campus.vue"),
        meta: { title: "综合态势", permissions: "overviw", showCampus: true },
      },
    ],
  },
  {
    path: "/alert",
    name: "alert",
    meta: { title: "预警监控", permissions: "alert", layout: "default", showCampus: false },
    children: [
      {
        path: "",
        name: "alert.index",
        component: () => import("@/views/alert/index.vue"),
        meta: { title: "预警监控", permissions: "alert", showCampus: false },
      },
      {
        path: "evacuate",
        name: "alert.evacuate",
        meta: { title: "人流疏散预警", permissions: "alert", showCampus: false },
        component: () => import("@/views/alert/evacuate.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "admin",
    meta: { title: "系统管理", permissions: "admin", layout: "admin", showCampus: false },
    children: [
      {
        path: "user",
        name: "admin.user",
        component: () => import("@/views/admin/User/index.vue"),
        meta: { title: "用户管理", permissions: "admin.user", icon: "i-ri-user-line" },
      },
      {
        path: "role",
        name: "admin.role",
        component: () => import("@/views/admin/Role/index.vue"),
        meta: { title: "角色管理", permissions: "admin.role", icon: "i-ri-group-3-line" },
      },
      {
        path: "permission",
        name: "admin.permission",
        component: () => import("@/views/admin/Permission/index.vue"),
        meta: { title: "权限管理", permissions: "admin.permission", icon: "i-ri-exchange-2-line" },
      },
    ],
  },
];
