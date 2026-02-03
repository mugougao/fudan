<script setup lang="ts">
import CustomLink from "@/components/CustomLink/index.vue";
import { useI18nStore } from "@/stores/i18n.ts";
import { useUserStore } from "@/stores/user.ts";
import { cn } from "@/utils";

defineOptions({ name: "FooterNav" });
const I18nStore = useI18nStore();

interface INavItem {
  label: string;
  routeName?: string;
  icon: string;
  child?: INavItem[];
  isLink?: boolean;
  link?: string;
  disabled?: boolean;
  permissions?: string;
}

const navAllList: INavItem[] = [
  // 瞰见复旦
  {
    label: "footerNav.viewFuDan",
    routeName: "campusStyle",
    icon: "i-svg-reset-campus-style",
    permissions: "campusStyle",
    child: [
      {
      // 校园班车
        label: "footerNav.campusBus",
        routeName: "campusStyle.campusShuttleBus",
        permissions: "campusStyle.campusShuttleBus",
        icon: "i-svg-reset-campusShuttleBus",
      },
      {
      // 文化日历
        label: "footerNav.culturalCalendar",
        // routeName: "campusStyle.culturalCalendar",
        permissions: "campusStyle.culturalCalendar",
        icon: "i-svg-reset-cultural-calendar",
        isLink: true,
        link: "https://book.yunzhan365.com/kiij/iqat/mobile/index.html",
      },
    ],
  },
  // 智慧教学
  {
    label: "footerNav.smartsTeaching",
    routeName: "smartTeaching",
    permissions: "smartTeaching",
    icon: "i-svg-reset-smart-teaching",
  },
  // 生活服务
  {
    label: "footerNav.lifeServices",
    // routeName: "campusAccess",
    permissions: "campusAccess",
    icon: "i-svg-reset-lifeServices",
    child: [
      {
      // 场馆设施
        label: "footerNav.venueFacilities",
        routeName: "campusAccess.stadium",
        icon: "i-svg-reset-venueFacilities",
        permissions: "campusAccess.stadium",
      },
      {
      // 校园出入
        label: "footerNav.campusAccess",
        routeName: "campusAccess.campusSchool",
        icon: "i-svg-reset-campusSchool",
        permissions: "campusAccess.campusSchool",
      },
    ],
  },
  // 校园资产
  {
    label: "footerNav.campusAssets",
    routeName: "assetManagement",
    icon: "i-svg-reset-asset-management",
    permissions: "assetManagement",
    child: [
      {
      // 资产管理
        label: "footerNav.assetMgr",
        routeName: "assetManagement.campusAssets",
        permissions: "assetManagement.campusAssets",
        icon: "i-svg-reset-campus-assetsAgin",
      },
      {
      // 大型仪器
        label: "footerNav.largeInstruments",
        routeName: "assetManagement.instrument",
        permissions: "assetManagement.instrument",
        icon: "i-svg-reset-instrument",
      },
      {
        // 科研中心
        label: "footerNav.research",
        routeName: "assetManagement.research",
        permissions: "assetManagement.instrument",
        icon: "i-svg-reset-research",
      },
    ],
  },
  // 宿舍管理
  { label: "footerNav.dormitoryMgr", routeName: "lifeServices", permissions: "lifeServices", icon: "i-svg-reset-life-services" },

  // 财务管理
  {
    label: "footerNav.financial",
    routeName: "financial",
    permissions: "financial",
    icon: "i-svg-reset-campus-financial",
    child: [
      {
        // 财务总览
        label: "footerNav.financialOverview",
        routeName: "financial.index",
        permissions: "financial",
        icon: "i-svg-reset-financial-overview",
      },
      {
      // 能耗管理
        label: "footerNav.financialEnergy",
        routeName: "financial.energy",
        permissions: "financial",
        icon: "i-svg-reset-financial-energy",
      },
    ],
  },
  // 校园建设
  { label: "footerNav.construction", permissions: "construction", icon: "i-svg-reset-campus-construction", child: [
    {
      // 校园修缮
      label: "footerNav.constructionRepair",
      routeName: "construction.repair",
      permissions: "construction",
      icon: "i-svg-reset-campus-repair",
    },
    {
      // 校园建设
      label: "footerNav.constructionBuild",
      routeName: "construction.index",
      permissions: "construction",
      icon: "i-svg-reset-campus-build",
    },
    {
      // 楼宇管理
      label: "footerNav.constructionBuildMgr",
      routeName: "construction.build",
      permissions: "construction",
      icon: "i-svg-reset-campus-build",
    },
  ] },
  // 网络监控
  { label: "footerNav.network", routeName: "network", permissions: "network", icon: "i-svg-reset-network-monitoring" },
  // 综合态势
  { label: "footerNav.overviw", routeName: "overviw", permissions: "overviw", icon: "i-svg-reset-comprehensive-situation" },
  // 预警监控
  {
    label: "footerNav.alert",
    routeName: "alert",
    permissions: "alert",
    icon: "i-svg-reset-campus-alert",
    child: [
      { label: "footerNav.alert", routeName: "alert.index", icon: "i-svg-reset-alert" },
      { label: "footerNav.evacuate", routeName: "alert.evacuate", icon: "i-svg-reset-alert" },
    ],
  },
];

