import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/campusStyle",
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test/index.vue"),
    meta: { title: "测试" },
  },
  {
    path: "/decrypt",
    name: "decrypt",
    component: () => import("@/views/decrypt/index.vue"),
    meta: { title: "解密" },
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   name: "notFound",
  //   component: () => import("@/views/notFound/index.vue"),
  //   meta: { title: "404" },
  // },
];
