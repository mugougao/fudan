export { };
declare module "vue" {
  import type { Dayjs } from "dayjs";
  import type dayjs from "dayjs";
  import type * as echarts from "echarts";
  import type lodash from "lodash";

  export interface ComponentCustomProperties {
    $echarts: typeof echarts;
    $dayjs: typeof dayjs;
    $dateFormat: (date: string | number | Dayjs, template: string = "YYYY-MM-DD HH:mm:ss") => string | undefined;
    $_: typeof lodash;
    $t: typeof import("vue-i18n").t;
    $n: typeof import("vue-i18n").n;
    $te: typeof import("vue-i18n").te;
    $d: typeof import("vue-i18n").d;
    $dm: typeof import("vue-i18n").dm;
    $raw: typeof import("vue-i18n").raw;
    $tm: typeof import("vue-i18n").tm;
    $rt: typeof import("vue-i18n").rt;
    $i18n: typeof import("vue-i18n").useI18n;
    $router: typeof import("vue-router").Router;
    $route: typeof import("vue-router").Router.currentRoute;
  }
}
