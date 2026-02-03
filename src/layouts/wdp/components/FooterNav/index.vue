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
  <div class="footer-nav pointer-events-auto absolute bottom-20px left-1/2 flex items-center -translate-x-1/2">
    <!--    <button class="left-btn" type="button" /> -->
    <ul class="footer-nav-options mx-5 flex gap-5">
      <li
        v-for="(nav) in navList" :key="nav.label"
        class="group group footer-nav-item relative">
        <CustomLink
          :route-name="nav.routeName" :is-link="nav.isLink" :link="nav.link"
          :disabled="nav.disabled"
          :class="cn(
            'first-item font-title',
            isActiveRoute(nav) ? 'active !text-white' : !nav.disabled ? '!text-#9E9E9E hover:!text-white' : '!text-#9E9E9E',
            I18nStore.lang === 'zhCN' ? 'tracking-widest text-20px' : 'text-14px',
            nav.disabled && 'disabled !cursor-not-allowed opacity-50',
          )">
          <span class="flex items-center text-nowrap leading-none">
            <i :class="[nav.icon, isActiveRoute(nav) ? 'text-#FFD779' : !nav.disabled ? 'group-hover:text-white' : '']" class="mr-1 flex-shrink-0 text-14px" />
            <span>{{ $t(nav.label) }}</span>
          </span>
        </CustomLink>

        <div v-if="nav.child" class="box children absolute bottom-45px left-1/2 origin-bottom-center scale-y-0 px-2 py-3 transition-transform -translate-x-1/2 group-hover:scale-y-100 space-y-3">
          <CustomLink
            v-for="child in nav.child" :key="child.label"
            :route-name="child.routeName" :is-link="child.isLink" :link="child.link"
            :disabled="child.disabled"
            :class="cn(
              'subtitle block px-2 py-2 font-title',
              isActiveRoute(child) ? 'active !text-white' : !(nav.disabled || child.disabled) ? '!text-#9E9E9E hover:!text-white' : '!text-#9E9E9E',
              I18nStore.lang === 'zhCN' ? 'tracking-widest text-20px' : 'text-14px',
              nav.disabled || child.disabled && 'disabled !cursor-not-allowed opacity-50',
            )">
            <span class="flex items-center text-nowrap leading-none">
              <i :class="[child.icon, isActiveRoute(child) ? 'text-#FFD779' : !(nav.disabled || child.disabled) ? 'group-hover:text-white' : '']" class="mr-2 flex-shrink-0 text-14px" />
              <span>{{ $t(child.label) }}</span>
            </span>
          </CustomLink>
        </div>
      </li>
    </ul>
    <!--    <button class="right-btn" type="button" /> -->
  </div>
</template>

<style scoped lang="scss">
.footer-nav {
  .footer-nav-options {
    .footer-nav-item {
      :deep(.first-item) {
        @apply relative block -skew-x-30 pl-3 pr-3 py-2;
        & > span {
          @apply skew-x-30;
        }
        &:before {
          @apply translate-5px;
        }
        &:before,
        &:after {
          content: "";
          // transition-all
          @apply wh-full absolute inset-0 rounded backdrop-blur-lg -z-1;
        }
        &:not(.active) {
          &:before,
          &:after {
            mask: linear-gradient(150deg, rgba(0, 0, 0, 0.1) 0%, #000 100%);
            @apply border border-#96969699 bg-#BFBFBF1A;
          }
        }
        &.active {
          &:after {
            background:
              linear-gradient(104deg, rgba(255, 255, 255, 0) 3%, rgba(255, 179, 179, 0.1) 100%),
              linear-gradient(
                180deg,
                rgba(255, 71, 71, 0.5) 0%,
                rgba(255, 106, 106, 0.5) 50%,
                rgba(226, 36, 36, 0.5) 100%
              );
            border: 1px solid #ff6666;
            backdrop-filter: blur(11px);
            box-shadow: inset 2.2px 2.2px 2.2px 0px rgba(255, 77, 77, 0.5);
          }
          &:before {
            mask: linear-gradient(150deg, transparent 0%, #000 100%);
            @apply border border-#FF6969 bg-#BFBFBF1A;
          }
        }
      }
      :deep(.children) {
        @apply border border-#616161 rounded bg-gradient-to-b from-black/60 to-#313131/50 backdrop-blur;
        a {
          @apply relative;
          &.active:after {
            content: "";
            @apply absolute inset-0 w-full h-full border-b-2 border-l-2 border-r-2 border-red bg-#FF6969/20 pointer-events-auto -z-1;
            mask: linear-gradient(135deg, transparent 0%, #000 100%);
          }
        }
      }
    }
  }

  .left-btn,
  .right-btn {
    @apply w-21px h-44px bg-transparent;
    background: url("@/assets/images/red/layout/footer-nav-arrow.png") no-repeat center / 100%;
    &:hover {
      background-image: url("@/assets/images/red/layout/footer-nav-arrow-active.png");
    }
  }
  //.left-btn {
  //}
  .right-btn {
    transform: rotate(180deg);
  }
}
</style>
