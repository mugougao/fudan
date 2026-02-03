import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";
import LayoutAdmin from "@/layouts/admin/index.vue";
import LayoutDefault from "@/layouts/default/index.vue";
import LayoutWdp from "@/layouts/wdp/index.vue";
import router from "@/router/index.ts";

const layoutMap = {
  default: LayoutDefault,
  admin: LayoutAdmin,
  wdp: LayoutWdp,
} as Record<string, Component>;

export function setupLayouts(routes: RouteRecordRaw[], top = true): RouteRecordRaw[] {
  return routes.map((route) => {
    if (route?.children && route?.children.length > 0)
      route.children = setupLayouts(route.children, false);

    const layout = route.meta?.layout;

    if (!layout)
      return route;

    const layoutComponent = layoutMap[layout];

    if (!layoutComponent)
      return route;

    if (top) {
      const skip = !route.component && route.children?.find(r => ["", "/"].includes(r.path) && r?.meta?.isLayout);
      if (skip)
        return route;

      if (route.meta?.layout) {
        return {
          path: route.path,
          name: Symbol(`${route.meta?.layout}.${(route.name as string)}`),
          meta: { isLayout: true },
          component: layoutMap[layout],
          children: route.path === "/" ? [route] : [{ ...route, path: "" }],
        };
      }
    }

    return {
      path: route.path,
      name: Symbol(`${route.meta?.layout}.${(route.name as string)}`),
      component: layoutComponent,
      meta: { isLayout: true },
      children: [{ ...route, path: "" }],
    };
  });
}

// 设置路由重定向
export function setupRedirect(routes: RouteRecordRaw[], parentPath = "") {
  return routes.map((route) => {
    if (route.children && route.children.length > 0) {
      setupRedirect(route.children, route.path);
    }
    if (!route.redirect && route.children?.length) {
      const childName = route.children[0].name;
      if (childName) {
        route.redirect = { name: childName };
      }
      else {
        route.redirect = [parentPath, route.path, route.children[0].path].join("/").replace(/\/\//g, "/");
      }
    }
    return route;
  });
}

const whiteNameList = ["notFound", "test"];

// 重置路由
export function resetRouter() {
  const routes = router.getRoutes();
  routes.forEach((route: any) => {
    const { name } = route;
    if (name && !whiteNameList.includes(name))
      router.hasRoute(name) && router.removeRoute(name);
  });
}

/**
 * 根据 权限过滤 路由
 * @param routes
 * @param permissions
 */
export function filterRoutes(routes: RouteRecordRaw[], permissions: string[]) {
  return routes.reduce((prev, curr) => {
    const permissionsKey = curr.meta?.permissions as string;
    if (!permissionsKey) return prev;
    if (permissions.includes(permissionsKey)) {
      curr.children = curr.children && curr.children.length
        ? filterRoutes(curr.children, permissions)
        : [];
      prev.push(curr);
    }
    return prev;
  }, [] as RouteRecordRaw[]);
}

/**
 * 转换路由
 * @description 根据权限过滤路由，并设置布局组件、设置重定向
 * @param routes
 * @param permissions
 */
export function addAsyncRoutes(routes: RouteRecordRaw[], permissions: string[]) {
  if (!routes || !routes.length) return;
  // 不再进行权限过滤
  // routes = filterRoutes(routes, permissions);
  routes = setupLayouts(routes);
  routes = setupRedirect(routes);
  if (routes.length) {
    // 不再添加根路径重定向，因为已在 routes/index.ts 中定义
    routes.forEach((route) => {
      router.addRoute(route);
    });
  }
}

export interface Menu {
  key: string;
  label: string;
  icon?: string;
  children?: Menu[];
}

/**
 * 转换路由为菜单
 * @param routes
 */
export function transformRouteToMenu(routes: RouteRecordRaw[]) {
  return routes.reduce((prev, curr) => {
    const isMenu = curr.meta?.isMenu ?? true;
    if (isMenu) {
      const { name, meta } = curr;
      const { title, icon } = meta || {};
      if (name && title) {
        const menu: Menu = {
          key: name as string,
          label: title,
          icon,
        };
        if (curr.children && curr.children.length) {
          menu.children = transformRouteToMenu(curr.children);
        }
        prev.push(menu);
      }
    }
    return prev;
  }, [] as Menu[]);
}