const userStore = useUserStore();
function filterNav(navList: INavItem[]) {
  return navList.filter((navItem) => {
    // 不再进行权限验证，始终显示
    if (navItem.child) {
      navItem.child = filterNav(navItem.child);
    }
    return true;
  });
}

const navList = computed(() => filterNav(navAllList));

const route = useRoute();
const routeMatched = computed(() => route.matched.map(item => item.name).filter(item => typeof item === "string"));
function isActiveRoute(navItem: INavItem) {
  const routeName = navItem.routeName;
  if (routeName) {
    if (routeMatched.value.includes(routeName)) {
      return true;
    }
    const relation = route.meta.relation;
    if (routeName && relation) {
      return routeName === relation;
    }
  }
  else {
    return navItem.child?.some(item => isActiveRoute(item));
  }
  return false;
}
</script>

<template>
  <div class="footer-nav pointer-events-auto absolute bottom-0 left-1/2 w-full flex items-center px-5 -translate-x-1/2">
    <ul class="footer-nav-options mx-5 flex gap-1">
      <li
        v-for="(nav) in navList" :key="nav.label"
        class="group group footer-nav-item relative">
        <CustomLink
          :route-name="nav.routeName" :is-link="nav.isLink" :link="nav.link"
          :disabled="nav.disabled"
          :class="cn(
            'font-title',
            isActiveRoute(nav) ? 'active' : ' hover:!text-white',
            I18nStore.lang === 'zhCN' ? 'tracking-widest text-20px' : 'text-14px',
          )">
          <span class="footer-nav-item-content">
            <span class="footer-nav-item-content-box flex items-center justify-center pt-1">
              <span class="footer-nav-item-text flex flex-col items-center">
                <span v-t="{ path: nav.label }" class="text-title text-[16px] text-white/80" />
                <span v-t="{ path: nav.label, locale: 'en' }" class="text-[8px] text-white/70" />
              </span>
            </span>
          </span>
        </CustomLink>

        <div v-if="nav.child" class="box children absolute bottom-full left-1/2 w-[110px] origin-bottom-center scale-y-0 px-2 py-3 transition-transform -translate-x-1/2 group-hover:scale-y-100 space-y-2">
          <CustomLink
            v-for="child in nav.child" :key="child.label"
            :route-name="child.routeName" :is-link="child.isLink" :link="child.link"
            :disabled="child.disabled"
            :class="cn(
              'subtitle font-title block whitespace-nowrap  text-center text-[14px] py-1',
              isActiveRoute(child) ? 'active' : 'hover:!text-white text-white/80',
              I18nStore.lang === 'zhCN' ? 'tracking-widest' : '',
            )">
            <span>{{ $t(child.label) }}</span>
          </CustomLink>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.footer-nav {
  &::before,
  &::after {
    content: "";
    display: block;
    flex: 1;
    height: 12px;
    background:
      linear-gradient(to right, transparent, transparent 5px, #fff 5px, #fff 6px) repeat-x left center / 6px 6px,
      linear-gradient(to left, transparent, transparent 28px, #fff 28px, #fff 30px) repeat-x left center / 30px 12px;
  }

  .footer-nav-options {
    .footer-nav-item {
      & > :deep(a) {
        .footer-nav-item-content {
          width: 140px;
          // background-color: blue;
          display: inline-flex;
          justify-content: center;
          position: relative;
          clip-path: polygon(
            8px 0,
            52px 0,
            54px 7px,
            calc(100% - 54px) 7px,
            calc(100% - 52px) 0,
            calc(100% - 8px) 0,
            100% 100%,
            0 100%
          );

          .footer-nav-item-content-box {
            width: 128px;
            height: 50px;
            position: relative;
            background:
              linear-gradient(to right, transparent, #fff) no-repeat left top / 64px 1px,
              linear-gradient(to left, transparent, #fff) no-repeat right top / 64px 1px,
              linear-gradient(180deg, #6d6d6d59 0%, transparent 85%);
            clip-path: polygon(
              8px 0,
              45px 0,
              47px 7px,
              calc(100% - 47px) 7px,
              calc(100% - 45px) 0,
              calc(100% - 8px) 0,
              100% 100%,
              0 100%
            );
            position: relative;
            &::before {
              content: "";
              width: 40px;
              height: 9px;
              background: linear-gradient(to right, transparent, #fff, transparent) no-repeat center / 128px 9px;
              position: absolute;
              top: 0;
              left: 50%;
              margin-left: -20px;
              transform: perspective(10px) rotateX(-10deg);
              transform-origin: top;
            }
          }
        }

        &.active {
          &::before {
            content: "";
            position: absolute;
            width: 30px;
            height: 2px;
            background-color: #eabc8b;
            left: 50%;
            margin-left: -15px;
            top: 2px;
          }

          .footer-nav-item-content {
            background: linear-gradient(0deg, #cc1a1a00 0%, #61101066 100%);

            &::after {
              content: "";
              position: absolute;
              width: 40px;
              height: 10px;
              bottom: -5px;
              left: 50%;
              margin-left: -20px;
              background-color: #cc1a1a;
              filter: blur(8px);
            }

            .footer-nav-item-content-box {
              background:
                linear-gradient(to right, transparent, #fff) no-repeat left top / 64px 1px,
                linear-gradient(to left, transparent, #fff) no-repeat right top / 64px 1px,
                linear-gradient(0deg, #611010cc 0%, #6d6d6d59 100%);
            }
          }
        }
      }
      :deep(.children) {
        background:
          linear-gradient(to right, transparent, #fff, transparent) no-repeat left top / 100% 1px,
          linear-gradient(to right, transparent, #fff, transparent) no-repeat left bottom / 100% 1px,
          linear-gradient(to bottom, transparent, #fff, transparent) no-repeat left top / 1px 100%,
          linear-gradient(to bottom, transparent, #fff, transparent) no-repeat right top / 1px 100%,
          #000a1799;
        clip-path: polygon(
          0 0,
          100% 0,
          100% calc(50% - 15px),
          calc(100% - 5px) calc(50% - 12px),
          calc(100% - 5px) calc(50% + 12px),
          100% calc(50% + 15px),
          100% 100%,
          0 100%,
          0 calc(50% + 15px),
          5px calc(50% + 12px),
          5px calc(50% - 12px),
          0 calc(50% - 15px)
        );
        // position: relative;
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 7px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat left top / 100% 100%;
          // background: red;
          top: 50%;
        }

        &::before {
          left: 0;
          transform: translateY(-50%) perspective(10px) rotateY(12deg);
          transform-origin: left;
        }
        &::after {
          right: 0;
          transform: translateY(-50%) perspective(10px) rotateY(-12deg);
          transform-origin: right;
        }

        .subtitle.active {
          background: linear-gradient(270deg, rgba(204, 26, 26, 0) 0%, #e88383 49%, rgba(204, 26, 26, 0) 100%) no-repeat
            left bottom / 100% 1px;
          position: relative;
          overflow: hidden;
          &::before {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translateX(-50%) translateY(50%);
            width: 50px;
            height: 10px;
            background: #cc1a1a;
            filter: blur(8px);
          }
        }
      }
    }
  }
}
</style>
