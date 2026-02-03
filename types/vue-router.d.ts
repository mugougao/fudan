import "vue-router";

export { };

declare module "vue-router" {
  // 扩展 RouteRecordRaw
  // export interface RouteRecordRaw {
  //   name: string | symbol;
  //   meta: RouteMeta;
  // }

  interface RouteMeta {
    layout?: "admin" | "wdp" | "default";
    // 标题
    title?: string;
    // 是否需要缓存
    keepAlive?: boolean;
    // 是否需要登录
    auth?: boolean;
    // 是否是 布局路由
    isLayout?: boolean;
    // 是否 展示校区
    showCampus?: boolean;
    // 能否 展示校区弹窗
    showCampusPopup?: boolean;
    // 图标
    icon?: string;
    // 是否是 菜单路由 (默认是菜单路由)
    isMenu?: boolean;
    // 权限
    permissions?: string;
    // 同级关联 路由
    relation?: string;
  }
}
