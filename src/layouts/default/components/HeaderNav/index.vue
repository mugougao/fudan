<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useState } from "@/hooks";
import { useI18nStore } from "@/stores/i18n.ts";
import { useUserStore } from "@/stores/user.ts";
import { localWeather } from "@/utils/localWeather.ts";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";
import AnniversaryBtn from "./components/AnniversaryBtn/index.vue";
import LayerControl from "./components/LayerControl/index.vue";
import WeatherControl from "./components/WeatherControl/index.vue";

defineOptions({ name: "HeaderNav" });

const i18nStore = useI18nStore();
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const now = useNow();
const dateFormat = useDateFormat(now, "YYYY/MM/DD");
const timeFormat = useDateFormat(now, "HH:mm:ss");

const [showLayerControl, setShowLayerControl] = useState(false);

// 点击“logo”回到初始视角
function logoClick() {
  const jsondata = {
    targetPosition: [121.50088967397845, 31.29153510205151, 516.557733098433],
    rotation: { pitch: -30.000194549560547, yaw: -90.00012969970703 },
    distance: 200,
    flyTime: 1,
  };
  wdpMap.app?.CameraControl.FlyTo(jsondata);
}

async function handleLogout() {
  await window.$confirm({ title: t("message.logout"), content: t("message.logoutTip") });
  userStore.logoutAction();
  await router.push("/login");
}

const cityInfo = ref({ cityName: "", weather: "", temp: "" });
onMounted(async () => {
  await localWeather.init();
  const { city = "上海市", dayweather = "晴", daytemp = "0", nighttemp = "0" } = localWeather.weatherInfo;
  cityInfo.value = { cityName: city, weather: dayweather, temp: `${nighttemp}~${daytemp}°C` };
});
</script>

<template>
  <header class="header-nav pointer-events-auto absolute left-0 right-0 top-0 h-[94px] w-full flex items-start px-5 pt-2">
    <div class="header-nav-left flex flex-1 items-center">
      <div class="header-nav-info flex items-center leading-tight">
        <span>
          <span class="icon mr-2 text-[18px] font-bold">{{ cityInfo.weather }}</span>
          <span>
            <span>weather.</span>
            <span>{{ cityInfo.temp }}</span>
          </span>
        </span>
        <span>
          <span>
            <span>{{ dateFormat }}</span>
            <span>{{ timeFormat }}</span>
          </span>
        </span>
        <span>
          <span>
            <span>base.</span>
            <span>{{ cityInfo.cityName }}</span>
          </span>
        </span>
      </div>
      <I18nSwitch />
    </div>

    <div class="header-nav-center w-[740px] flex flex-col shrink-0 items-center justify-start">
      <span class="mb-2.5 flex items-center" @click="logoClick">
        <img src="@/assets/images/logo.png" alt="logo" class="mr-[12px] size-[40px]">
        <span class="text-[30px] tracking-wider font-title">复旦大学数智孪生校园</span>
      </span>
      <span class="text-[14px] text-white/75 tracking-widest">Fudan University's Digital Twin Campus</span>
    </div>

    <div class="header-nav-right flex flex-1 items-center justify-end">
      <CampusSelector />

      <!--   校庆按钮   -->
      <AnniversaryBtn />

      <div class="action-btn-box">
        <button class="action-btn" :title="$t('headerToolbar.layerControl')" @click="setShowLayerControl(true)">
          <i class="i-svg-icon-menu" />
        </button>
      </div>
      <!--   天气控制   -->
      <WeatherControl />

      <HasPermission permission="admin">
        <div class="action-btn-box">
          <button class="action-btn" :title="$t('headerToolbar.adminMgr')" @click="$router.push('/admin')">
            <i class="i-svg-icon-user" />
          </button>
        </div>
      </HasPermission>

      <div class="action-btn-box">
        <button class="action-btn" :title="$t('headerToolbar.signOut')" @click="handleLogout">
          <i class="i-svg-icon-logout" />
        </button>
      </div>
    </div>
  </header>

  <TransitionFadeIn>
    <LayerControl v-show="showLayerControl" class="pointer-events-auto absolute right-100px top-36px z-99" @close="setShowLayerControl(false)" />
  </TransitionFadeIn>
</template>

<style scoped lang="scss">
.header-nav {
  background: url("@/assets/images_new/layout_default/header-bg.png") no-repeat center top / cover;
  .header-nav-left {
    .header-nav-info {
      & > span {
        display: flex;
        align-items: center;
        position: relative;
        margin-right: 40px;
        & > span:not(.icon) {
          display: flex;
          flex-direction: column;
          & > span:first-child {
            font-size: 12px;
            color: rgba(#fff, 0.5);
          }
          & > span:last-child {
            font-size: 16px;
            color: #fff;
            font-family: "D-DIN", "AlibabaPuHuiTi-3-bold";
          }
        }

        &::after {
          content: "";
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 30px;
          background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0) 1%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      }
    }
  }

  .header-nav-right {
    :deep(.action-btn-box) {
      height: 40px;
      padding: 0 8px;
      background: linear-gradient(0deg, rgba(165, 94, 94, 0.3) 0%, rgba(165, 94, 94, 0) 100%);
      margin-left: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: skewX(-30deg);
      .action-btn {
        background-color: transparent;
        transform: skewX(30deg);
        & > i[class^="i-svg-icon-"] {
          background: linear-gradient(180deg, #f7efef 0%, #e8d1d1 47%, #975555 100%);
        }
      }
    }
  }
}
</style>
